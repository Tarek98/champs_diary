import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import {
    ROUTINE_CREATE,
    WORKOUT_CREATE,
    ROUTINE_FETCH,
    ROUTINE_FETCH_SUCCESS,
    VIEW_WORKOUT_DETAILS
} from './types';

export const routinesFetch = () => {
    //const { currentUser } = firebase.auth();
    const allWorkouts = { public: [], user_defined: [] };

    // auto dispatch action to fetch new data every time '/workouts' documents is updated
    // .onSnapshot() gets real time updates
    return (dispatch) => {
        console.log('routine fetch');
        dispatch({
            type: ROUTINE_FETCH
        });

        firebase.firestore().collection('/workouts/')
        .orderBy('level')
        .onSnapshot({ includeMetadataChanges: true },
            (querySnapshot) => {
                querySnapshot.forEach((workout) => {
                    allWorkouts.public.push({ ...workout.data(), id: workout.id });
                });
                console.log(allWorkouts.public);
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

export const viewWorkoutDetails = (routineId) => {
    return {
        type: VIEW_WORKOUT_DETAILS,
        payload: routineId
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

