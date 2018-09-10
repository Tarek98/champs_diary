import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Dropdown } from 'react-native-material-dropdown';
import { Input, CardSection, Card, Button, ListItem, Spinner, Confirm } from '../common';
import {
    routinesFetch,
    workoutsFetch,
    getWorkoutDiaryHistory,
    workoutDiaryDelete
} from '../../actions';

class WorkoutSelect extends Component {
    state = { showModal: false, diaryHistory: null };

    componentWillMount() {
        this.props.getWorkoutDiaryHistory(this.props.user.uid, this.props.workoutDate);
        this.props.routinesFetch(this.props.user.uid);

        this.DDL2Value = ' ';
        this.invalidRoutine = true; this.invalidWorkout = true;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.routines) {
            this.populateDDL1(nextProps);
        }
        if (typeof nextProps.currWorkouts !== 'undefined') {
            this.populateDDL2(nextProps);
        }
        if (nextProps.diaryHistory) {
            this.setState({ diaryHistory: nextProps.diaryHistory });
        }
    }

    onButtonPress() {
        // First check if user entries are valid
        if (!this.invalidRoutine && !this.invalidWorkout) {
            const selectedRoutine = { name: this.selectedRoutineName, id: this.selectedRoutineId };

            Actions.workoutDiary({ 
                Date: this.props.workoutDate, 
                Routine: selectedRoutine, 
                Workout: this.selectedWorkout,
                diaryToEdit: null,
                sectionTitle: 'Track Weight & Reps For Atleast 1 Set (Column)'
            });
        }
    }

    populateDDL1({ routines }) {
        this.DDL1Data = [];

        routines.forEach(routine => 
            this.DDL1Data.push({ value: routine.routine_name, id: routine.id }));
    }

    populateDDL2({ currWorkouts }) {
        this.DDL2Data = [];

        currWorkouts.forEach(workout => {
            if (workout.workout_name) { // If the workout has a name, push it to the drop down list
                this.DDL2Data.push({ value: workout.workout_name, 
                                     id: workout.id, 
                                     exercises: workout.exercises });
            } 
        });
    }

    renderListItem(item) {
        return (
            <ListItem
                panelId={item.id}
                cardTitle={
                    `${item.routine.name} : ${item.workout.name}`
                }
                headerStyle={{ marginLeft: 0, marginRight: 0 }}
            >
                <CardSection style={{ flexDirection: 'column' }}>
                    <Button 
                        onPress={() => {
                            Actions.workoutDiary({
                                diaryToEdit: item,
                                sectionTitle: 'View Workout History'
                            });
                        }}
                        styling={{ marginLeft: 75, marginRight: 75 }}
                    >
                        View workout details
                    </Button>
                    <Text />
                    <Button
                        onPress={() => {
                            this.setState({ showModal: !this.state.showModal });
                        }}
                        styling={{ marginLeft: 75, 
                            marginRight: 75, 
                            backgroundColor: 'red' }}
                    >   
                        Delete workout entry    
                    </Button>
                </CardSection>
            </ListItem>
        );
    }

    renderWorkoutHistory() {
        const prevDiaries = this.state.diaryHistory;

        if (this.props.loading) {
            return (
                <Card>
                    <CardSection>
                        <Spinner />
                    </CardSection>
                </Card>
            );
        }
        return (
            <Card>
                <CardSection>
                    <Text>Workout History for {this.props.workoutDate}</Text>
                </CardSection>
                <CardSection>
                    <FlatList
                        data={prevDiaries}
                        renderItem={({ item }) =>
                            this.renderListItem(item)
                        }
                    />
                </CardSection>
            </Card>
        );
    }

    render() {
        return (
            <View>
                <Card>
                    <CardSection>
                        <Input
                            label='Date'
                            placeholder='DD/MM/YYYY'
                            value={this.props.workoutDate}
                            editable={false}
                        />
                    </CardSection>
                    <CardSection>
                        <Dropdown
                            label='Routine'
                            data={this.DDL1Data}
                            value={' '}
                            containerStyle={{ flex: 1, paddingLeft: 20, paddingRight: 10 }}
                            onChangeText={(value, index, data) => { 
                                this.selectedRoutineName = value;
                                this.selectedRoutineId = data[index].id;
                                this.props.workoutsFetch(this.selectedRoutineId);

                                // Invalid: First character is a space
                                this.invalidRoutine = (value[0] === ' '); 

                                if (this.DDL2Value === ' ') {
                                    this.DDL2Value = '  ';
                                } else {
                                    this.DDL2Value = ' ';
                                }
                            }
                            }
                        />
                        <Dropdown
                            label='Workout'
                            data={this.DDL2Data}
                            value={this.DDL2Value}
                            containerStyle={{ flex: 1, paddingRight: 20 }}
                            onChangeText={(value, index, data) => {
                                this.invalidWorkout = (value[0] === ' ');
                                this.selectedWorkout = data[index];
                            }}
                        />
                    </CardSection>
                    <CardSection>
                        <Button 
                            onPress={this.onButtonPress.bind(this)}
                            styling={{ backgroundColor: 'green' }}
                        >
                            Start Tracking
                        </Button>
                    </CardSection>
                </Card>
                {this.renderWorkoutHistory()}
                <Confirm
                    visible={this.state.showModal}
                    onAccept={() => {
                        this.props.workoutDiaryDelete(this.props.user.uid, 
                            this.props.selectedPanelId);
                        this.setState({ showModal: false });
                    }}
                    onDecline={() => {
                        this.setState({ showModal: false });
                    }}
                >
                    Are you sure you want to delete this entry?
                </Confirm>
            </View>
        );
    }
}

const mapStateToProps = state => {
    const { allRoutines, currentWorkouts, diaryHistory, loading, selectedPanelId } = state.workouts;
    const { user } = state.auth;

    return { routines: allRoutines, 
             currWorkouts: currentWorkouts,
             diaryHistory,
             loading, 
             selectedPanelId,
             user
            };
};

export default connect(mapStateToProps, 
    { routinesFetch, workoutsFetch, getWorkoutDiaryHistory, workoutDiaryDelete })(WorkoutSelect);
