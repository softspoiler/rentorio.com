import { RealEstate } from './../../model/real.estate.model';
import { CREATE_REAL_ESTATE, EDIT_REAL_ESTATE, UPDATE_REAL_ESTATE, CLEAR_ESTATE } from './../actions';
import { IAction } from './../interface/action.interface';
import { IEstate } from './estate.interface';
import { ESTATE_INITIAL_STATE } from './estate.initial.state';

export function estateReducer(state: IEstate = ESTATE_INITIAL_STATE, action: IAction): IEstate {
    switch (action.type) {
        case CREATE_REAL_ESTATE: {
            return { isNew: true, realEstate: new RealEstate() };
        }
        case EDIT_REAL_ESTATE: {
            return { isNew: false, realEstate: Object.assign({}, action.payload) };
        }
        case UPDATE_REAL_ESTATE: {
            if (state.isNew !== undefined) {
                // TODO: maybe we need also check the payload in case of null?
                return { isNew: state.isNew, realEstate: Object.assign({}, action.payload) };
            }
            return state;
        }
        case CLEAR_ESTATE: {
            return {};
        }
        default: return state;
    }
}
