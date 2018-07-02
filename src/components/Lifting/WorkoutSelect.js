import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Calendar from 'react-native-calendar-datepicker';
import Moment from 'moment';
import { Card, CardSection, Button } from '../common';

class WorkoutSelect extends Component {
    constructor(props) {
        super(props);
        this.state = { date: Moment().toDate() };
    }

    render() {
        return (
            <View>
                <Card>
                    <CardSection>
                        <Button>Create a Workout</Button>
                    </CardSection>
                    <CardSection>
                        <Button onPress={() => Actions.workoutList()}>View Existing Workouts</Button>
                    </CardSection>
                </Card>
                <Card>
                    <CardSection>
                        <Text style={{ fontWeight: 'bold' }}>
                            To track your workout, tap on a date in the calendar
                        </Text>
                    </CardSection>
                    <CardSection>
                        <Calendar
                            onChange={(date) => this.setState({ date })}
                            selected={this.state.date}
                            minDate={Moment().subtract(50, 'years').startOf('day')}
                            maxDate={Moment().add(1, 'month').startOf('day')}
                            style={styles.calendarStyle}
                        />
                    </CardSection>
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

export default WorkoutSelect;
