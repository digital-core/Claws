export function searchResultsReturned(response) {
    return {
        type: 'SEARCH_RESULTS_RETURNED',
        response
    };
}