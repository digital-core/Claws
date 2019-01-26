import {combineReducers} from 'redux';

import searchResults from './searchResultsReducer';

const rootReducer = combineReducers({
    searchResults
});

export default rootReducer;