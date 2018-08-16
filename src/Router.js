import React from 'react';
import { Scene, Router, ActionConst, Actions } from 'react-native-router-flux';
import ModeSelect from './components/ModeSelect';
import LoginForm from './components/LoginForm';
import TabIcon from './components/common/TabIcon';
import WorkoutMain from './components/Lifting/WorkoutMain';
import WorkoutList from './components/Lifting/WorkoutList';
import WorkoutSelect from './components/Lifting/WorkoutSelect';
import WorkoutDiary from './components/Lifting/WorkoutDiary';
import RunningTracker from './components/Running/RunningTracker';
import SwimmingTracker from './components/Swimming/SwimmingTracker';
import WeightTracker from './components/WeightCharts/WeightTracker';
import SettingsPage from './components/SettingsPage';
import WorkoutEdit from './components/Lifting/WorkoutEdit';

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
                
                
                <Scene key="main">
                    {/* Main Tab Container */}
                    <Scene
                        key="tabBar"
                        rightTitle="Settings"
                        onRight={() => Actions.settingsPage()}
                        hideNavBar
                        tabs
                        tabBarStyle={styles.tabBar}
                        tabBarPosition={'bottom'}
                        showLabel={false}
                        type={ActionConst.RESET}
                    >
                        <Scene key="lift" title="Lift" icon={TabIcon}>
                            <Scene
                                key="workoutMain"
                                component={WorkoutMain}
                                title="Your Workouts"
                            />
                            <Scene
                                key="workoutEdit"
                                component={WorkoutEdit}
                                title="Customize Workouts"
                            />
                            <Scene
                                key="workoutList"
                                component={WorkoutList}
                                title="Workout Routines"
                            />
                            <Scene
                                key="workoutSelect"
                                component={WorkoutSelect}
                                title="Select Your Workout"
                            />
                            <Scene
                                key="workoutDiary"
                                component={WorkoutDiary}
                                title="Track Your Workout"
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
                        hideTabBar
                    />
                </Scene>
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
        color: '#C0C0C0'
    },
    tabBar: {
        backgroundColor: '#333333'
    }
};

export default RouterComponent;
