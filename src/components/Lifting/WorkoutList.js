import React, { Component } from 'react';
import { Text, View, Linking, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { CardSection, Card, ListItem, Spinner, Button, Confirm } from '../common';
import { routinesFetch, routineDelete } from '../../actions';

const Difficulty = ['Great routine for beginners with fast progression',
                    'Fun workout routine for beginners',
                    'Awesome routine for intermediates'];

class WorkoutList extends Component {
    state = { showModal: false };

    componentWillMount() {
        this.props.routinesFetch(this.props.user.uid);
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
                            Actions.workoutEdit({
                                routineToEdit: workout,
                                sectionTitle: 'Edit Workout Routine' 
                            });
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
        return null;
    }

    renderRow(workout) {
        return (
            <ListItem 
                panelId={workout.id} 
                cardTitle={workout.routine_name}
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
        if (this.props.loading) {
            return (
                <CardSection>
                    <Spinner size='large' />
                </CardSection>
            );
        }
        return (
            <FlatList
                data={this.props.routines}
                renderItem={({ item }) => this.renderRow(item)}
            />
        );
    }

    render() {
        return (
            <View>
                <Card>
                    <CardSection style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                            Tap on the routines below to view their details
                        </Text>
                    </CardSection>
                </Card>
                {this.renderListView()}
                <Confirm
                    visible={this.state.showModal}
                    onAccept={this.onAccept.bind(this)}
                    onDecline={this.onDecline.bind(this)}
                >
                    Are you sure you want to delete this workout?
                </Confirm>
            </View>
        );
    }   
}

const mapStateToProps = state => {
    return { routines: state.workouts.allRoutines, 
             loading: state.workouts.loading,
             user: state.auth.user,
             expandedPanelId: state.workouts.selectedPanelId };
};

export default connect(mapStateToProps, { routinesFetch, 
    routineDelete })(WorkoutList);
