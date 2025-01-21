import { ADD_MEMBER_SUCCESS, ADD_MEMBER_FAILURE } from '../actions/types';

const initialState = {
    members: [],
    message: '',
    error: null,
};

const teamReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_MEMBER_SUCCESS:
            return {
                ...state,
                message: action.payload,
                error: null,
            };
        case ADD_MEMBER_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default teamReducer;