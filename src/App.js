import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import Router from './Router';
import reducers from './reducers';
import firebase from 'firebase';

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
        const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

        return (
            <Provider store={store}>
                <Router />
            </Provider>
        );
    }
}

export default App;

