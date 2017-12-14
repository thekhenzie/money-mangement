import * as actionTypes from './actionTypes';
import UserApi from '../api/UserApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';


export function registerSuccess(userResults) {
    return { type: actionTypes.REGISTER_SUCCESS, userResults }
}

export function registerUser(userInput) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return UserApi.registerUser(userInput)
            .then(userResults => {
                dispatch(registerSuccess(userResults));
            }).catch(error => {
                dispatch(ajaxCallError(error));
                throw error;
            });
    };

}

export function loginSuccess(userResults) {
    return { type: actionTypes.LOGIN_SUCCESS, userResults }
}

export function authenticateUser(userInput) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return UserApi.authenticateUser(userInput).then(userResults => {
            dispatch(loginSuccess(userResults));
        }).catch(error => {
            dispatch(ajaxCallError(error));
            throw (error);
        });
    };

}

export function retrieveProfileSuccess(userResults) {
    return { type: actionTypes.RETRIEVE_PROFILE_SUCCESS, userResults };
}

export function retrieveProfile(id) {
    return function (dispatch) {
        dispatch(beginAjaxCall());
        return UserApi.getUserById(id).then(userResults => {
            dispatch(retrieveProfileSuccess(userResults));
        }).catch(error => {
            dispatch(ajaxCallError(error));
            throw (error);
        });
    };
}