/** @format */
/**
 * Internal dependencies
 */
import wpcom from 'lib/wp';
import {
	SITE_RENAME_REQUEST,
	SITE_RENAME_REQUEST_FAILURE,
	SITE_RENAME_REQUEST_SUCCESS,
} from 'state/action-types';
import { fetchDomains } from 'lib/upgrades/actions';

/* possible outcomes:
	SUCCESS
		Domains are a flux store - need to refetch this data and update the UI on success
			- The path would also need to update:
				domains/manage/old.wordpress.com/edit/old.wordpress.com would no longer make sense ofc.

	FAILURE
		Address is already taken - display message to this effect
		Do we need to handle auth issues? Surely they would already be authed?
		General failure? (Server error etc.)
*/

export const requestSiteRename = ( siteId, newBlogName, discard ) => dispatch => {
	dispatch( {
		type: SITE_RENAME_REQUEST,
		siteId,
	} );

	return wpcom
		.undocumented()
		.updateSiteName( siteId, newBlogName, discard )
		.then( ( { new_slug } ) => {
			fetchDomains( siteId );

			dispatch( {
				type: SITE_RENAME_REQUEST_SUCCESS,
				newSlug: new_slug,
				siteId,
			} );
		} )
		.catch( error => {
			dispatch( {
				type: SITE_RENAME_REQUEST_FAILURE,
				error: error.message,
				siteId,
			} );
		} );
};
