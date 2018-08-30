import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import {
    REQUEST_INIT,
    ROUTINE_CREATED,
    ROUTINE_FETCH_SUCCESS,
    VIEW_WORKOUT_DETAILS,
    TOGGLE_COLLAPSIBLE,
    DIARY_SUBMIT_SUCCESS,
    SHUT_COLLAPSIBLES,
    WORKOUTS_UPDATED,
    REQUEST_FAILURE
} from './types';

export const routinesFetch = () => {
    const allRoutines = { public: [], user_defined: [] };

    // auto dispatch action to fetch new data every time '/workouts' documents is updated
    // .onSnapshot() gets real time updates
    return (dispatch) => {
        dispatch({
            type: REQUEST_INIT
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
            type: REQUEST_INIT
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

export const expandPanel = (panelId) => {
    return {
        type: TOGGLE_COLLAPSIBLE,
        payload: panelId
    };
};

export const closePanels = () => {
    return {
        type: SHUT_COLLAPSIBLES
    };
};

export const updateComplete = () => {
    return {
        type: WORKOUTS_UPDATED
    };
};

export const submitWorkoutDiary = (current_diary, user_id) => {
    return (dispatch) => {
        dispatch({ type: REQUEST_INIT });

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
                dispatch({ type: REQUEST_FAILURE });
            });
    };
};

export const routineCreate = (routine_name, user_id) => {
    return (dispatch) => {
        dispatch({ type: REQUEST_INIT });

        const workoutsRef = firebase.firestore().collection('workouts');
        const query1 = workoutsRef.where('public', '==', true);
        const query2 = workoutsRef.where('created_by', '==', user_id);

        // If the routine name already exists in DB -> Error Check 1
        query1.get()
        .then(q1Snapshot => {
            console.log('query1');
            q1Snapshot.forEach(doc => {
                if (routine_name === doc._data.routine_name) {
                    dispatch({ type: REQUEST_FAILURE,
                            payload: 'Error: Routine name already in use by the app' });
                    throw new Error('Error: Cannot submit already existing routine name');
                }
            });

            return; 
        })
        .then(() => {
            // If the routine name has already been used by this user in DB -> Error Check 2
            query2.get()
            .then(q2Snapshot => {
                console.log('query2');
                q2Snapshot.forEach(doc => {
                    if (routine_name === doc._data.routine_name) {
                        dispatch({ type: REQUEST_FAILURE,
                                payload: 
                                'Error: You have already created a routine with the same name' });
                        throw new Error('Error: Cannot submit already existing routine name');
                    }
                });

                return;
            })
            .then(() => {
                console.log('workout_add');
                // Add the workout to DB if all error checks passed
                workoutsRef.add({
                    routine_name,
                    created_by: user_id,
                    public: false
                })
                .then((docRef) => {
                    dispatch({ type: ROUTINE_CREATED, payload: docRef.id });
                })
                .catch((error) => {
                    console.log(error);
                    dispatch({ type: REQUEST_FAILURE });
                });
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    };
};

export const workoutCreate = (routine_id, workout_name, exercises) => {
    return (dispatch) => {
        const routineRef = firebase.firestore()
                            .collection('workouts').doc(`${routine_id}`).collection('workout_days')
                            .doc();

        routineRef.set({
            workout_name,
            exercises
        })
        .then(() => { 
            console.log(`${workout_name} has been submitted for routine_id: ${routine_id}`); 
        })
        .catch(error => {
            console.log(error);
            dispatch({ type: REQUEST_FAILURE });
        });
    };
};

