/** @format */

/**
 * External dependencies
 */
import ReactDom from 'react-dom';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { findIndex, get, head, includes, isEmpty, map, reject } from 'lodash';

/**
 * Internal dependencies
 */
import EditorRevisionsListHeader from './header';
import EditorRevisionsListItem from './item';
import { selectPostRevision } from 'state/posts/revisions/actions';
import { getPostRevision, getPostRevisionsSelectedRevisionId } from 'state/selectors';
import KeyboardShortcuts from 'lib/keyboard-shortcuts';

import PostEditStore from 'lib/posts/post-edit-store';

class EditorRevisionsList extends PureComponent {
	static propTypes = {
		postId: PropTypes.number,
		siteId: PropTypes.number,
		revisions: PropTypes.array.isRequired,
		selectedRevisionId: PropTypes.number,
	};

	trySelectingInterval = null;

	selectRevision = revisionId => {
		clearInterval( this.trySelectingInterval );
		this.props.selectPostRevision( revisionId );
	};

	trySelectingFirstRevision = () => {
		const { revisions, newRevisionIds } = this.props;
		if ( isEmpty( revisions ) || ! isEmpty( newRevisionIds ) ) {
			return;
		}
		const firstRevision = head( revisions );
		if ( ! firstRevision.id ) {
			return;
		}
		this.selectRevision( firstRevision.id );
	};

	componentDidMount() {
		// Make sure that scroll position in the editor is not preserved.
		window.scrollTo( 0, 0 );

		KeyboardShortcuts.on( 'move-selection-up', this.selectNextRevision );
		KeyboardShortcuts.on( 'move-selection-down', this.selectPreviousRevision );

		if ( ! this.props.selectedRevisionId ) {
			this.trySelectingInterval = setInterval( this.trySelectingFirstRevision, 500 );
		}
	}

	componentWillUnmount() {
		KeyboardShortcuts.off( 'move-selection-up', this.selectNextRevision );
		KeyboardShortcuts.off( 'move-selection-down', this.selectPreviousRevision );

		clearInterval( this.trySelectingInterval );
	}

	componentDidUpdate() {
		this.scrollToSelectedItem();
	}

	scrollToSelectedItem() {
		const thisNode = ReactDom.findDOMNode( this );
		const scrollerNode = thisNode.querySelector( '.editor-revisions-list__scroller' );
		const selectedNode = thisNode.querySelector( '.editor-revisions-list__revision.is-selected' );
		const listNode = thisNode.querySelector( '.editor-revisions-list__list' );
		if ( ! ( scrollerNode && selectedNode && listNode ) ) {
			return;
		}
		const { bottom: selectedBottom, top: selectedTop } = selectedNode.getBoundingClientRect();
		const { top: listTop } = listNode.getBoundingClientRect();
		const {
			bottom: scrollerBottom,
			height: scrollerHeight,
			top: scrollerTop,
		} = scrollerNode.getBoundingClientRect();

		const isAboveBounds = selectedTop < scrollerTop;
		const isBelowBounds = selectedBottom > scrollerBottom;

		const targetWhenAbove = selectedTop - listTop;
		const targetWhenBelow = Math.abs( scrollerHeight - ( selectedBottom - listTop ) );

		isAboveBounds && scrollerNode.scrollTo( 0, targetWhenAbove );
		isBelowBounds && scrollerNode.scrollTo( 0, targetWhenBelow );
	}

	selectNextRevision = () => {
		const { nextRevisionId } = this.props;
		nextRevisionId && this.selectRevision( nextRevisionId );
	};

	selectPreviousRevision = () => {
		const { prevRevisionId } = this.props;
		prevRevisionId && this.selectRevision( prevRevisionId );
	};

	render() {
		const { postId, revisions, selectedRevisionId, siteId, newRevisionIds } = this.props;

		return (
			<div className="editor-revisions-list">
				<EditorRevisionsListHeader numRevisions={ revisions.length } />
				<div className="editor-revisions-list__scroller">
					<ul className="editor-revisions-list__list">
						{ isEmpty( revisions ) &&
							isEmpty( newRevisionIds ) && (
								<div className={ 'editor-revisions-list__revision-placeholder' } />
							) }
						{ map( newRevisionIds, revisionId => {
							return (
								<div
									key={ 'new-' + revisionId }
									className="editor-revisions-list__revision-placeholder"
								/>
							);
						} ) }
						{ map( revisions, revision => {
							const itemClasses = classNames( 'editor-revisions-list__revision', {
								'is-selected': revision.id === selectedRevisionId,
							} );
							return (
								<li className={ itemClasses } key={ revision.id }>
									<EditorRevisionsListItem
										postId={ postId }
										revision={ revision }
										siteId={ siteId }
									/>
								</li>
							);
						} ) }
					</ul>
				</div>
			</div>
		);
	}
}

const filterNewRevisionsIds = ( newRevisionIds, revisions ) =>
	reject( newRevisionIds, x => includes( map( revisions, 'id' ), x ) );

export default connect(
	( state, { revisions } ) => {
		const selectedRevisionId = getPostRevisionsSelectedRevisionId( state );
		const selectedIdIndex = findIndex( revisions, { id: selectedRevisionId } );
		const nextRevisionId = selectedRevisionId && get( revisions, [ selectedIdIndex - 1, 'id' ] );
		const prevRevisionId = selectedRevisionId && get( revisions, [ selectedIdIndex + 1, 'id' ] );
		const revisionIds = PostEditStore.getRevisionIds();
		const newRevisionIds = filterNewRevisionsIds( revisionIds, revisions );

		return {
			selectedRevision: getPostRevision( state, selectedRevisionId ),
			newRevisionIds,
			nextRevisionId,
			prevRevisionId,
			selectedRevisionId,
		};
	},
	{ selectPostRevision }
)( EditorRevisionsList );
