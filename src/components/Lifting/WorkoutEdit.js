import React, { Component } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { connect } from 'react-redux';
import { Dropdown } from 'react-native-material-dropdown';
import { CardSection, Input, Card, Button, ListItem, Spinner } from '../common';
import { closePanels, routineCreate, workoutCreate, updateComplete } from '../../actions';

class WorkoutEdit extends Component {
    constructor() {
        super();
        const numExercises = [];
        const workout_details = [];
        this.dropdown_data = [];

        for (let i = 1; i < 8; i++) {
            this.dropdown_data.push({ value: i });
            numExercises.push(1); // Assuming all workout days have 1 exercise initially
            workout_details.push({ name: '', exercises: [] });
            for (let j = 0; j < 10; j++) {
                workout_details[i - 1].exercises.push({ 
                    bw: false, name: '', sets: '', target_reps: '' 
                });
            }
        }

        console.log(workout_details);
        
        this.state = { 
            routine_name: '', 
            numWorkouts: 1,
            exercises_per_workout: numExercises, 
            workout_details,
            error: ''
        }; 
    }

    componentWillMount() {
        this.props.closePanels();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initiateWorkoutSave && nextProps.routineId !== this.props.routineId) {
            for (let i = 0; i < this.state.numWorkouts; i++) {
                const element = this.state.workout_details[i];
                const numExercises = this.state.exercises_per_workout[i];
                const exercises = element.exercises.slice(0, numExercises);

                this.props.workoutCreate(nextProps.routineId, element.name, exercises);
            }
            this.props.updateComplete();
        }
    }

    onSaveButton() {
        // Error checking to determine if workout can be submitted
        if (this.state.routine_name !== '') {
            // Hasmaps used to check for duplicate workout names
            const hashMap1 = {};

            for (let i = 0; i < this.state.numWorkouts; i++) {
                const currWorkout = this.state.workout_details[i];

                if (currWorkout.name !== '' && hashMap1[currWorkout.name] !== 'occupied') {
                    hashMap1[currWorkout.name] = 'occupied';

                    const hashMap2 = {};

                    for (let j = 0; j < this.state.exercises_per_workout[i]; j++) {
                        const currExercise = currWorkout.exercises[j];
                        
                        if ((currExercise.name === '' || currExercise.sets === '') 
                                || hashMap2[currExercise.name] === 'occupied') {
                            this.setState({ 
                                error:
                                 'Error: exercises must have unique names and non-empty sets' 
                            });
                            return;
                        }

                        hashMap2[currExercise.name] = 'occupied';
                    }
                } else {
                    this.setState({ error: 'Error: all workout days must have a unique name' });
                    return;
                }
            }
        } else {
            this.setState({ error: 'Error: the workout routine must have a name' });
            return;
        }

        // Clear error if all checks are passed
        this.setState({ error: '' });

        // Saves routine in DB, returns routineId + initiateWorkoutUpdate props
        // In ComponentWillRecieveProps, response is triggerred to save workouts in the routine
        this.props.routineCreate(this.state.routine_name, this.props.user.uid);
    }

    updateExercise(workout_day, i, detail_type, value) {
        this.setState(prevState => {
            const new_details = prevState.workout_details;
            new_details[workout_day].exercises[i][detail_type] 
                = (detail_type === 'sets' || detail_type === 'target_reps')
                 ? parseInt(value, 10) : value;
            return { workout_details: new_details };
        });
    }

    renderExerciseInputs(workout_day, index) {
        const input_fields = [];
        const input_names = ['name', 'sets', 'target_reps'];
        const placeholders = ['Name', '3', '6'];

        for (let fieldN = 0; fieldN < input_names.length; fieldN++) {
            const curr_field = input_names[fieldN];
            input_fields.push(
                <Input
                    value={this.state.workout_details[workout_day].exercises[index][curr_field]}
                    placeholder={placeholders[fieldN]}
                    inputType={curr_field === 'name' ? 'default' : 'numeric'}
                    hideLabel
                    inputTextStyle={{ fontSize: 14 }}
                    onChangeText={value =>
                        this.updateExercise(workout_day, index, curr_field, value)}
                />
            );
        }

        return input_fields;
    }

    renderExercises(workout_day) {
        const exercises = [];
        
        for (let i = 0; i < this.state.exercises_per_workout[workout_day]; i++) {
            exercises.push(
                <View>
                    <CardSection style={[styles.exerciseTable, { paddingRight: 32 }]}>
                        {this.renderExerciseInputs(workout_day, i)}
                        <Switch 
                            value={
                                this.state.workout_details[workout_day].exercises[i].bw
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
                            value={this.state.workout_details[i].name}
                            label="Name" 
                            placeholder="Workout B" 
                            labelStyle={styles.inputLabel}
                            inputTextStyle={styles.inputText}
                            onChangeText={value => {
                                this.setState(prevState => {
                                    const new_details = prevState.workout_details;
                                    new_details[i].name = value;
                                    return { workout_details: new_details };
                                });
                            }}
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

    renderButton() {
        if (!this.props.loading) {
            return (
                <CardSection>
                    <Button onPress={() => { this.onSaveButton(); }}>
                        Save Workout Routine
                    </Button>
                </CardSection>
            );
        }
        return (
            <CardSection>
                <Spinner size="large" />
            </CardSection>
        );
    }

    renderError() {
        if (this.state.error || this.props.errorMsg) {
            return (
                <CardSection style={{ justifyContent: 'center' }}>
                    <Text style={styles.errorMsgStyle}>
                        {this.state.error || this.props.errorMsg}
                    </Text>
                </CardSection>
            );
        } 
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
                            value={this.state.routine_name}
                            label="Name" 
                            placeholder="My Workout Routine"
                            labelStyle={styles.inputLabel}
                            inputTextStyle={styles.inputText}
                            onChangeText={value => { this.setState({ routine_name: value }); }}
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
                        <Text>Tap on the workout day(s) below to view or edit them</Text>
                    </CardSection>
                    {this.renderWorkoutDays()}
                </Card>

                <Card>
                    {this.renderButton()}
                    {this.renderError()}
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
    },
    errorMsgStyle: {
        fontSize: 14,
        alignSelf: 'center',
        color: 'red'
    }
};

const mapStateToProps = state => {
    const { loading, routineId, initiateWorkoutSave, errorMsg } = state.workouts;
    const { user } = state.auth;

    return { loading, routineId, initiateWorkoutSave, user, errorMsg };
};

export default connect(mapStateToProps, 
    { closePanels, routineCreate, workoutCreate, updateComplete })(WorkoutEdit);
