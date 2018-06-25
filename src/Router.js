import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import ModeSelect from './components/ModeSelect';
import LoginForm from './components/LoginForm';
import SportSelect from './components/SportSelect';

const RouterComponent = () => {
    return (
        <Router navigationBarStyle={styles.navBar} titleStyle={styles.navBarTitle}>
            <Scene key="root">
                <Scene
                    key="modeSelect"
                    component={ModeSelect}
                    title="Champion's Diary"
                    initial
                />
                <Scene
                    key="defaultLogin"
                    component={LoginForm}
                    title="Please Login"
                />
                <Scene
                    key="sportSelect"
                    component={SportSelect}
                />
            </Scene>
        </Router>
    );
};

const styles = {
    navBar: {
        backgroundColor: '#4B0082',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3
    },
    navBarTitle: {
        flex: 1,
        color: '#C0C0C0',
        textAlign: 'center'
    }
};

export default RouterComponent;
