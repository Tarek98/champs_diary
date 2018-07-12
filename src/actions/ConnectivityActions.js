import {
    CONNECTION_STATUS_CHANGED
} from './types';

export const connectionChange = ({ isConnected }) => {
    return { 
        type: CONNECTION_STATUS_CHANGED,
        payload: isConnected
    };
};
