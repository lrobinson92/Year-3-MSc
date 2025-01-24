import axios from '../utils/axiosConfig';
import { CREATE_TEAM_SUCCESS, CREATE_TEAM_FAIL } from './types';

export const createTeam = (name, description) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    const body = JSON.stringify({ name, description });

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/sop/teams/`, body, config);

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