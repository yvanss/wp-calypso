/** @format */
/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import {
	storeUserAndToken,
	getQueryParameter,
	USER_PARAM,
	TOKEN_PARAM,
} from 'lib/user/support-user-interop';

const cleanHistory = () => {
	const url = window.location.toString();

	if ( url.indexOf( '?' ) > 0 ) {
		const cleanUrl = url.substring( 0, url.indexOf( '?' ) );
		window.history.replaceState( {}, document.title, cleanUrl );
	}
};

export default function() {
	page( '/support-user', () => {
		const user = getQueryParameter( USER_PARAM );
		const token = getQueryParameter( TOKEN_PARAM );

		cleanHistory();
		storeUserAndToken( user, token );

		return page.redirect( '/' );
	} );
}
