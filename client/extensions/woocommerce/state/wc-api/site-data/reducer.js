/** @format */

/**
 * Internal dependencies
 */
import { combineReducers, keyedReducer } from 'state/utils';
import products from './products/reducer';

const reducers = {
	products,
};

const reducer = combineReducers( reducers );

export default keyedReducer( 'siteId', reducer );
