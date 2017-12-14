import * as actionTypes from '../actions/actionTypes';
import initialState from './initialState';

export default function userReducer(state = initialState.usersResult, action) {
    switch (action.type) {

        case actionTypes.REGISTER_SUCCESS:
            return [
                ...state,
                Object.assign({}, action.usersResult)
            ];

        case actionTypes.LOGIN_SUCCESS:
            return [
                ...state,
                Object.assign({}, action.usersResult)
            ];

        case actionTypes.RETRIEVE_PROFILE_SUCCESS:
            return [
                ...state,
                Object.assign({}, action.usersResult)
            ];
        case actionTypes.UPDATE_PROFILE_SUCCESS:
            return [
                ...state.filter(usersResult => usersResult.id !== action.usersResult.id),
                Object.assign({}, action.usersResult)
            ];

        default:
            return state;
    }
}