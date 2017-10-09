/**
 * External dependencies
 *
 * @format
 */

import PropTypes from 'prop-types';
import React from 'react';
import { some } from 'lodash';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import { generateGalleryShortcode } from 'lib/media/utils';
import GalleryShortcode from 'components/gallery-shortcode';

export default class EditorMediaModalGalleryPreviewShortcode extends React.Component {
	static displayName = 'EditorMediaModalGalleryPreviewShortcode';

	static propTypes = {
		siteId: PropTypes.number,
		settings: PropTypes.object,
	};

	constructor() {
		super();
		this._isMounted = false;
	}

	state = {
		isLoading: true,
		shortcode: generateGalleryShortcode( this.props.settings ),
	};

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	componentWillReceiveProps( nextProps ) {
		const shortcode = generateGalleryShortcode( nextProps.settings );
		if ( this.state.shortcode === shortcode ) {
			return;
		}

		this.setState( {
			isLoading: true,
			shortcode,
		} );
	}

	setLoaded = () => {
		if ( ! this._isMounted ) {
			return;
		}

		this.setState( {
			isLoading: false,
		} );
	};

	render() {
		const { siteId, settings } = this.props;
		const { isLoading, shortcode } = this.state;
		const classes = classNames( 'editor-media-modal-gallery__preview-shortcode', {
			'is-loading': isLoading || some( settings.items, 'transient' ),
		} );

		return (
			<div className={ classes }>
				<GalleryShortcode siteId={ siteId } onLoad={ this.setLoaded }>
					{ shortcode }
				</GalleryShortcode>
			</div>
		);
	}
}
