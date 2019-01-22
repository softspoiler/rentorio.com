import { SearchFilter } from './../../model/search.filter.model';
import { SearchType } from 'app/model/search.type.enum';
import { UPDATE_ADDRESS_LINE, UPDATE_SEARCH_FILTER, UPDATE_SEARCH_RESULT, UPDATE_SEARCH_TYPE,CLEAR_SEARCH } from './../actions';
import { IAction } from './../interface/action.interface';
import { ISearch } from './search.interface';
import { SEARCH_INITIAL_STATE } from './search.initial.state';

export function searchReducer(state: ISearch = SEARCH_INITIAL_STATE, action: IAction): ISearch {
    switch (action.type) {
        case UPDATE_ADDRESS_LINE:
            let filter = state.searchFilter;
            filter.setParam('latitude', action.payload.latitude);
            filter.setParam('longitude', action.payload.longitude);
            return {
                addressLine: action.payload.addressLine, searchType: SearchType.GEO_DISTANCE,
                searchFilter: filter, searchResult: state.searchResult
            };
        case UPDATE_SEARCH_FILTER:
            return {
                addressLine: state.addressLine, searchType: state.searchType,
                searchFilter: action.payload, searchResult: state.searchResult
            };
        case UPDATE_SEARCH_RESULT: {
            return {
                addressLine: state.addressLine, searchType: state.searchType,
                searchFilter: state.searchFilter, searchResult: Object.assign({}, action.payload)
            };
        }
        case UPDATE_SEARCH_TYPE: {
            return {
                addressLine: state.addressLine, searchType: action.payload,
                searchFilter: state.searchFilter, searchResult: state.searchResult
            };
        }
        case CLEAR_SEARCH: {
            return {
             searchType: 0, searchFilter: new SearchFilter()
            }
        }
        default: return state;
    }
}
