import { 
    ROUTINE_FETCH,
    ROUTINE_FETCH_SUCCESS,
    VIEW_WORKOUT_DETAILS
 } from '../actions/types';

 const INITIAL_STATE = { loading: true };

 export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ROUTINE_FETCH:
            return { ...state, loading: true };
        case ROUTINE_FETCH_SUCCESS:
            return { ...action.payload, loading: false };
        case VIEW_WORKOUT_DETAILS:
            return { ...state, selectedWorkoutId: action.payload };
        default:
            return state;
    }
 };
