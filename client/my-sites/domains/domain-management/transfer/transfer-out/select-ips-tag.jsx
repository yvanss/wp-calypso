
/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import request from 'superagent';
import { startsWith, toUpper } from 'lodash';
import { localize } from 'i18n-calypso';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import SearchCard from 'components/search-card';
import SectionHeader from 'components/section-header';
import Suggestions from 'components/suggestions';
import FormButton from 'components/forms/form-button';
import { getCurrentUser } from 'state/current-user/selectors';
import { successNotice, errorNotice } from 'state/notices/actions';

const debug = debugFactory( 'calypso:domains:select-ips-tag' );

class SelectIpsTag extends Component {
	static ipsTagListUrl = 'https://widgets.wp.com/domains/ips-tag-list.min.json';

	state = {
		ipsTag: '',
		ipsTagList: [],
		query: '',
	};

	componentWillMount() {
		request.get( SelectIpsTag.ipsTagListUrl ).then( ( response ) => {
			this.receiveIpsTagList( response.body );
		} )
		.catch( ( error ) => {
			debug( 'Failed to load IPS tag list! ' + error );
		} );
	}

	componentDidUpdate() {
		if ( this.state.query && ( this.state.query !== this.state.ipsTag ) ) {
			this.hideSuggestions();
		}
	}

	receiveIpsTagList = ipsTagList => {
		this.setState( { ipsTagList } );
	}

	handleKeyDown = event => this.suggestionsRef.handleKeyEvent( event );

	handleSearchInputChange = query => this.setState( { query, ipsTag: query } );

	handleSuggestionClick = position => {
		const parsedLabel = position.label.split( ' ' );
		this.setState( { ipsTag: parsedLabel[ 0 ] } );
	}

	handleSubmitButtonClick = event => {
		event.preventDefault();
	}

	getSuggestions() {
		return this.state.ipsTagList
			.filter( hint => this.state.query && startsWith( hint.tag, toUpper( this.state.query ) ) )
			.map( hint => ( { label: hint.tag + '  (' + hint.registrarName + ')' } ) );
	}

	setSuggestionsRef = ref => ( this.suggestionsRef = ref );

	hideSuggestions = () => this.setState( { query: '' } );

	render() {
		const { selectedDomainName, translate } = this.props;

		return (
			<div>
				<SectionHeader label={ translate( 'Transfer Domain To Another Registrar' ) } />
				<Card className="transfer-out__select-ips-tag">
					<p>
						{ translate(
							"{{strong}}.uk{{/strong}} domains are transferred by setting the domain's IPS tag here to the new registrar " +
							'and then contacting the {{em}}new registrar{{/em}} to complete the transfer.',
							{ components: { strong: <strong />, em: <em /> } }
						) }
					</p>
					<p>
						{ translate(
							'Please enter the IPS tag of the registrar you wish to transfer ' +
							'{{strong}}%(selectedDomainName)s{{/strong}} to.',
							{ args: { selectedDomainName }, components: { strong: <strong /> } }
						) }
					</p>

					<SearchCard
						autoFocus
						disableAutocorrect
						onSearch={ this.handleSearchInputChange }
						onBlur={ this.hideSuggestions }
						onKeyDown={ this.handleKeyDown }
						placeholder="Start typing an IPS tag..."
						value={ this.state.ipsTag }
					/>
					<Suggestions
						ref={ this.setSuggestionsRef }
						query={ this.state.query }
						suggestions={ this.getSuggestions() }
						suggest={ this.handleSuggestionClick }
					/>
					<FormButton onClick={ this.handleSubmitButtonClick } >
						{ this.props.translate( 'Submit' ) }
					</FormButton>
				</Card>
			</div>
		);
	}
}

export default connect( state => ( { currentUser: getCurrentUser( state ) } ), {
	successNotice,
	errorNotice,
} )( localize( SelectIpsTag ) );
