import { combineReducers } from 'redux';
import usersResult from './userReducer';
import ajaxCallsInProgress from './ajaxStatusReducer';
const rootReducer = combineReducers({
    usersResult,
    ajaxCallsInProgress
});

export default rootReducer;