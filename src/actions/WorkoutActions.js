import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import {
    ROUTINE_CREATE,
    WORKOUT_CREATE,
    ROUTINE_FETCH,
    ROUTINE_FETCH_SUCCESS,
    VIEW_WORKOUT_DETAILS,
    VIEW_ROUTINE_DETAILS,
    SUBMIT_WORKOUT_DIARY,
    DIARY_SUBMIT_FAILURE,
    DIARY_SUBMIT_SUCCESS
} from './types';

export const routinesFetch = () => {
    //const { currentUser } = firebase.auth();
    const allRoutines = { public: [], user_defined: [] };

    // auto dispatch action to fetch new data every time '/workouts' documents is updated
    // .onSnapshot() gets real time updates
    return (dispatch) => {
        dispatch({
            type: ROUTINE_FETCH
        });

        firebase.firestore().collection('/workouts/')
        .orderBy('level')
        .onSnapshot({ includeMetadataChanges: true },
            (querySnapshot) => {
                querySnapshot.forEach((routine) => {
                    if (routine.data().public) {
                        allRoutines.public.push({ ...routine.data(), id: routine.id });
                    } else {
                        allRoutines.user_defined.push({ ...routine.data(), id: routine.id });
                    }
                });
                console.log(allRoutines);
                dispatch({
                    type: ROUTINE_FETCH_SUCCESS,
                    payload: allRoutines
                });
            }, 
            (error) => {
                console.log(error);
            }
        );
    };
};

export const workoutsFetch = (routine_id) => {
    const currentWorkouts = [];
    // currentWorkouts.push({ routine_id });

    return (dispatch) => {
        dispatch({
            type: ROUTINE_FETCH
        });

        firebase.firestore().collection(`/workouts/${routine_id}/workout_days/`)
        .onSnapshot({ includeMetadataChanges: true }, 
            (querySnapshot) => {
                querySnapshot.forEach((workout) => {
                    currentWorkouts.push({ ...workout._data, id: workout.id });
                });
                console.log(currentWorkouts);
                dispatch({
                    type: VIEW_WORKOUT_DETAILS,
                    payload: currentWorkouts
                });
            },
            (error) => {
                console.log(error);
            }
        );
    };
};

export const viewRoutineDetails = (routineId) => {
    return {
        type: VIEW_ROUTINE_DETAILS,
        payload: routineId
    };
};

export const submitWorkoutDiary = (current_diary, user_id) => {
    return (dispatch) => {
        dispatch({ type: SUBMIT_WORKOUT_DIARY });

        const newDiaryEntryRef = 
            firebase.firestore().collection('users').doc(`${user_id}`).collection('workout_diary')
            .doc();
            
        newDiaryEntryRef.set(current_diary)
            .then(() => {
                Actions.workoutMain({ successMsg: 'Your workout was saved successfuly!' });
                dispatch({ type: DIARY_SUBMIT_SUCCESS });
            })
            .catch((error) => {
                console.log(error);
                dispatch({ type: DIARY_SUBMIT_FAILURE });
            });
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

