import { combineReducers } from 'redux';
import auth from './auth';
import team from './team';
import task from './task';

export default combineReducers({
    auth,
    team,
    task
});