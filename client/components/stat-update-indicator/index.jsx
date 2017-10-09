/**
 * External dependencies
 *
 * @format
 */

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
export default class StatUpdateIndicator extends React.Component {
	static propTypes = {
		children: PropTypes.node.isRequired,
		updateOn: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number, PropTypes.bool ] )
			.isRequired,
	};

	constructor() {
		super();
		this._isMounted = false;
	}

	state = {
		updating: ! this.props.updateOn,
	};

	componentDidMount() {
		this._isMounted = true;
		this.clearTheUpdate();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	componentWillReceiveProps( nextProps ) {
		if ( this.props.updateOn !== nextProps.updateOn ) {
			clearTimeout( this.clearingUpdateTimeout );

			this.setState( {
				updating: true,
			} );
			this.clearTheUpdate();
		}
	}

	clearTheUpdate = () => {
		clearTimeout( this.clearingUpdateTimeout );

		this.clearingUpdateTimeout = setTimeout(
			function() {
				if ( ! this._isMounted ) {
					return;
				}

				this.setState( {
					updating: false,
				} );
			}.bind( this ),
			800
		);
	};

	render() {
		var className = classNames( {
			'stat-update-indicator': true,
			'is-updating': this.state.updating,
		} );

		return <span className={ className }>{ this.props.children }</span>;
	}
}
