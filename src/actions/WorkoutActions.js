import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import {
    REQUEST_INIT,
    ROUTINE_CREATED,
    ROUTINE_FETCH_SUCCESS,
    VIEW_WORKOUT_DETAILS,
    TOGGLE_COLLAPSIBLE,
    DIARY_SUBMIT_SUCCESS,
    DIARY_HISTORY_FETCHED,
    SHUT_COLLAPSIBLES,
    WORKOUTS_UPDATED,
    REQUEST_FAILURE,
    RESET_LOADING
} from './types';

const DB = firebase.firestore();
const workoutsRef = DB.collection('workouts');
const usersRef = DB.collection('users');

const addRoutinesToArray = (routines, outputArray) => {
    if (!routines.empty) { 
        routines.forEach((routine) => {
            outputArray.push({ ...routine.data(), id: routine.id });
        });
    }
};

export const routinesFetch = (user_id) => {
    const query1 = workoutsRef.where('public', '==', true);
    const query2 = workoutsRef.where('created_by', '==', String(user_id));

    return (dispatch) => {
        const allRoutines = [];
        dispatch({
            type: REQUEST_INIT
        });
        query1.orderBy('level').get()
        .then((snap1) => {
            addRoutinesToArray(snap1, allRoutines);
            return;
        }).then(() => {
            query2.orderBy('level').get()
            .then((snap2) => {
                addRoutinesToArray(snap2, allRoutines);
                dispatch({
                    type: ROUTINE_FETCH_SUCCESS,
                    payload: allRoutines
                });
            }).catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    };
};

export const workoutsFetch = (routine_id) => {
    return (dispatch) => {
        dispatch({
            type: REQUEST_INIT
        });

        firebase.firestore().collection(`/workouts/${routine_id}/workout_days/`)
        .get().then((querySnapshot) => {
                const currentWorkouts = [];
                querySnapshot.forEach((workout) => {
                    currentWorkouts.push({ ...workout._data, id: workout.id });
                });
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

export const getWorkoutDiaryHistory = (user_id, dateSelected) => {
    return (dispatch) => {
        dispatch({ type: REQUEST_INIT });

        const history = [];

        usersRef.doc(`${user_id}`).collection('workout_diary')
        .where('date', '==', dateSelected)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((diary) => {
                history.push({ ...diary.data(), id: diary.id });
            });
            dispatch({
                type: DIARY_HISTORY_FETCHED,
                payload: history
            });
        });
    };
};

export const submitWorkoutDiary = (current_diary, user_id) => {
    return (dispatch) => {
        dispatch({ type: REQUEST_INIT });

        const newDiaryEntryRef = 
            usersRef.doc(`${user_id}`).collection('workout_diary')
            .doc();
            
        newDiaryEntryRef.set(current_diary)
            .then(() => {
                Actions.popTo('workoutMain');
                Actions.refresh({ successMsg:
                    `Your workout on ${current_diary.date} has been saved!` });
                dispatch({ type: DIARY_SUBMIT_SUCCESS });
            })
            .catch((error) => {
                console.log(error);
                dispatch({ type: REQUEST_FAILURE });
            });
    };
};

export const workoutDiaryDelete = (user_id, dairy_id) => {
    return (dispatch) => {
        dispatch({ type: REQUEST_INIT });

        usersRef.doc(user_id).collection('workout_diary').doc(dairy_id)
        .delete()
        .then(() => {
            Actions.popTo('workoutMain');
            Actions.refresh({ successMsg:
                'Your workout diary entry has been deleted!' });
            dispatch({ type: DIARY_SUBMIT_SUCCESS });
        })
        .catch((error) => {
            console.log(error);
            Actions.popTo('workoutMain');
            Actions.refresh({ errorMsg: 'Error: could not delete your workout entry...' });
        });
    };
};

// Delete a workout routine and all the workout days within it
export const routineDelete = (routine_id) => {
    return (dispatch) => {
        dispatch({ type: REQUEST_INIT });

        workoutsRef.doc(routine_id).collection('workout_days')
        .get()
        .then((workoutDays) => {
            // Delete all documents within routine's workout_days sub-collection
            workoutDays.forEach((day) => {
                day.ref.delete()
                    .catch((error) => console.log(error));
            });

            return;
        })
        .then(() => {
            // Delete routine document after deleting nested workout_days
            workoutsRef.doc(routine_id).delete()
            .then(() => {
                Actions.popTo('workoutMain');
                Actions.refresh({ successMsg: 'Your workout routine has been deleted!' });
                dispatch({ type: DIARY_SUBMIT_SUCCESS });
            })
            .catch((error) => {
                console.log(error);
                Actions.popTo('workoutMain');
                Actions.refresh({ errorMsg: 'Error: could not delete your workout...' });
            });
        })
        .catch((err) => console.log(err));
    };
};

export const routineCreate = (routine_name, user_id) => {
    return (dispatch) => {
        dispatch({ type: REQUEST_INIT });

        // const workoutsRef = firebase.firestore().collection('workouts');
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
                    public: false,
                    level: null
                })
                .then((docRef) => {
                    Actions.popTo('workoutMain');
                    Actions.refresh({ successMsg:
                         `Your workout routine (${routine_name}) was updated and stored!` });
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

export const workoutUpdate = (routine_id, workout_name, exercises, workout_id, finished) => {
    return (dispatch) => {
        const workoutDaysRef = workoutsRef.doc(`${routine_id}`).collection('workout_days');

        // next if condition doesn't pass when submitting new workout doc [.doc()]
        let routineRef = workoutDaysRef.doc();

        if (workout_id !== undefined) { // i.e. updating pre-existing workout
            routineRef = workoutDaysRef.doc(workout_id);
        } 

        routineRef.set({
            workout_name,
            exercises
        })
        .then(() => { 
            console.log(`${workout_name} has been submitted for routine_id: ${routine_id}`); 
            if (finished !== undefined && finished === true) {
                dispatch({
                    type: WORKOUTS_UPDATED
                });
                Actions.popTo('workoutMain');
                Actions.refresh({ successMsg:
                    'Your workout routine was updated and stored!' });
            }
        })
        .catch(error => {
            console.log(error);
            dispatch({ type: REQUEST_FAILURE });
        });
    };
};

export const resetLoading = () => {
    return {
        type: RESET_LOADING
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
