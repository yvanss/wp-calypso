/** @format */
/**
 * External dependencies
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';
import { get, noop } from 'lodash';
import Gridicon from 'gridicons';

/**
 * Internal Dependencies
 */
import Dialog from 'components/dialog';
import FormTextInput from 'components/forms/form-text-input';

// /Users/spen/projects/wp-calypso/client/lib/domains/index.js
// checkDomainAvailability

class RenameSiteConfirmationDialog extends PureComponent {
	static propTypes = {
		isVisible: PropTypes.bool.isRequired,
		onConfirm: PropTypes.func.isRequired,
		onClose: PropTypes.func.isRequired,
	};

	static defaultProps = {
		onConfirm: noop,
		currentDomainSuffix: '.wordpress.com',
		newDomainSuffix: '.wordpress.com',
	};

	state = {
		confirmationTypedCorrectly: false,
		confirmationValue: '',
	};

	onConfirmChange = event => {
		const confirmationValue = get( event, 'target.value' );
		const confirmationTypedCorrectly =
			confirmationValue === `${ this.props.newDomainName }.wordpress.com`;

		this.setState( {
			confirmationValue,
			confirmationTypedCorrectly,
		} );
	};

	onConfirm = closeDialog => {
		this.props.onConfirm( this.props.targetSite, closeDialog );
	};

	render() {
		const {
			disabledDialogButtons,
			isVisible,
			newDomainName,
			newDomainSuffix,
			currentDomainName,
			currentDomainSuffix,
			translate,
		} = this.props;
		const buttons = [
			{
				action: 'cancel',
				label: translate( 'Cancel' ),
				disabled: disabledDialogButtons,
			},
			{
				action: 'confirm',
				label: translate( 'Change Site Address' ),
				onClick: this.onConfirm,
				disabled: disabledDialogButtons || ! this.state.confirmationTypedCorrectly,
				isPrimary: true,
			},
		];

		return (
			<Dialog
				className="simple-site-rename-form__dialog"
				isVisible={ isVisible }
				buttons={ buttons }
				onClose={ this.props.onClose }
			>
				<h1>{ translate( "Let's Review" ) }</h1>
				<p>
					{ translate(
						'You are about top change your domain name. Once changed, ' +
						'your previous domain name will be unavailable for you or anyone else.'
					) }
				</p>
				<div className="somethingg-else">
					<Gridicon icon="cross-circle" size={ 18 } />
					<span className="somethingg">
						<p>
							<strong className="simple-site-rename-form__copy-red">
								{ currentDomainName }
							</strong>
							{ currentDomainSuffix }
						</p>
						<p>{ translate( 'Will be removed and unavailable for use.' ) }</p>
					</span>
				</div>
				<div className="somethingg-else">
					<Gridicon icon="checkmark-circle" size={ 18 } />
					<span className="somethingg">
						<p>
							<strong className="simple-site-rename-form__copy-green">
								{ newDomainName }
							</strong>
							{ newDomainSuffix }
						</p>
						<p>{ translate( 'Will be your new primary domain.' ) }</p>
					</span>
				</div>
				<FormTextInput value={ this.state.confirmationValue } onChange={ this.onConfirmChange } />
			</Dialog>
		);
	}
}

export default localize( RenameSiteConfirmationDialog );
