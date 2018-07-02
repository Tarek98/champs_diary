import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to Async Storage for react-native
import { PersistGate } from 'redux-persist/integration/react';
import ReduxThunk from 'redux-thunk';
import Router from './Router';
import reducers from './reducers';
import firebase from 'firebase';

require('firebase/firestore');

export const persistConfig = {
    key: 'root',
    storage
};

class App extends Component {

    componentWillMount() {
        // Initialize Firebase
        const config = {
            apiKey: 'AIzaSyBI46wSCauv5zfdpOb0wGnwlRZLYAPgzuE',
            authDomain: 'champs-diary.firebaseapp.com',
            databaseURL: 'https://champs-diary.firebaseio.com',
            projectId: 'champs-diary',
            storageBucket: 'champs-diary.appspot.com',
            messagingSenderId: '627326368672'
        };
        firebase.initializeApp(config);
    }

    render() {
        const firestore = firebase.firestore();

        // firestore.enablePersistence()
        //  .then(() => console.log('Success: Firestore offline data enabled.'))
        //  .catch(() => console.log('Failure: Error in enabling firestore offline data.'));

        const settings = { timestampsInSnapshots: true };
        firestore.settings(settings);

        const persistedReducer = persistCombineReducers(persistConfig, reducers);

        const store = createStore(
            persistedReducer, 
            {},
            applyMiddleware(ReduxThunk)
        );

        // Enable redux store persistence to make the app retain state offline! 
        const reduxPersistor = persistStore(store);

        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={reduxPersistor}>
                    <Router />
                </PersistGate>
            </Provider>
        );
    }
}

export default App;

