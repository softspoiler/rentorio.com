import { LOGIN_SUCCESSFUL, LOGOUT_SUCCESSFUL, UPDATE_CURRENT_USER, UPDATE_USER_AVATAR, UPDATE_NOTIFICATIONS_NUMBER, UPDATE_GLOBAL_NOTIFICATIONS } from './../actions';
import { IAction } from './../interface/action.interface';
import { ISession } from './session.interface';
import { INITIAL_STATE } from './session.initial.state';
import { User } from 'app/model/user.model';

export function sessionReducer(state: ISession = INITIAL_STATE, action: IAction): ISession {
    switch (action.type) {
        case LOGIN_SUCCESSFUL:
            return { isAuthenticated: true, currentUser: Object.assign({}, action.payload) };
        case UPDATE_CURRENT_USER:
            if (state.isAuthenticated !== undefined) {
                return { isAuthenticated: state.isAuthenticated, currentUser: Object.assign({}, action.payload), avatar: state.avatar, notificationsNumber: state.notificationsNumber };
            }
            return state;
        case UPDATE_USER_AVATAR:
            if (state.isAuthenticated !== undefined) {
                return { isAuthenticated: state.isAuthenticated, currentUser: state.currentUser, avatar: Object.assign({}, action.payload), notificationsNumber: state.notificationsNumber };
            }
            return state;
        case LOGOUT_SUCCESSFUL:
            return { isAuthenticated: false };
        case UPDATE_NOTIFICATIONS_NUMBER:
            if (state.isAuthenticated !== undefined && state.notificationsNumber !== action.payload) {
                return { isAuthenticated: state.isAuthenticated, currentUser: state.currentUser, avatar: state.avatar, notificationsNumber: action.payload };
            }
            return state;
        case UPDATE_GLOBAL_NOTIFICATIONS:
            if (state.isAuthenticated !== undefined) {
                return { isAuthenticated: state.isAuthenticated, currentUser: state.currentUser, avatar: state.avatar, globalNotifications: action.payload, notificationsNumber: state.notificationsNumber };
            }
        default: return state;
    }
}
