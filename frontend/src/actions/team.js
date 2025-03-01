import axios from '../utils/axiosConfig';
import { 
    CREATE_TEAM_SUCCESS, 
    CREATE_TEAM_FAIL, 
    DELETE_TEAM_SUCCESS, 
    DELETE_TEAM_FAIL,
    EDIT_TEAM_SUCCESS,
    EDIT_TEAM_FAIL  
} from './types';

export const createTeam = (name, description) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    };

    const body = JSON.stringify({ name, description });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/teams/`, body, config);

        dispatch({
            type: CREATE_TEAM_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: CREATE_TEAM_FAIL
        });
        throw err;
    }
};

export const deleteTeam = (teamId) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    };

    try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/teams/${teamId}/`, config);

        dispatch({
            type: DELETE_TEAM_SUCCESS,
            payload: teamId
        });
    } catch (err) {
        dispatch({
            type: DELETE_TEAM_FAIL
        });
        throw err;
    }
};

export const editTeam = (teamId, name, description) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    };

    const body = JSON.stringify({ name, description });

    try {
        const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/teams/${teamId}/`, body, config);

        dispatch({
            type: EDIT_TEAM_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: EDIT_TEAM_FAIL
        });
        throw err;
    }
};