/** @format */
/**
 * External dependencies
 */
import React from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { SimpleSiteRenameForm } from '../';

const SimpleSiteRenameFormExample = ( { siteId, siteSlug, translate } ) => {
	const currentDomainNameStub = {
		name: 'something-awesome.wordpress.com',
		type: 'WPCOM',
	};
	const selectedSiteId = 73946047;
	const currentDomainPrefix = 'something-awesome';
	const currentDomainSuffix = '.wordpress.com';

	return (
		<SimpleSiteRenameForm
			translate={ translate }
			currentDomainName={ currentDomainNameStub }
			currentDomainPrefix={ currentDomainPrefix }
			currentDomainSuffix={ currentDomainSuffix }
			selectedSiteId={ selectedSiteId }
		/>
	);
};

const EnhancedComponent = localize( SimpleSiteRenameFormExample );

EnhancedComponent.displayName = 'SimpleSiteRenameForm';

export default EnhancedComponent;
