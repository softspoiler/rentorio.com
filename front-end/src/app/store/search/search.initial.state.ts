import { SearchFilter } from './../../model/search.filter.model';
import { SearchType } from 'app/model/search.type.enum';
import { ISearch } from './search.interface';

export const SEARCH_INITIAL_STATE: ISearch = {
    searchType: SearchType.GEO_DISTANCE,
    searchFilter: new SearchFilter()
};
