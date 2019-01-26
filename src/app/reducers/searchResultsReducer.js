import initialState from './initialState';

export default function searchResultsReducer(state = initialState.searchResults, action) {
    switch (action.type) {

        case 'SEARCH_RESULTS_RETURNED':
            return action.response;

        default:
            return state;
    }
}