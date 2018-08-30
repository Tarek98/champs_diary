import { 
    REQUEST_INIT,
    ROUTINE_FETCH_SUCCESS,
    VIEW_WORKOUT_DETAILS,
    TOGGLE_COLLAPSIBLE,
    SHUT_COLLAPSIBLES,
    DIARY_SUBMIT_SUCCESS,
    REQUEST_FAILURE,
    ROUTINE_CREATED,
    WORKOUTS_UPDATED
 } from '../actions/types';

 const INITIAL_STATE = { loading: true };

 export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REQUEST_INIT:
            return { ...state, loading: true };
        case REQUEST_FAILURE:
            return { ...state, 
                    errorMsg: (action.payload || 'Error: server unable to update workout'),
                    loading: false,
                    initiateWorkoutSave: false };
        case ROUTINE_CREATED:
            return { ...state, routineId: action.payload, initiateWorkoutSave: true };
        case WORKOUTS_UPDATED:
            return { ...state, initiateWorkoutSave: false, loading: false };                
        case ROUTINE_FETCH_SUCCESS:
            return { ...action.payload, loading: false };
        case DIARY_SUBMIT_SUCCESS: 
            return { ...state, loading: false };
        case VIEW_WORKOUT_DETAILS:
            return { ...state, currentWorkouts: action.payload, loading: false };
        case TOGGLE_COLLAPSIBLE:
            return { ...state, selectedPanelId: action.payload };
        case SHUT_COLLAPSIBLES:
            return { ...state, selectedPanelId: 'none' };
        default:
            return state;
    }
 };
