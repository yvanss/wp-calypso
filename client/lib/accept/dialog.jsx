/**
 * External dependencies
 *
 * @format
 */

import PropTypes from 'prop-types';
import React from 'react';
import { localize } from 'i18n-calypso';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Dialog from 'components/dialog';

class AcceptDialog extends React.Component {
	static propTypes = {
		translate: PropTypes.func,
		message: PropTypes.node,
		onClose: PropTypes.func.isRequired,
		confirmButtonText: PropTypes.node,
		cancelButtonText: PropTypes.node,
		options: PropTypes.object,
	};

	constructor() {
		super();
		this._isMounted = false;
	}

	state = { isVisible: true };

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	onClose = action => {
		this.props.onClose( 'accept' === action );

		if ( this._isMounted ) {
			this.setState( { isVisible: false } );
		}
	};

	getActionButtons = () => {
		const { options } = this.props;
		const isScary = options && options.isScary;
		const additionalClassNames = classnames( { 'is-scary': isScary } );
		return [
			{
				action: 'cancel',
				label: this.props.cancelButtonText
					? this.props.cancelButtonText
					: this.props.translate( 'Cancel' ),
			},
			{
				action: 'accept',
				label: this.props.confirmButtonText
					? this.props.confirmButtonText
					: this.props.translate( 'OK' ),
				isPrimary: true,
				additionalClassNames,
			},
		];
	};

	render() {
		if ( ! this.state.isVisible ) {
			return null;
		}

		return (
			<Dialog
				buttons={ this.getActionButtons() }
				onClose={ this.onClose }
				className="accept-dialog"
				isVisible
			>
				{ this.props.message }
			</Dialog>
		);
	}
}

export default localize( AcceptDialog );
