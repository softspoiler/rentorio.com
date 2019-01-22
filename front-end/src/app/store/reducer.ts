import { IAppState } from './state';
import { combineReducers } from 'redux';
import { sessionReducer } from 'app/store/session/session.reducer';
import { estateReducer } from 'app/store/estate/estate.reducer';
import { searchReducer } from 'app/store/search/search.reducer';

const rootReducer = combineReducers<IAppState>({
    session: sessionReducer,
    estate: estateReducer,
    search: searchReducer
});

export default rootReducer;
