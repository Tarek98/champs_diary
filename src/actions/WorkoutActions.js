import { Actions } from 'react-native-router-flux';
import {
    ROUTINE_CREATE,
    WORKOUT_CREATE,
    ROUTINE_FETCH_SUCCESS
} from './types';
import firebase from 'firebase';

export const routinesFetch = () => {
    //const { currentUser } = firebase.auth();
    const allWorkouts = { public: [], user_defined: [] };

    // auto dispatch action to fetch new data every time '/workouts' documents is updated
    // .onSnapshot() gets real time updates
    return (dispatch) => {
        firebase.firestore().collection('/workouts')
        .where('public', '==', true)
        .onSnapshot(
            (wCollection) => {
                console.log(wCollection);
                wCollection.forEach((workout) => {
                    allWorkouts.public.push(workout.data());
                });
                dispatch({
                    type: ROUTINE_FETCH_SUCCESS,
                    payload: allWorkouts
                });
            }, 
            (error) => {
                console.log(error);
            }
        );
    };
};

export const routineCreate = ({ name }) => {
    const { currentUser } = firebase.auth();

    return (dispatch) => {
        firebase.firestore().doc(`/users/${currentUser.uid}/workout_routines`).add({
            name
        })
        .then(() => {
            dispatch({ type: ROUTINE_CREATE });
            Actions.pop();
        })
        .catch((error) => console.log(error));
    };
};

export const workoutCreate = ({ workout_name, routine_name, exercises }) => {
    const { currentUser } = firebase.auth();

    return (dispatch) => {
        firebase.firestore().doc(`/users/${currentUser.uid}/workout_routines/workouts`).add({
            workout_name,
            routine_name,
            exercises
        })
        .then(() => {
            dispatch({ type: WORKOUT_CREATE });
            Actions.pop();
        });
    };
};

