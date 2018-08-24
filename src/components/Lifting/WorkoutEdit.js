import React, { Component } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { connect } from 'react-redux';
import { Dropdown } from 'react-native-material-dropdown';
import { CardSection, Input, Card, Button, ListItem } from '../common';
import { closePanels } from '../../actions';

class WorkoutEdit extends Component {
    constructor() {
        super();
        const numExercises = [];
        const workout_details = [];
        this.dropdown_data = [];

        for (let i = 1; i < 8; i++) {
            this.dropdown_data.push({ value: i });
            numExercises.push(1); // Assuming all workout days have 1 exercise initially
            workout_details.push({ name: '' });
            for (let j = 0; j < 10; j++) {
                workout_details[i - 1]['exercise_' + j] = { bw: false };
            }
        }

        console.log(workout_details);
        
        this.state = { numWorkouts: 1, exercises_per_workout: numExercises, workout_details }; 
    }

    componentWillMount() {
        this.props.closePanels();
    }

    updateExercise(workout_day, i, detail_type, value) {
        this.setState(prevState => {
            const new_details = prevState.workout_details;
            new_details[workout_day]['exercise_' + i][detail_type] = value;
            console.log(new_details);
            return { workout_details: new_details };
        });
    }

    renderExercises(workout_day) {
        const exercises = [];
        
        for (let i = 0; i < this.state.exercises_per_workout[workout_day]; i++) {
            exercises.push(
                <View>
                    <CardSection style={[styles.exerciseTable, { paddingRight: 32 }]}>
                        <Input
                            placeholder="Name"
                            hideLabel
                            inputTextStyle={{ fontSize: 14 }}
                            onChangeText={value =>
                                 this.updateExercise(workout_day, i, 'name', value)}
                        />
                        <Input
                            placeholder="3"
                            hideLabel
                            inputTextStyle={{ fontSize: 14 }}
                            onChangeText={value => 
                                this.updateExercise(workout_day, i, 'sets', value)}
                        />
                        <Input
                            placeholder="6"
                            hideLabel
                            inputTextStyle={{ fontSize: 14 }}
                            onChangeText={value => 
                                this.updateExercise(workout_day, i, 'target_reps', value)}
                        />
                        <Switch 
                            value={
                                this.state.workout_details[workout_day]['exercise_' + i].bw
                            }
                            onValueChange={value => 
                                this.updateExercise(workout_day, i, 'bw', value)}
                        />
                    </CardSection>
                </View>
            );
        }

        return exercises;
    }

    renderWorkoutDays() {
        const workoutDays = [];

        for (let i = 0; i < this.state.numWorkouts; i++) {
            workoutDays.push(
                <ListItem
                    panelId={i}
                    cardTitle={`Workout Day ${i + 1}`}
                    headerStyle={styles.subTitleContainer}
                >
                    <CardSection>
                        <Input 
                            label="Name" 
                            placeholder="Workout B" 
                            labelStyle={styles.inputLabel}
                            inputTextStyle={styles.inputText}
                        />
                    </CardSection>
                    <CardSection>
                        <Dropdown
                            label="Number of Exercises"
                            data={this.dropdown_data}
                            value={this.state.exercises_per_workout[i]}
                            containerStyle={{ flex: 1, paddingLeft: 5, paddingRight: 10 }}
                            onChangeText={(value) => { 
                                this.setState(prevState => {
                                    const newArray = prevState.exercises_per_workout;
                                    newArray[i] = value;
                                    return { exercises_per_workout: newArray };
                                });
                            }}
                        />
                    </CardSection>
                    <CardSection style={styles.exerciseTable}>
                        <Text>Exercise</Text>
                        <Text>Sets</Text>
                        <Text>Target Reps</Text>
                        <Text>Bodyweight?</Text>
                    </CardSection>
                    {this.renderExercises(i)}
                </ListItem>
            );
        }

        return workoutDays;
    }

    render() {
        return (
            <ScrollView style={{ marginBottom: 12 }}>
                <Card>
                    <CardSection style={styles.titleContainer}>
                        <Text style={styles.sectionTitle}>{this.props.sectionTitle}</Text>
                    </CardSection>
                    <CardSection>
                        <Input 
                            label="Name" 
                            placeholder="My Workout Routine"
                            labelStyle={styles.inputLabel}
                            inputTextStyle={styles.inputText}
                        />
                    </CardSection>
                    <CardSection>
                        <Dropdown
                            label="Number of Workouts"
                            data={this.dropdown_data}
                            value={1}
                            containerStyle={{ flex: 1, paddingLeft: 5, paddingRight: 10 }}
                            onChangeText={(value) => { this.setState({ numWorkouts: value }); }}
                        />
                    </CardSection>
                </Card>

                <Card>
                    <CardSection>
                        <Text>Tap the workout day(s) below to view or edit them</Text>
                    </CardSection>
                    {this.renderWorkoutDays()}
                </Card>

                <Card>
                    <CardSection>
                        <Button>
                            Save Workout Routine
                        </Button>
                    </CardSection>
                </Card>
            </ScrollView>
        );
    }
}

const styles = {
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'steelblue'
    },
    sectionTitle: {
        fontWeight: 'bold',
        color: 'white'
    },
    subTitleContainer: {
        alignItems: 'center',
        backgroundColor: 'grey',
        marginLeft: 0, 
        marginRight: 0
    },
    inputLabel: {
        paddingLeft: 5
    },
    inputText: {
        flex: 3, 
        paddingLeft: 0
    },
    exerciseTable: {
        justifyContent: 'space-between',
        padding: 10
    }
};

export default connect(null, { closePanels })(WorkoutEdit);
