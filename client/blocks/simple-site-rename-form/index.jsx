/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';
import { noop, get, flow } from 'lodash';
import Gridicon from 'gridicons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import FormButton from 'components/forms/form-button';
import FormTextInputWithAffixes from 'components/forms/form-text-input-with-affixes';
import ConfirmationDialog from './dialog';
import FormSectionHeading from 'components/forms/form-section-heading';
import { checkDomainAvailability } from 'lib/domains';

import { domainAvailability } from 'lib/domains/constants';

import { requestSiteRename } from 'state/site-rename/actions';
import {
	getSiteRenameStatus,
	isRequestingSiteRename,
} from 'state/selectors';

import { getSelectedSiteId } from 'state/ui/selectors';

const { AVAILABLE, TRANSFERRABLE, UNKNOWN } = domainAvailability;

// /Users/spen/projects/wp-calypso/client/signup/steps/domains/index.jsx

// what happens currently when you try to change a x.blog domain?

import wpcom from 'lib/wp';

// console.log( { wpcom } )

const fakeTime =
	// 0;
	1000;

export class SimpleSiteRenameForm extends Component {
	static defaultProps = {
		currentDomainSuffix: '.wordpress.com',
		currentDomainName: {
			name: 'default.wordpress.com',
			type: 'WPCOM',
		},
	};

	state = {
		showDialog: false,
		domainFieldValue: '',
	};

	onSubmit = event => {
		event.preventDefault();

		// check for validity
		this.checkDomainAvailability();
		// this.setState( {
		// 	isBusy: true,
		// } );

		// setTimeout(
		// 	this.checkDomainAvailability,
		// 	fakeTime
		// )
	};

	checkDomainAvailability = () => {
		const { selectedSiteId, siteRenameStatus, isSiteRenameRequesting, currentDomainSuffix } = this.props;
		const newDomainName = this.state.domainFieldValue;

		// console.log( {
		// 	newDomainName,
		// 	siteRenameStatus,
		// 	isSiteRenameRequesting,
		// 	domainFieldValue: this.state.domainFieldValue,
		// 	currentDomainSuffix,
		// } );
		// return;

		// const { siteId } = this.props;
		// const newBlogName = 'abcspentaylor';
		const discard = false;

		this.props.requestSiteRename( selectedSiteId, newDomainName, discard );

		// this.props.requestSiteRename( )

		this.setState( {
			isBusy: true,
		} );

	}

	showUnavailable() {
		this.setState( {
			domainUnavailible: true,
			isBusy: false,
		} );
	}

	showConfirmationDialog() {
		this.setState( {
			showDialog: true,
			domainUnavailible: false,
			isBusy: false,
		} );
	}

	onDialogClose = () => {
		this.setState( {
			showDialog: false,
		} );
	};

	onFieldChange = event => {
		this.setState( { domainFieldValue: get( event, 'target.value' ) } );
	};

	render() {
		const { currentDomainPrefix, currentDomainName, translate, currentDomainSuffix } = this.props;

		// This may need more consideration given the new x.music.blog type domains
		const isWPCOM = currentDomainName.type === 'WPCOM';
		// This is naive - there's surely a better way.
		// const domainPrefix = currentDomainName.name.replace( currentDomainSuffix, '' );

		const isDisabled =
			// ! isWPCOM || ! this.state.domainFieldValue || this.state.domainFieldValue === domainPrefix;
			! isWPCOM || ! this.state.domainFieldValue || this.state.domainFieldValue === currentDomainPrefix;

		const { selectedSiteId, siteRenameStatus, isSiteRenameRequesting } = this.props;
		const newDomainName = this.state.domainFieldValue + this.props.currentDomainSuffix;

		// console.log( {
			// newDomainName,
			// siteRenameStatus,
			// isSiteRenameRequesting
		// } );

		return (
			<div className="simple-site-rename-form">
				<ConfirmationDialog
					isVisible={ this.state.showDialog }
					onClose={ this.onDialogClose }
					newDomainName={ this.state.domainFieldValue }
					currentDomainPrefix={ currentDomainSuffix }
				/>
				<form onSubmit={ this.onSubmit }>
					<Card className="simple-site-rename-form__content">
						<FormSectionHeading>{ translate( 'Edit Domain Name' ) }</FormSectionHeading>
						<FormTextInputWithAffixes
							type="text"
							value={ this.state.domainFieldValue }
							suffix={ currentDomainSuffix }
							onBlur={ noop }
							onChange={ this.onFieldChange }
							onFocus={ noop }
							placeholder={ currentDomainPrefix }
						/>
						<div className="simple-site-rename-form__footer">
							<div className="simple-site-rename-form__info">
								<Gridicon icon="info-outline" size={ 18 } />
								<p>
									{ translate(
										'Once changed, previous domain names will no longer be available.'
									) }
								</p>
							</div>
							<FormButton disabled={ isDisabled } busy={ this.props.isSiteRenameRequesting } type="submit">
								{ translate( 'Change Site Address' ) }
							</FormButton>
						</div>
						{ this.state.domainUnavailible && <p>Domain Unavailable</p> }
					</Card>
					{ /* <CompactCard className="simple-site-rename-form__footer">
											<div className="simple-site-rename-form__info">
												<Gridicon icon="info-outline" size={ 18 } />
												<p>
													{ translate( 'Once changed, previous domain names will no longer be available.' ) }
												</p>
											</div>
											<FormButton disabled={ isDisabled } type="submit">
												{ translate( 'Change Site Address' ) }
											</FormButton>
										</CompactCard>


		is-busy class for loading
		icon="checkmark"
		<PopoverMenuItem disabled icon="cross-circle">


									*/


									}
				</form>
			</div>
		);
	}
}

export default flow(
	localize,
	connect(
		state => {
			const siteId = getSelectedSiteId( state );

			return {
				selectedSiteId: siteId,
				siteRenameStatus: getSiteRenameStatus( state, siteId ),
				isSiteRenameRequesting: isRequestingSiteRename( state, siteId ),
			};
		},
		// dispatch =>
		// 	bindActionCreators(
				{
					requestSiteRename,
				// },
				// dispatch
			// )
		}
	)
)( SimpleSiteRenameForm );
