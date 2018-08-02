import { 
    ROUTINE_FETCH,
    ROUTINE_FETCH_SUCCESS,
    VIEW_WORKOUT_DETAILS,
    VIEW_ROUTINE_DETAILS,
    SUBMIT_WORKOUT_DIARY
 } from '../actions/types';

 const INITIAL_STATE = { loading: true };

 export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ROUTINE_FETCH || SUBMIT_WORKOUT_DIARY:
            return { ...state, loading: true };
        case ROUTINE_FETCH_SUCCESS:
            return { ...action.payload, loading: false };
        case VIEW_WORKOUT_DETAILS:
            return { ...state, currentWorkouts: action.payload, loading: false };
        case VIEW_ROUTINE_DETAILS:
            return { ...state, selectedWorkoutId: action.payload };
        default:
            return state;
    }
 };
