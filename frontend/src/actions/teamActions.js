import axios from 'axios';
import { ADD_MEMBER_SUCCESS, ADD_MEMBER_FAILURE } from './types';

export const addMember = (teamId, username) => async (dispatch) => {
    try {
        const response = await axios.post(`/api/teams/${teamId}/add_member/`, { username });
        dispatch({
            type: ADD_MEMBER_SUCCESS,
            payload: response.data.message,
        });
    } catch (error) {
        dispatch({
            type: ADD_MEMBER_FAILURE,
            payload: error.response?.data?.error || 'Failed to add member',
        });
    }
};