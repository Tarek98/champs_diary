import firebase from 'react-native-firebase';
import Moment from 'moment';
import {
    BODY_STATS_SUBMITTED,
    BODY_STATS_UPDATED,
    REQUEST_FAILURE,
    REQUEST_INIT,
    CHART_LOADING,
    CHART_UPDATED
} from './types';

const DB = firebase.firestore();
const usersRef = DB.collection('users');

export const submitBodyStats = (user_id, doc_id, statsObj, chartStartDate) => {
    return (dispatch) => {
        dispatch({ type: REQUEST_INIT });

        usersRef.doc(user_id).collection('body_stats')
        .doc(doc_id)
        .set(statsObj)
        .then(() => {
            dispatch({ type: BODY_STATS_SUBMITTED, 
                payload: 
                `Your body stats were updated for ${Moment(statsObj.date).format('YYYY-MM-DD')}!` 
            });
            populateStatsChart(user_id, chartStartDate);
        })
        .catch((error) => {
            console.log(error);
            dispatch({ type: REQUEST_FAILURE, payload: 'Error: could not submit body stats' });
        });
    };
};

const pushStatsToChart = (array, date, value) => {
    array.labels.push(`${Moment(date).date()}/${Moment(date).month() + 1}`);
    array.datasets[0].data.push(String(value));
};

export const populateStatsChart = (user_id, monthStartDate) => {
    return (dispatch) => {
        dispatch({ type: CHART_LOADING });

        const monthEndDate = Moment(monthStartDate).add(1, 'month').format('YYYYMMDD');
        
        usersRef.doc(user_id).collection('body_stats')
        .where('date', '>=', monthStartDate)
        .where('date', '<=', monthEndDate)
        .orderBy('date', 'ASC')
        .onSnapshot(querySnapshot => {
            const weightArray = { labels: ['O'], datasets: [{ data: [0] }] };
            const waistArray = { labels: ['O'], datasets: [{ data: [0] }] };

            if (!querySnapshot.empty) {
                let firstIteration = true;  

                querySnapshot.forEach((doc) => {
                    const waistStat = doc.data().waist; 
                    const weightStat = doc.data().weight;  
                    const statsDate = doc.data().date;
                    // Weight stats are always valid in DB
                    pushStatsToChart(weightArray, statsDate, weightStat);
                    // Waist stats are optional, so may not exist
                    if (waistStat !== '' && waistStat !== null) {
                        pushStatsToChart(waistArray, statsDate, waistStat);
                    }
                    if (firstIteration) {
                        weightArray.datasets[0].data[0] = weightStat - 0.01;
                        waistArray.datasets[0].data[0] = waistStat - 0.01;
                        firstIteration = false;
                    } 
                });
            }
            
            dispatch({ type: CHART_UPDATED, payload: { weightArray, waistArray } });
        }); 
    };
};

export const populateStatsInput = (user_id, date) => {
    return (dispatch) => {
        dispatch({ type: REQUEST_INIT });

        usersRef.doc(user_id).collection('body_stats')
        .doc(date)
        .get()
        .then((doc) => {
            let weight = 'unknown';
            let waist = 'unknown';
            let successMsg = '';

            if (doc.exists) {
                weight = doc.data().weight;
                waist = doc.data().waist;
                successMsg = 'Your body stats are showing above!';
            } else {
                successMsg = `No body stats exist for ${Moment(date).format('YYYY-MM-DD')}`;
            }
            dispatch({
                type: BODY_STATS_UPDATED,
                payload: { weight, waist, successMsg }
            });
        })
        .catch((error) => {
            console.log(error);
            dispatch({ 
                type: REQUEST_FAILURE, 
                payload: `Error: could not get body stats for ${Moment(date).format('YYYY-MM-DD')}` 
            });
        });
    };
};
