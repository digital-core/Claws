import {Component, Fragment} from 'inferno'
import {connect} from 'inferno-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/searchActions'

import SearchResult from './searchResult'

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: ''
        }
    }

    onInput = (e) => {
    	this.setState({title: e.target.value})
    }

    onKeyDown = async (e) => {
    	if (e.which == 13 || e.keyCode == 13) {
    		const response = await new Promise((resolve) => fetchSearchResults(resolve, this.state.title, 1))
            this.props.actions.searchResultsReturned(response)
        }
    }

    render() {
        return (
        	<Fragment>
	            <div class="mdl-textfield mdl-js-textfield theme--dark">
		            <input value={this.state.title} onInput={this.onInput} onKeyDown={this.onKeyDown} class="mdl-textfield__input" type="text" id="search"/>
		            <label class="mdl-textfield__label" for="search">Search</label>
		        </div>
		        <div class="flex wrap">
		        	{this.props.searchResults.map(result => <SearchResult result={result}/>)}
		        </div>
        	</Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {searchResults: state.searchResults.results || []}
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
