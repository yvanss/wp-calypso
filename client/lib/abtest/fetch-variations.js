/** @format */

/**
 * Internal dependencies
 */
import activeTests from 'lib/abtest/active-tests';
import wpcom from 'lib/wp';

/**
 * Returns all active test names
 * @returns {String[]} All active test names with respective timestamp appended to the end
 */
function getTestNames() {
	return Object.keys( activeTests ).map( key => `${ key }_${ activeTests[ key ].datestamp }` );
}

export default function fetchVariations( userId, callback ) {
	wpcom.undocumented().getABTestData( getTestNames(), callback );
}
