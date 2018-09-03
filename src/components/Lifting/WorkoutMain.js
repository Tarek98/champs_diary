import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Calendar from 'react-native-calendar-datepicker';
import Moment from 'moment';
import { Card, CardSection, Button } from '../common';

class WorkoutMain extends Component {
    constructor(props) {
        super(props);
        this.state = { date: Moment().toDate() };
    }

    renderSuccessOrError() {
        if (this.props.successMsg) {
            return (
                <CardSection style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'green', textAlign: 'center' }}>
                        {this.props.successMsg}
                    </Text>
                </CardSection>
            );
        } else if (this.props.errorMsg) {
            return (
                <CardSection style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'red', textAlign: 'center' }}>
                        {this.props.errorMsg}
                    </Text>
                </CardSection>
            );
        }
    }

    render() {
        return (
            <View>
                <Card>
                    <CardSection>
                        <Button 
                            onPress={() => Actions.workoutEdit({ 
                                sectionTitle: 'New Workout Routine',
                                routineToEdit: false 
                            })}
                        >
                            Create a Workout
                        </Button>
                    </CardSection>
                    <CardSection>
                        <Button onPress={() => Actions.workoutList()}>
                            View Existing Workouts
                        </Button>
                    </CardSection>
                </Card>
                <Card>
                    <CardSection style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                            To track your workout or view a previous workout, tap on a date below
                        </Text>
                    </CardSection>
                    <CardSection>
                        <Calendar
                            onChange={(date) => {
                                this.setState({ date });
                                Actions.workoutSelect({
                                     workoutDate: Moment(date._d).format('DD/MM/YYYY') 
                                });
                            }}
                            selected={this.state.date}
                            minDate={Moment().subtract(50, 'years').startOf('day')}
                            maxDate={Moment().add(1, 'month').startOf('day')}
                            style={styles.calendarStyle}
                            barView={{ backgroundColor: '#00A86B' }}
                        />
                    </CardSection>
                    {this.renderSuccessOrError()}
                </Card>
            </View>
        );
    }
}

const styles = {
    calendarStyle: {
        flex: 1,
        marginLeft: 15,
        marginRight: 15
    }
};

export default WorkoutMain;
