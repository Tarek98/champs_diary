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
            return { ...state, error: 'Authentication Failed.', loading: false };
        case (LOGIN_USER || LOGOUT_USER):
            return { ...state, loading: true, error: '' };
        case LOGOUT_SUCCESS:
            return { ...INITIAL_STATE };
        case LOGOUT_FAIL:
            return { ...state, error: 'Logout Failed.', loading: false };
        default:
            return state;
    }
};
