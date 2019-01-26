import {Component, Fragment} from 'inferno'
import {connect} from 'inferno-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/searchActions'

class SearchResult extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
        	<div class="search-result-card-image mdl-card mdl-shadow--2dp" style={{background: `url('https://image.tmdb.org/t/p/w500${this.props.result.poster_path}') center / cover`}}>
                <div class="mdl-card__title mdl-card--expand"></div>
                <div class="mdl-card__actions">
                    <span class="search-result-card-image__filename">{`${this.props.result.title || this.props.result.name}${this.props.result.release_date ? ` (${(new Date(this.props.result.release_date)).getFullYear()})` : ''}`}</span>
                </div>
            </div>
        )
    }
}

export default SearchResult
