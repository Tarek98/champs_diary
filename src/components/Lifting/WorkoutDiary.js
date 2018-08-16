import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, View, Text } from 'react-native';
import { Card, CardSection, Button, Input, Spinner } from '../common';
import { submitWorkoutDiary } from '../../actions';

class WorkoutDiary extends Component {
    constructor() {
        super();
        this.state = { errorMsg: '' };
    }

    componentWillMount() {
        this.exercises_arr = this.props.Workout.exercises;
        this.diary_container = { 
            date: this.props.Date,
            workout_id: this.props.Workout.id,
            routine_id: this.props.Routine 
        };
        this.current_diary = [];

        // Pre-fill all sets for each exercise in the journal with 0 weight and 0 reps (unknown)
        for (let j = 0; j < this.exercises_arr.length; j++) {
            const element = this.exercises_arr[j];
            const diary_obj = { name: element.name, num_sets: element.sets };

            for (let k = 0; k < element.sets; k++) {
                diary_obj['set_' + k] = { weight: 0, reps: 0 };
            }

            this.current_diary.push(diary_obj);
        }

        this.diary_container.diary_entries = this.current_diary;
    }

    onWorkoutFinish() {
        // Clear errors
        this.setState({ errorMsg: '' }); 
        this.error = false; this.minimumEntriesFilled = false;
 
        this.prepDiaryForSubmit();

        // Checks if diary was filled out properly
        if ((!this.error) && (this.minimumEntriesFilled)) { 
            this.props.submitWorkoutDiary(
                 this.diary_container,
                 this.props.user.uid
            );
        } else if (this.error) {
            this.setState({ 
                errorMsg: 'Error: Please record both weight and reps for each set' 
            });
        } else { // !minimumEntriesFilled 
            this.setState({ 
                errorMsg: 'Error: Please record at least one set before saving' 
            });
        }
    }

    onDiaryEntryChange(value, exercise_index, set_num, entry_type) {
        const curr_exercise = this.current_diary[exercise_index];
        const curr_entry = curr_exercise['set_' + set_num];
        
        // If user input was emptied, set input val to 0
        if (value.length === 0) { 
            curr_entry[entry_type] = 0;
        } else {
            curr_entry[entry_type] = parseInt(value, 10);
        }
    }

    // Ensures minimum sets requirement & any filled sets is 'complete'
    // Each 'complete' set must contain a pair of weight and reps (both can't be 0)
    prepDiaryForSubmit() {
        for (let x = 0; x < this.current_diary.length; x++) {
            const exercise = this.current_diary[x];

            for (let y = 0; y < exercise.num_sets; y++) {
                const set = exercise['set_' + y];
                // XOR error check: Reps or weight, but not both, is unknown
                if ((set.weight === 0) ^ (set.reps === 0)) { 
                    this.error = true;
                    // Break out of all loops
                    return; 
                } else if (this.minimumEntriesFilled === false) {
                    // If one set of weight and reps is filled, min requirement satisfied
                    if ((set.weight !== 0) && (set.reps !== 0)) {
                        this.minimumEntriesFilled = true;
                    }
                }
            }
        }
    }

    renderError() {
        if (this.state.errorMsg || this.props.errorMsg) {
            return (
                <Text style={styles.errorMsgStyle}>
                    {this.state.errorMsg || this.props.errorMsg}
                </Text>
            );
        } else if (this.props.loading) {
            return <Spinner size="large" />;
        }
    }

    renderSets(exercise_info, input_type, exercise_index) {
        const allSets = [];
        // // To-do: Allow 4 digits with decimal point for each entry?            

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

        if (exercise_info.bw) { // Bodyweight exercise
            header.push(<Text> (Use bodyweight)</Text>);
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
                            <Button onPress={this.onWorkoutFinish.bind(this)}>
                                Finish Workout
                            </Button>
                        </CardSection>
                        <CardSection>
                            {this.renderError()}
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
    },
    errorMsgStyle: {
        fontSize: 14,
        alignSelf: 'center',
        color: 'red'
    }
};

const mapStateToProps = state => {
    const { isConnected } = state.connection;
    const { user } = state.auth;
    const { loading } = state.workouts;

    return { isConnected, user, loading };
};

export default connect(mapStateToProps, { submitWorkoutDiary })(WorkoutDiary);
