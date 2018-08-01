import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Dropdown } from 'react-native-material-dropdown';
import { Input, CardSection, Card, Button } from '../common';
import {
    routinesFetch,
    workoutsFetch
} from '../../actions';

class WorkoutSelect extends Component {

    componentWillMount() {
        this.props.routinesFetch();
        this.DDL2Value = ' ';
        this.invalidRoutine = true; this.invalidWorkout = true;

        if (!this.props.loading) {
            this.populateDDL1(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.populateDDL1(nextProps);
        if (typeof nextProps.currWorkouts !== 'undefined') {
            this.populateDDL2(nextProps);
        }
    }

    onButtonPress() {
        // First check if user entries are valid
        if (!this.invalidRoutine && !this.invalidWorkout) {
            Actions.workoutDiary({ 
                Date: this.props.workoutDate, 
                Routine: this.selectedRoutineId, 
                Workout: this.selectedWorkout 
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

    render() {
        return (
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
                            this.selectedRoutineId = data[index].id;
                            this.props.workoutsFetch(this.selectedRoutineId);

                            this.invalidRoutine = (value[0] === ' '); //First character is a space
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
                    <Button onPress={this.onButtonPress.bind(this)}>
                        Start Tracking
                    </Button>
                </CardSection>
            </Card>
        );
    }
}

const mapStateToProps = state => {
    return { routines: state.workouts.public, 
             currWorkouts: state.workouts.currentWorkouts,
             loading: state.workouts.loading
            };
};

export default connect(mapStateToProps, { routinesFetch, workoutsFetch })(WorkoutSelect);
