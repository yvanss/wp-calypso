/**
 * @format
 */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';

export default class TokenInput extends React.PureComponent {
	static propTypes = {
		onChange: PropTypes.func,
		onBlur: PropTypes.func,
		value: PropTypes.string,
		placeholder: PropTypes.string,
		disabled: PropTypes.bool,
	};

	static defaultProps = {
		onChange: function() {},
		onBlur: function() {},
		value: '',
		disabled: false,
		placeholder: '',
	};

	constructor() {
		super();
		this._isMounted = false;
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		const props = { ...this.props, onChange: this._onChange };
		const { value, placeholder } = props;
		const size =
			( ( value.length === 0 && placeholder && placeholder.length ) || value.length ) + 1;

		return (
			<input ref="input" type="text" { ...props } size={ size } className="token-field__input" />
		);
	}

	focus = () => {
		if ( this._isMounted ) {
			this.refs.input.focus();
		}
	};

	hasFocus = () => {
		return this._isMounted && this.refs.input === document.activeElement;
	};

	_onChange = event => {
		this.props.onChange( {
			value: event.target.value,
		} );
	};
}
