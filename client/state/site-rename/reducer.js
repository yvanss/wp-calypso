/** @format */
/**
 * Internal dependencies
 */
import { combineReducers, createReducer } from 'state/utils';
import {
	SITE_RENAME_REQUEST,
	SITE_RENAME_REQUEST_FAILURE,
	SITE_RENAME_REQUEST_SUCCESS,
} from 'state/action-types';

// I'm not entirely sure of final design of the state here - what data is actually useful to the UI?
// requesting is, error message/state is. I'm not sure the new slug is though.

/**
 * Returns the updated request state after an action has been dispatched. The
 * state maps site ID keys to a boolean value. Each site is true if
 * a site-rename request is currently taking place, and false otherwise.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action payload
 * @return {Object}        Updated rename request state
 */
export const requesting = createReducer(
	{},
	{
		[ SITE_RENAME_REQUEST ]: ( state, { siteId } ) => console.log( SITE_RENAME_REQUEST, siteId ) || ( { ...state, [ siteId ]: true } ),
		[ SITE_RENAME_REQUEST_SUCCESS ]: ( state, { siteId } ) => console.log( SITE_RENAME_REQUEST_SUCCESS, siteId ) || ( {
			...state,
			[ siteId ]: false,
		} ),
		[ SITE_RENAME_REQUEST_FAILURE ]: ( state, { siteId } ) => console.log( SITE_RENAME_REQUEST_FAILURE, siteId ) || ( {
			...state,
			[ siteId ]: false,
		} ),
	}
);

/**
 * Returns the updated site-rename state after an action has been dispatched.
 * Saving state tracks whether the settings for a site are currently being saved.
 *
 * @param  {Object} state 	Current rename requesting state
 * @param  {Object} action 	Action object
 * @return {Object} 		Updated rename request state
 */
const status = createReducer(
	{},
	{
		[ SITE_RENAME_REQUEST ]: ( state, { siteId } ) => ( {
			...state,
			[ siteId ]: {
				status: 'pending',
				error: false,
			},
		} ),
		[ SITE_RENAME_REQUEST_SUCCESS ]: ( state, { siteId } ) => ( {
			...state,
			[ siteId ]: {
				status: 'success',
				error: false,
			},
		} ),
		[ SITE_RENAME_REQUEST_FAILURE ]: ( state, { siteId, error } ) => ( {
			...state,
			[ siteId ]: {
				status: 'error',
				error,
			},
		} ),
	}
);

export default combineReducers( {
	status,
	requesting,
} );
