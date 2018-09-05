import { Actions } from 'react-native-router-flux';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
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

// Calling the following function will open the FB login dialogue
export const facebookLogin = (accessToken) => {
    try {
        const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            throw new Error('User cancelled request');
        }

        console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);

        // get the access token
        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            throw new Error('Something went wrong obtaining the users access token');
        }

        // create a new firebase credential with the token
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

        // login with credential
        const currentUser = await firebase.auth().signInAndRetrieveDataWithCredential(credential);

        console.info(JSON.stringify(currentUser.user.toJSON()));
    } catch (e) {
    console.error(e);
    }
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
