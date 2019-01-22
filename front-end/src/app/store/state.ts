import { ISearch } from './search/search.interface';
import { IEstate } from './estate/estate.interface';
import { ISession } from './session/session.interface';
import { combineReducers } from 'redux';
import { sessionReducer } from 'app/store/session/session.reducer';

export interface IAppState {
    session: ISession;
    estate: IEstate;
    search: ISearch;
}
