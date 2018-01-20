/** @format */
const superagent = require( 'superagent' );
const debug = require( 'debug' )( 'calypso:bootstrap' );
const crypto = require( 'crypto' );

const config = require( 'config' );
const API_KEY = config( 'wpcom_calypso_rest_api_key' );
const userUtils = require( './shared-utils' );
const activeTests = require( 'client/lib/abtest/active-tests' );
const AUTH_COOKIE_NAME = 'wordpress_logged_in';

/**
 * WordPress.com REST API /me endpoint.
 */
const url = 'https://public-api.wordpress.com/rest/v1/me?meta=flags';
const abVariationsUrl = 'https://public-api.wordpress.com/rest/v1.1/me/abtests';

function getTestNames() {
	return Object.keys( activeTests ).map( key => `${ key }_${ activeTests[ key ].datestamp }` );
}

function bindAuthorizationToRequest( request, authCookieValue, callback ) {
	authCookieValue = decodeURIComponent( authCookieValue );

	if ( typeof API_KEY !== 'string' ) {
		callback( new Error( 'Unable to boostrap user because of invalid API key in secrets.json' ) );
		return;
	}

	const hmac = crypto.createHmac( 'md5', API_KEY );
	hmac.update( authCookieValue );
	const hash = hmac.digest( 'hex' );

	request.set( 'Authorization', `X-WPCALYPSO ${ hash }` );
	request.set( 'Cookie', `${ AUTH_COOKIE_NAME }=${ authCookieValue }` );
	request.set( 'User-Agent', 'WordPress.com Calypso' );
}

module.exports = function( authCookieValue, callback ) {
	// create HTTP Request object
	const req = superagent.get( url );

	if ( authCookieValue ) {
		bindAuthorizationToRequest( req, authCookieValue, callback );
	}

	// start the request
	req.end( function( err, response ) {
		if ( err && ! response ) {
			return callback( err );
		}

		const { body, status: statusCode } = response;

		debug( '%o -> %o status code', url, statusCode );

		if ( err ) {
			const error = new Error();
			error.statusCode = statusCode;
			for ( const key in body ) {
				error[ key ] = body[ key ];
			}

			return callback( error );
		}

		const user = userUtils.filterUserObject( body );
		if ( config.isEnabled( 'wpcom-user-bootstrap-ab-variations' ) && user.ID ) {
			/* NOTE: Currently doesn't work as intended due to authorization issues and is thus feature gated.
			 * Error body:
				{
					"error":"unauthorized",
					"message":"That API call is not allowed for this account."
				}
			*/
			debug( 'Fetching A/B test variation assignment for user' );
			const variationReq = superagent.get( abVariationsUrl, getTestNames() );
			if ( authCookieValue ) {
				bindAuthorizationToRequest( variationReq, authCookieValue, callback );
			}
			variationReq.end( function( variationErr, variationResponse ) {
				if ( variationErr ) {
					// Skip trying to fetch variation data
					debug( 'Failed to fetch variation data', variationErr );
					return callback( null, user );
				}
				const { body: variationBody, status: variationStatusCode } = variationResponse;
				debug( '%o -> %o status code', abVariationsUrl, variationStatusCode );

				user.abtests = variationBody;
				callback( null, user );
			} );
		} else {
			callback( null, user );
		}
	} );
};
