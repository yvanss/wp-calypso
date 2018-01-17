/** @format */
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { noop } from 'lodash';
/**
 * Internal dependencies
 */
import Popover from 'components/popover';
import FormFieldset from 'components/forms/form-fieldset';
import FormTextInput from 'components/forms/form-text-input';
import FormButton from 'components/forms/form-button';
import FormLabel from 'components/forms/form-label';

class Translatable extends Component {
	state = {
		showTooltip: false,
	};

	refCallback = elem => ( this.elem = elem );
	togglePopover = event => {
		event.preventDefault();
		this.setState( { showTooltip: true } );
	};

	render() {
		return (
			<data
				title={ 'do it' }
				className="translatable translatable__community-translator"
				onContextMenu={ this.togglePopover }
				ref={ this.refCallback }
				{ ...this.props }
			>
				{ this.props.children }
				<Popover
					isVisible={ this.state.showTooltip }
					context={ this.elem }
					onClose={ noop }
					position="bottom"
					className="translatable__popover popover"
				>
					<FormFieldset>
						<FormLabel htmlFor="something">something</FormLabel>
						<FormTextInput name="something" placeholder="something" />
					</FormFieldset>
					<FormButton type="button" isPrimary={ true }>
						Submit something
					</FormButton>
				</Popover>
			</data>
		);
	}
}

export default Translatable;
