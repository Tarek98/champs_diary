import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import firebase from 'react-native-firebase';
import storage from 'redux-persist/lib/storage'; // defaults to Async Storage for react-native
import { PersistGate } from 'redux-persist/integration/react';
import ReduxThunk from 'redux-thunk';
import Router from './Router';
import reducers from './reducers';

require('firebase/firestore');

export const persistConfig = {
    key: 'root',
    storage
};

class App extends Component {
    render() {
        const firestore = firebase.firestore();
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

        // Uncomment this line to clear persisted redux state from the device
        // reduxPersistor.purge();

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

