import React, { Component } from 'react';
import { Input, CardSection, Card } from '../common';

class WorkoutSelect extends Component {
    state = { language: 'English' };

    render() {
        return (
            <Card>
                <CardSection>
                    <Input
                        label='Date'
                        placeholder='DD/MM/YYYY'
                        value={this.props.workoutDate}
                        editable={false}
                    />
                </CardSection>
            </Card>
        );
    }
};

export default WorkoutSelect;
