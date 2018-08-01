import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { ScrollView, View, Text } from 'react-native';
import { Card, CardSection, Button, Input } from '../common';

class WorkoutDiary extends Component {

    componentWillMount() {
        this.exercises_arr = this.props.Workout.exercises;
        this.current_diary = [];

        // Pre-fill all sets for each exercise in the journal with unknown ('X') weight and reps 
        for (let j = 0; j < this.exercises_arr.length; j++) {
            const element = this.exercises_arr[j];
            const diary_obj = { name: element.name };

            for (let k = 0; k < element.sets; k++) {
                diary_obj['set_' + k] = { weight: 0, reps: 0 };
            }

            this.current_diary.push(diary_obj);
        }

        console.log(this.current_diary);
    }

    onDiaryEntryChange(value, exercise_index, set_num, entry_type) {
        const curr_exercise = this.current_diary[exercise_index];
        const curr_entry = curr_exercise['set_' + set_num];
        
        curr_entry[entry_type] = value;

        console.log(this.current_diary);
    }

    renderSets(exercise_info, input_type, exercise_index) {
        const allSets = [];

        for (let i = 0; i < exercise_info.sets; i++) {
            allSets.push(
                <Input 
                    placeholder='___' 
                    inputTextStyle={styles.inputStyle}
                    inputType='numeric'
                    maxLength={3}
                    onChangeText={(text) => {
                        this.onDiaryEntryChange(text, exercise_index, i, input_type);
                    }}
                />
            );
        }

        return allSets;
    }

    renderExerciseHeader(exercise_info) {
        const header = [<Text>{exercise_info.name}</Text>];

        if (exercise_info.bw) { // Bodyweight Exercise
            header.push(<Text> (Bodyweight Exercise)</Text>);
            // // To-do: Pre-fill weight fields with user's bodyweight
        }
        
        return header;
    }

    renderExercises() {
        const exercises_view = this.exercises_arr.map((exercise_info, index) => {
            return (
                <Card>
                    <CardSection>
                        {this.renderExerciseHeader(exercise_info)}
                    </CardSection>
                    <CardSection>
                        <Text>Weight</Text>
                    </CardSection>
                    <CardSection>
                        {this.renderSets(exercise_info, 'weight', index)}
                    </CardSection>
                    <CardSection>
                        <Text># Reps (Goal: {exercise_info.target_reps || '?'})</Text>
                    </CardSection>
                    <CardSection>
                        {this.renderSets(exercise_info, 'reps', index)}
                    </CardSection>
                </Card>
            );
        });

        return exercises_view;
    }

    render() {
        return (
            <View style={{ marginBottom: 75 }}>
                <Card>
                    <CardSection style={{ flexDirection: 'column' }}>
                        <Text>Name: {this.props.Workout.value}</Text>
                        <Text>Date: {this.props.Date}</Text>
                    </CardSection>
                </Card>
                <ScrollView>
                    {this.renderExercises()}
                    <Card>
                        <CardSection>
                            <Button>
                                Finish Workout
                            </Button>
                        </CardSection>
                    </Card>
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    inputStyle: {
        fontSize: 16, 
        paddingRight: 2.5, 
        paddingLeft: 2.5
    }
};

export default WorkoutDiary;
