import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { Actions } from 'react-native-router-flux';
import { CardSection, Input, Card, Button } from '../common';

class WorkoutEdit extends Component {
    constructor() {
        super();
        
        const numExercises = [];
        this.dropdown_data = [];
        for (let i = 1; i < 8; i++) {
            this.dropdown_data.push({ value: i });
            numExercises.push(1);
        }
        
        this.state = { numWorkouts: 1, exercises_per_workout: numExercises }; 
    }

    renderExercises(workout_day) {
        const exercises = [];
        
        for (let i = 0; i < this.state.exercises_per_workout[workout_day]; i++) {
            exercises.push(
                <CardSection style={styles.exerciseTable}>
                    <Input
                        placeholder="Name"
                    />
                    <Input
                        placeholder="3"
                    />
                    <Input
                        placeholder="6"
                    />
                    <Input
                        placeholder="Y/N"
                    />
                </CardSection>
            );
        }

        return exercises;
    }

    renderWorkoutDays() {
        const workoutDays = [];

        for (let i = 1; i < this.state.numWorkouts + 1; i++) {
            workoutDays.push(
                <View>
                    <CardSection style={styles.subTitleContainer}>
                        <Text style={styles.sectionTitle}>{`Workout Day ${i}`}</Text>
                    </CardSection>
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
                            value={1}
                            containerStyle={{ flex: 1, paddingLeft: 5, paddingRight: 10 }}
                            onChangeText={(value) => { this.setState({ numWorkouts: value }); }}
                        />
                    </CardSection>
                    <CardSection style={styles.exerciseTable}>
                        <Text>Exercise</Text>
                        <Text>Sets</Text>
                        <Text>Target Reps</Text>
                        <Text>Bodyweight?</Text>
                    </CardSection>
                    {this.renderExercises(i)}
                </View>
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
        backgroundColor: 'grey'
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

export default WorkoutEdit;
