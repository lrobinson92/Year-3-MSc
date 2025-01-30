import axios from '../utils/axiosConfig';
import { 
    CREATE_TASK_SUCCESS, 
    CREATE_TASK_FAIL, 
    DELETE_TASK_SUCCESS, 
    DELETE_TASK_FAIL,
    EDIT_TASK_SUCCESS,
    EDIT_TASK_FAIL  
} from './types';

export const createTask = (description, assigned_to, team, due_date, status) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    const body = JSON.stringify({ description, assigned_to, team, due_date, status });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/sop/tasks/`, body, config);

        dispatch({
            type: CREATE_TASK_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: CREATE_TASK_FAIL
        });
        throw err;
    }
};

export const deleteTask = (taskId) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/sop/tasks/${taskId}/`, config);

        dispatch({
            type: DELETE_TASK_SUCCESS,
            payload: taskId
        });
    } catch (err) {
        dispatch({
            type: DELETE_TASK_FAIL
        });
        throw err;
    }
};

export const editTask = (taskId, description, assigned_to, team, due_date, status) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    const body = JSON.stringify({ description, assigned_to, team, due_date, status });

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/sop/tasks/${taskId}/`, body, config);

        dispatch({
            type: EDIT_TASK_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: EDIT_TASK_FAIL
        });
        throw err;
    }
};