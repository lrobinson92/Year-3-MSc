import { CREATE_TEAM_SUCCESS, CREATE_TEAM_FAIL } from '../actions/types';

const initialState = {
    teams: [],
    error: null
};

function teamReducer(state = initialState, action) {
    const { type, payload } = action;


    switch (type) {
        case CREATE_TEAM_SUCCESS:
            return {
                ...state,
                teams: [...state.teams, payload],
                error: null
            };
        case CREATE_TEAM_FAIL:
            return {
                ...state,
                error: 'Failed to create team'
            };
        default:
            return state;
    }

};

export default authReducer;