import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import { 
    EMAIL_CHANGED,
    PASSWORD_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER,
    LOGOUT_USER,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL
} from './types';

export const emailChanged = (text) => {
    return {
        type: EMAIL_CHANGED,
        payload: text
    };
};

export const passwordChanged = (text) => {
    return {
        type: PASSWORD_CHANGED,
        payload: text
    };
};

export const loginUser = ({ email, password }) => {
    return (dispatch) => {
        dispatch({ type: LOGIN_USER });

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(user => {
                loginUserSuccess(dispatch, user);
            })
            .catch((loginError) => {
                console.log(loginError);
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(user => {
                        addUserDataToDB(user);
                        loginUserSuccess(dispatch, user);
                    })
                    .catch((signupError) => {
                        loginUserFail(dispatch, signupError.code);
                    });
            });
    };
};

export const logoutUser = () => {
    return (dispatch) => {
      dispatch({ type: LOGOUT_USER });

      firebase.auth().signOut()
        .then(() => {
            dispatch({ type: LOGOUT_SUCCESS });
            Actions.auth();
        })
        .catch((error) => {
            console.log(error);
            dispatch({ type: LOGOUT_FAIL });
        });
    };
};

const addUserDataToDB = (userInfo) => {
    const { uid, email, metadata } = userInfo.user;

    firebase.firestore().doc(`users/${uid}`).set(
        { email, date_created: metadata.creationTime },
        { merge: false }
    );
};

const loginUserFail = (dispatch, errorCode) => {
    dispatch({ 
        type: LOGIN_USER_FAIL,
        payload: errorCode
    });
};

const loginUserSuccess = (dispatch, user) => {
    dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: user
    });

    Actions.main();
};
