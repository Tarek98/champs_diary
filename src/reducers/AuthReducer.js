import { purgeStoredState } from 'redux-persist';
import { persistConfig } from '../App';
import { 
    EMAIL_CHANGED,
    PASSWORD_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL, 
    LOGIN_USER,
    LOGOUT_USER,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL
} from '../actions/types';

const INITIAL_STATE = { 
    email: '',
    password: '',
    user: null,
    error: '',
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    console.log(action.type);

    let errorCode = 'Authentication Failed.';

    switch (action.type) {
        case EMAIL_CHANGED:
            // cannot do following: state.email = action.payload (redux thinks nothing changed)
            // make sure to produce a brand new object, and return that
            return { ...state, email: action.payload };
        case PASSWORD_CHANGED:
            return { ...state, password: action.payload };
        case LOGIN_USER_SUCCESS:
            return { ...state, ...INITIAL_STATE, user: action.payload };
        case LOGIN_USER_FAIL:
            switch (action.payload) {
                case 'auth/email-already-in-use':
                    errorCode = 'E-mail/password combination is false.';
                    break;
                case 'Facebook login has failed':
                case 'auth/network-request-failed':
                    errorCode = 'Login failed, check your network connection.';
                    break;
                default:
                    break;
            }
            return { ...state, error: errorCode, loading: false };
        case (LOGIN_USER || LOGOUT_USER):
            return { ...state, loading: true, error: '' };
        case LOGOUT_SUCCESS:
            // Clear offline persisted state from redux store after user logout
            purgeStoredState(persistConfig);
            return { ...INITIAL_STATE };
        case LOGOUT_FAIL:
            return { ...state, error: 'Logout Failed.', loading: false };
        default:
            return state;
    }
};
