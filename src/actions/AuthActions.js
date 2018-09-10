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
                        console.log(signupError);
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
            Actions.popTo('modeSelect');
        })
        .catch((error) => {
            console.log(error);
            dispatch({ type: LOGOUT_FAIL });
        });
    };
};

export const loginFBUser = (userData) => {
    return (dispatch) => {
        dispatch({ type: LOGIN_USER });
        const { uid, displayName, metadata } = userData;
        const { email } = userData.providerData[0];

        const userInfo = { _user: { uid,
            provider: 'Facebook', 
            displayName, 
            email, 
            date_created: metadata.creationTime } };
        const userPath = firebase.firestore().collection('users').doc(uid);

        userPath.get()
        .then((doc) => {
            // Find out if facebook user has used the app before
            if (doc.exists) {
                // Login user and skip adding data to DB
                loginUserSuccess(dispatch, userInfo);
                return;
            }
            // First-time facebook user, add his data to DB
            userPath.set({ displayName, 
                email, 
                date_created: userInfo._user.date_created, 
                provider: userInfo._user.provider 
            })
            .then(() => loginUserSuccess(dispatch, userInfo))
            .catch((error) => {
                console.log(error);
                loginUserFail(dispatch, 'Facebook login has failed');
            });
        })
        .catch((error) => {
            console.log(error);
            loginUserFail(dispatch, 'Facebook login has failed');
        });
    };
};

const addUserDataToDB = (userInfo) => {
    const { uid, email, metadata } = userInfo._user;

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

const loginUserSuccess = (dispatch, userInfo) => {
    dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: userInfo._user
    });

    console.log(userInfo._user);

    Actions.main();
};
