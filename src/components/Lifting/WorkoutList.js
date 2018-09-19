import React, { Component } from 'react';
import { Text, View, Linking, FlatList, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { CardSection, Card, ListItem, Spinner, Button, Confirm } from '../common';
import { routinesFetch, routineDelete, workoutsFetch } from '../../actions';

const Difficulty = ['Great routine for beginners with fast progression',
                    'Fun workout routine for beginners',
                    'Awesome routine for intermediates'];

class WorkoutList extends Component {
    constructor() {
        super();
        this.state = { showModal: false, routineToEdit: null, routineToView: null, routines: null };
    }

    componentWillMount() {
        this.props.routinesFetch(this.props.user.uid);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.routines) {
            console.log(nextProps.routines);
            this.setState({ routines: nextProps.routines });
        }
        if (nextProps.currentWorkouts !== this.props.currentWorkouts) {
            if (this.state.routineToEdit !== null) {
                Actions.workoutEdit({
                    routineToEdit: this.state.routineToEdit,
                    routineToView: null,
                    currentWorkouts: nextProps.currentWorkouts,
                    sectionTitle: 'Edit Your Workout Routine' 
                });
            } else if (this.state.routineToView !== null) {
                Actions.workoutEdit({
                    routineToView: this.state.routineToView,
                    routineToEdit: null,
                    currentWorkouts: nextProps.currentWorkouts,
                    sectionTitle: 'View App Workouts (Read-Only)' 
                });
            }
        }
    }

    onDecline() {
        this.setState({ showModal: false });
    }

    onAccept() {
        this.props.routineDelete(this.props.expandedPanelId);
        this.setState({ showModal: false });
    }

    renderButtons(workout) {
        if (workout.level === null) {
            return (
                <View>
                    <Text />
                    <Button 
                        onPress={() => {
                            this.setState({ routineToEdit: workout, routineToView: null });
                            this.props.workoutsFetch(workout.id);
                        }}
                        styling={{ marginLeft: 75, marginRight: 75 }}
                    >
                        Edit Routine
                    </Button>
                    <Text />
                    <Button
                        onPress={() => this.setState({
                            showModal: !this.state.showModal
                        })}
                        styling={{ marginLeft: 75, marginRight: 75, backgroundColor: 'red' }}
                    >
                        Delete Routine
                    </Button>
                </View>
            );
        } 
        return (
            <View>
                <Text />
                <Button
                    onPress={() => {
                        this.setState({ routineToView: workout, routineToEdit: null });
                        this.props.workoutsFetch(workout.id);
                    }}
                    styling={{ marginLeft: 75, marginRight: 75 }}
                >
                    View Routine
                </Button>
            </View>
        );
    }

    renderRow(workout) {
        const headerTabColor = (workout.level === null) ? 'green' : 'grey';
        const headerStyle = { backgroundColor: headerTabColor };

        return (
            <ListItem 
                panelId={workout.id} 
                cardTitle={workout.routine_name}
                headerStyle={headerStyle}
            >
                <View>
                    <CardSection style={{ flexDirection: 'column', marginLeft: 5 }}>
                        {!workout.program_guide ? null :
                            <View>
                                <Text style={{ fontWeight: 'bold' }}>
                                    Workout Guide
                                </Text>
                                <Text 
                                    style={{ color: 'blue' }} 
                                    onPress={() => Linking.openURL(workout.program_guide)}
                                >
                                    {workout.program_guide}
                                </Text> 
                                <Text />
                            </View>
                        }
                        <Text style={{ fontWeight: 'bold' }}>
                            Description
                        </Text>
                        <Text>
                            {workout.level !== null ? Difficulty[workout.level] 
                                : 'A workout routine created by you'}
                        </Text>
                        {this.renderButtons(workout)}
                    </CardSection>
                </View>
            </ListItem>
        );
    }

    renderListView() {
        if (this.props.loading || this.state.routines === null) {
            return (
                <CardSection>
                    <Spinner size='large' />
                </CardSection>
            );
        }
        return (
            <FlatList
                data={this.state.routines}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => this.renderRow(item)}
            />
        );
    }

    render() {
        return (
            <ScrollView>
                <Card>
                    <CardSection style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                            Tap on the routines below to view their details
                        </Text>
                    </CardSection>
                </Card>
                {this.renderListView()}
                <Card>
                    <CardSection style={{ flexDirection: 'column' }}>
                        <Text style={{ fontWeight: 'bold' }}>NOTE: </Text>
                        <Text>
                            Routines with grey-colored headers are pre-packaged
                            with Champion's Diary. 
                        </Text>
                        <Text />
                        <Text>You can try these routines if you like them using the calendar 
                            on the 'Lifting' main menu!</Text>
                        <Text />
                    </CardSection>
                </Card>
                <Confirm
                    visible={this.state.showModal}
                    onAccept={this.onAccept.bind(this)}
                    onDecline={this.onDecline.bind(this)}
                >
                    Are you sure you want to delete this workout?
                </Confirm>
            </ScrollView>
        );
    }   
}

const mapStateToProps = state => {
    const { allRoutines, loading, selectedPanelId, currentWorkouts } = state.workouts;
    return { routines: allRoutines, 
             loading,
             user: state.auth.user,
             expandedPanelId: selectedPanelId,
             currentWorkouts
           };
};

export default connect(mapStateToProps, { routinesFetch, 
    routineDelete, 
    workoutsFetch })(WorkoutList);
