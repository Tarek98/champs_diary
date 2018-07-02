import {
    CONNECTION_STATUS_CHANGED
} from '../actions/types';

const INITIAL_STATE = {
    isConnected: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CONNECTION_STATUS_CHANGED:
            return { ...state, isConnected: action.payload };
        default:
            return state;
    }
};
