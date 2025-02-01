import { 
    CREATE_TASK_SUCCESS, 
    CREATE_TASK_FAIL, 
    DELETE_TASK_SUCCESS, 
    DELETE_TASK_FAIL,
    EDIT_TASK_SUCCESS,
    EDIT_TASK_FAIL 
} from '../actions/types';

const initialState = {
    tasks: [],
    error: null
};

function taskReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case CREATE_TASK_SUCCESS:
            return {
                ...state,
                tasks: [...state.tasks, payload],
                error: null
            };
        case CREATE_TASK_FAIL:
            return {
                ...state,
                error: 'Failed to create task'
            };
        case DELETE_TASK_SUCCESS:
            return {
                ...state,
                tasks: state.tasks.filter(task => task.id !== payload),
                error: null
            };
        case DELETE_TASK_FAIL:
            return {
                ...state,
                error: 'Failed to delete task'
            };
        case EDIT_TASK_SUCCESS:
            return {
                ...state,
                tasks: state.tasks.map(task => task.id === payload.id ? payload : task),
                error: null
            };
        case EDIT_TASK_FAIL:
            return {
                ...state,
                error: 'Failed to edit task'
            };
        default:
            return state;
    }
};

export default taskReducer;