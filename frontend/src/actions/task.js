import axios from '../utils/axiosConfig';
import { getCSRFToken } from '../utils/axiosConfig';
import { 
    CREATE_TASK_SUCCESS, 
    CREATE_TASK_FAIL, 
    DELETE_TASK_SUCCESS, 
    DELETE_TASK_FAIL,
    EDIT_TASK_SUCCESS,
    EDIT_TASK_FAIL,
    FETCH_TASKS_SUCCESS,
    FETCH_TASKS_FAIL
} from './types';

export const createTask = (description, assigned_to, team, due_date, status) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
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
            'Content-Type': 'application/json'
        },
        withCredentials: true
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
            'Content-Type': 'application/json'
        },
        withCredentials: true
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

export const fetchTasks = () => async dispatch => {
    const accessToken = getCookie('access_token'); // Utility to retrieve cookie

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,  // Make sure cookies are sent with the request
    };


    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/sop/tasks/user-and-team-tasks/`, config);

        dispatch({
            type: FETCH_TASKS_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: FETCH_TASKS_FAIL
        });
        throw err;
    }
};

// Helper function to get the cookie by name
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};