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

import page from 'page';

import { requestSite } from 'state/sites/actions';

import { getSite } from 'state/sites/selectors';

import { setPrimaryDomain } from 'lib/upgrades/actions/domain-management';

import { domainManagementList, domainManagementEdit } from 'my-sites/domains/paths';

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
	console.log( siteId, newBlogName, discard );
	dispatch( {
		type: SITE_RENAME_REQUEST,
		siteId,
	} );

	return wpcom
		.undocumented()
		.updateSiteName( siteId, newBlogName, discard )
		// .then( ( { ...data } ) => {
		.then( ( { ...data } ) => {

			console.log( data );

			if ( data.new_slug ) {
				console.log( '--__', data.new_slug )
			}

			dispatch( requestSite( siteId ) )
				.then(
					() => page( domainManagementEdit( newBlogName + '.wordpress.com' ) )
				)

			dispatch( {
				type: SITE_RENAME_REQUEST_SUCCESS,
				newSlug: data.new_slug,
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
