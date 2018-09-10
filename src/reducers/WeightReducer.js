import {
    REQUEST_INIT,
    BODY_STATS_SUBMITTED,
    REQUEST_FAILURE,
    CHART_LOADING,
    CHART_UPDATED,
    BODY_STATS_UPDATED,
    RESET_LOADING
} from '../actions/types';

const INIT_STATE = { loading: false, chartLoading: true };

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case RESET_LOADING:
            return { ...state, loading: false };
        case REQUEST_INIT:
            return { ...state, loading: true, errorMsg: null, successMsg: null };
        case REQUEST_FAILURE:
            return { ...state, 
                errorMsg: action.payload, 
                successMsg: null, 
                loading: false,
                weight: '',
                waist: ''
            };
        case CHART_LOADING:
            return { ...state, chartLoading: true };
        case CHART_UPDATED:
            return { ...state, chartLoading: false, chartDataSets: action.payload };
        case BODY_STATS_SUBMITTED:
            return { ...state, successMsg: action.payload, errorMsg: null, loading: false };
        case BODY_STATS_UPDATED:
            return { ...state, 
                weight: action.payload.weight, 
                waist: action.payload.waist,
                loading: false, 
                errorMsg: null, 
                successMsg: action.payload.successMsg 
            };
        default:
            return state;
    }
};
