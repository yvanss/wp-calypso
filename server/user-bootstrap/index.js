/** @format */
const superagent = require( 'superagent' );
const debug = require( 'debug' )( 'calypso:bootstrap' );
const crypto = require( 'crypto' );

const config = require( 'config' );
const API_KEY = config( 'wpcom_calypso_rest_api_key' );
const userUtils = require( './shared-utils' );
const AUTH_COOKIE_NAME = 'wordpress_logged_in';

/**
 * WordPress.com REST API /me endpoint.
 */
const url = 'https://public-api.wordpress.com/rest/v1/me?meta=flags';
function bindAuthorizationToRequest( request, authCookieValue, callback ) {
	authCookieValue = decodeURIComponent( authCookieValue );

	if ( typeof API_KEY !== 'string' ) {
		callback( new Error( 'Unable to boostrap user because of invalid API key in secrets.json' ) );
		return;
	}

	const hmac = crypto.createHmac( 'md5', API_KEY );
	hmac.update( authCookieValue );
	const hash = hmac.digest( 'hex' );

	request.set( 'Authorization', 'X-WPCALYPSO ' + hash );
	request.set( 'Cookie', AUTH_COOKIE_NAME + '=' + authCookieValue );
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
		callback( null, user );
	} );
};
