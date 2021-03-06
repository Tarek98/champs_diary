import React, { Component } from 'react';
import { View, Text, ScrollView, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Dropdown } from 'react-native-material-dropdown';
import { CardSection, Input, Card, Button, ListItem, Spinner } from '../common';
import { closePanels, routineCreate, workoutUpdate, updateComplete,
     workoutsFetch, resetLoading } from '../../actions';

class WorkoutEdit extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            numWorkouts: 1, 
            error: '',
            keyboardAdapt: true
        };
    }

    componentWillMount() {
        this.props.resetLoading();
        this.props.closePanels();

        const numExercises = []; const workout_details = []; this.dropdown_data = [];
        let routine_name = ''; let routineId = '';
        let numWorkouts = 1;

        for (let i = 1; i < 8; i++) {
            this.dropdown_data.push({ value: i });
            numExercises.push(1); // Assuming all workouts have 1 exercise initially
            workout_details.push({ name: '', exercises: [] });
            for (let j = 0; j < 10; j++) {
                workout_details[i - 1].exercises.push({ 
                    bw: false, name: '', sets: '', target_reps: '' 
                });
            }
        }

        if (this.props.routineToEdit !== null || this.props.routineToView !== null) { 
            // editing a pre-existing routine
            const routine = (this.props.routineToEdit === null) ? 
                (this.props.routineToView) : (this.props.routineToEdit);
            routine_name = routine.routine_name;
            routineId = routine.id;

            // editing pre-existing workouts within the routine
            const workouts = this.props.currentWorkouts;
            numWorkouts = workouts.length;

            for (let j = 0; j < workouts.length; j++) {
                numExercises[j] = workouts[j].exercises.length;
                workout_details[j].name = workouts[j].workout_name;
                workout_details[j].firestoreID = workouts[j].id;

                for (let k = 0; k < numExercises[j]; k++) {
                    workout_details[j].exercises[k] = workouts[j].exercises[k];
                }
            }
        }

        this.setState({
            routine_name,
            routineId,
            numWorkouts,
            exercises_per_workout: numExercises,
            workout_details
        });
    }

    componentWillReceiveProps(nextProps) {
        // first if check: saves workouts after ensuring that routine has been saved to DB first
        if (nextProps.initiateWorkoutSave && nextProps.routineId !== this.props.routineId) {
            for (let i = 0; i < this.state.numWorkouts; i++) {
                const element = this.state.workout_details[i];
                const numExercises = this.state.exercises_per_workout[i];
                const exercises = element.exercises.slice(0, numExercises);

                this.props.workoutUpdate(nextProps.routineId, element.name, exercises);
            }
            this.props.updateComplete();
        } 
    }

    onSaveButton() {
        // Error checking to determine if workout can be submitted
        if (this.state.routine_name !== '') {
            // Hashmaps used to check for duplicate workout names
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
                        } else if (currExercise.sets > 7 || currExercise.sets < 1) {
                            this.setState({ 
                                error:
                                 'Error: exercises must have more than 1 set and less than 7 sets' 
                            });
                            return;
                        } 

                        hashMap2[currExercise.name] = 'occupied';
                    }
                } else {
                    this.setState({ error: 'Error: each workout in the routine must have a unique name' });
                    return;
                }
            }
        } else {
            this.setState({ error: 'Error: the workout routine must have a name' });
            return;
        }

        // Clear error if all checks are passed
        this.setState({ error: '' });

        if (this.props.routineToEdit !== null 
            && this.props.currentWorkouts) { 
            const workoutCount = this.props.currentWorkouts.length;
            // update pre-existing workouts for a routine in DB
            for (let x = 0; x < workoutCount; x++) {
                const isLastWorkout = (x === workoutCount - 1);
                const workoutInput = this.state.workout_details[x];
                const numExercises = this.state.exercises_per_workout[x];
                const exercises = workoutInput.exercises.slice(0, numExercises);
                
                this.props.workoutUpdate(this.state.routineId, workoutInput.name, exercises, 
                    workoutInput.firestoreID, isLastWorkout);
            }
        } else {
            // Save routine in DB, returns routineId + initiateWorkoutUpdate props
            // In ComponentWillRecieveProps, response is triggerred to save workouts in the routine
            this.props.routineCreate(this.state.routine_name, this.props.user.uid);
        }
    }

    updateExercise(workout_day, i, detail_type, value) {
        this.setState(prevState => {
            const new_details = prevState.workout_details;
            new_details[workout_day].exercises[i][detail_type] 
                = (detail_type === 'sets' || detail_type === 'target_reps')
                 ? (parseInt(String(value), 10) || 0) : value;
            return { workout_details: new_details };
        });
    }

    renderExerciseInputs(workout_day, index, updateInputsDisabled) {
        const input_fields = [];
        const input_names = ['name', 'sets', 'target_reps'];
        const placeholders = ['Name', '3', '6'];

        for (let fieldN = 0; fieldN < input_names.length; fieldN++) {
            const curr_field = input_names[fieldN];
            input_fields.push(
                <Input
                    value={
                        String(this.state.workout_details[workout_day].exercises[index][curr_field])
                    }
                    editable={!updateInputsDisabled}
                    placeholder={placeholders[fieldN]}
                    inputType={curr_field === 'name' ? 'default' : 'numeric'}
                    hideLabel
                    inputTextStyle={{ fontSize: 14, height: 34 }}
                    onChangeText={value =>
                        this.updateExercise(workout_day, index, curr_field, value)}
                    onFocus={() => this.setState({ keyboardAdapt: true })}
                    key={String(workout_day) + String(index) + String(curr_field)}
                />
            );
        }

        return input_fields;
    }

    renderExercises(workout_day, updateInputsDisabled) {
        const exercises = [];
        
        for (let i = 0; i < this.state.exercises_per_workout[workout_day]; i++) {
            exercises.push(
                <View key={i}>
                    <CardSection style={[styles.exerciseTable, { paddingRight: 32 }]}>
                        {this.renderExerciseInputs(workout_day, i, updateInputsDisabled)}
                        <Switch 
                            value={
                                this.state.workout_details[workout_day].exercises[i].bw
                            }
                            onValueChange={value => 
                                this.updateExercise(workout_day, i, 'bw', value)}
                            disabled={updateInputsDisabled}
                        />
                    </CardSection>
                </View>
            );
        }

        return exercises;
    }

    renderWorkoutDays(updateInputsDisabled) {
        const workoutDays = [];

        for (let i = 0; i < this.state.numWorkouts; i++) {
            workoutDays.push(
                <ListItem
                    panelId={i}
                    cardTitle={`Workout ${i + 1}`}
                    headerStyle={styles.subTitleContainer}
                    key={i}
                >
                    <CardSection>
                        <Input 
                            value={this.state.workout_details[i].name}
                            editable={!updateInputsDisabled}
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
                            onFocus={() => this.setState({ keyboardAdapt: false })}
                        />
                    </CardSection>
                    <CardSection>
                        <Dropdown
                            label="Number of Exercises"
                            disabled={updateInputsDisabled}
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
                    {this.renderExercises(i, updateInputsDisabled)}
                </ListItem>
            );
        }

        return workoutDays;
    }

    renderButton() {
        if (this.props.routineToView !== null) {
            return null;
        }
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
        const coreInputsDisabled = 
            (this.props.routineToEdit !== null) || (this.props.routineToView !== null);
        const updateInputsDisabled = (this.props.routineToView !== null);
        const keyboardBehavior = (Platform.OS === 'ios' ? 'padding' : null);
        const viewOrEdit = (this.props.routineToView !== null) ? 'view' : 'edit';

        return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={keyboardBehavior}
            enabled={this.state.keyboardAdapt}
        >
        <ScrollView style={{ marginBottom: 12 }}>
            <Card>
                <CardSection style={styles.titleContainer}>
                    <Text style={styles.sectionTitle}>{this.props.sectionTitle}</Text>
                </CardSection>
                <CardSection>
                    <Input 
                        value={this.state.routine_name}
                        editable={!coreInputsDisabled}
                        label="Name" 
                        placeholder="My Workout Routine"
                        labelStyle={styles.inputLabel}
                        inputTextStyle={styles.inputText}
                        onChangeText={value => { this.setState({ routine_name: value }); }}
                        onFocus={() => this.setState({ keyboardAdapt: false })}
                    />
                </CardSection>
                <CardSection>
                    <Dropdown
                        label="Number Of Workouts In Routine"
                        disabled={coreInputsDisabled}
                        data={this.dropdown_data}
                        value={this.state.numWorkouts}
                        containerStyle={{ flex: 1, paddingLeft: 5, paddingRight: 10 }}
                        onChangeText={(value) => { this.setState({ numWorkouts: value }); }}
                    />
                </CardSection>
            </Card>

            <Card>
                <CardSection>
                    <Text>{`Tap on the workout(s) below to ${viewOrEdit} them`}</Text>
                </CardSection>
                {this.renderWorkoutDays(updateInputsDisabled)}
            </Card>

            <Card>
                {this.renderButton()}
                {this.renderError()}
            </Card>
        </ScrollView>   
        </KeyboardAvoidingView>
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
        alignItems: 'center',
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
    { closePanels, 
        routineCreate, 
        workoutUpdate, 
        updateComplete,
         workoutsFetch, 
         resetLoading })(WorkoutEdit);
