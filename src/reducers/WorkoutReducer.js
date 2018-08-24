import { 
    ROUTINE_FETCH,
    ROUTINE_FETCH_SUCCESS,
    VIEW_WORKOUT_DETAILS,
    TOGGLE_COLLAPSIBLE,
    SHUT_COLLAPSIBLES,
    SUBMIT_WORKOUT_DIARY,
    DIARY_SUBMIT_SUCCESS,
    DIARY_SUBMIT_FAILURE
 } from '../actions/types';

 const INITIAL_STATE = { loading: true };

 export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SUBMIT_WORKOUT_DIARY:
        case ROUTINE_FETCH:
            return { ...state, loading: true };
        case ROUTINE_FETCH_SUCCESS:
            return { ...action.payload, loading: false };
        case VIEW_WORKOUT_DETAILS:
            return { ...state, currentWorkouts: action.payload, loading: false };
        case TOGGLE_COLLAPSIBLE:
            return { ...state, selectedPanelId: action.payload };
        case SHUT_COLLAPSIBLES:
            return { ...state, selectedPanelId: 'none' };
        case DIARY_SUBMIT_SUCCESS: 
            return { ...state, loading: false };
        case DIARY_SUBMIT_FAILURE:
            return { ...state, 
                     errorMsg: 'Error: unable to submit workout to server',
                     loading: false };
        default:
            return state;
    }
 };
