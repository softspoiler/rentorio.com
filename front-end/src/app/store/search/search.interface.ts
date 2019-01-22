import { SearchFilter } from './../../model/search.filter.model';
import { SearchType } from 'app/model/search.type.enum';

export interface ISearch {
    addressLine?: String;
    searchType: SearchType;
    searchFilter: SearchFilter;
    searchResult?: any;
}
