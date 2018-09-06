import React, { Component } from 'react';
import { Text, Dimensions } from 'react-native';
import { Card } from '../common';

class RunningTracker extends Component {
    render() {
        const height = Dimensions.get('window').height;

        return (
            <Card 
            style={{ justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                height: height - 135 }}
            >
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                    Coming Soon!
                </Text>
            </Card>
        );
    }
}

export default RunningTracker;

