import React from 'react';
import { Scene, Router, ActionConst, Actions } from 'react-native-router-flux';
import ModeSelect from './components/ModeSelect';
import LoginForm from './components/LoginForm';
import TabIcon from './components/common/TabIcon';
import WorkoutSelect from './components/Lifting/WorkoutSelect';
import RunningTracker from './components/Running/RunningTracker';
import SwimmingTracker from './components/Swimming/SwimmingTracker';
import WeightTracker from './components/WeightCharts/WeightTracker';
import SettingsPage from './components/SettingsPage';

const RouterComponent = () => {
    return (
        <Router navigationBarStyle={styles.navBar} titleStyle={styles.navBarTitle}>
            <Scene key="root" hideNavBar>
                <Scene key="auth">
                    <Scene
                        key="modeSelect"
                        component={ModeSelect}
                        title="Welcome To Champion's Diary"
                        initial
                    />
                    <Scene
                        key="defaultLogin"
                        component={LoginForm}
                        title="Please Login"
                    />
                </Scene>
                
                {/* Main Tab Container */}
                <Scene
                    key="tabBar"
                    rightTitle="Settings"
                    onRight={() => Actions.settingsPage()}
                    tabs
                    tabBarStyle={styles.tabBar}
                    tabBarPosition={'bottom'}
                    showLabel={false}
                    type={ActionConst.RESET}
                >
                    <Scene key="lift" title="Lift" icon={TabIcon}>
                        <Scene
                            key="workoutSelect"
                            component={WorkoutSelect}
                            title="Workout Selection"
                        />
                    </Scene>
                    <Scene key="running" title="Run" icon={TabIcon}>
                        <Scene
                            key="runningTracker"
                            component={RunningTracker}
                            title="Running Tracker"
                        />
                    </Scene>
                    <Scene key="swim" title="Swim" icon={TabIcon}>
                        <Scene
                            key="swimmingTracker"
                            component={SwimmingTracker}
                            title="Swimming Tracker"
                        />
                    </Scene>
                    <Scene key="weight" title="Weight" icon={TabIcon}>
                        <Scene
                            key="weightTracker"
                            component={WeightTracker}
                            title="Weight Tracker"
                        />
                    </Scene>
                </Scene>
                
                <Scene
                    key="settingsPage"
                    component={SettingsPage}
                    title="Settings"
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
    },
    tabBar: {
        backgroundColor: '#333333'
    }
};

export default RouterComponent;
