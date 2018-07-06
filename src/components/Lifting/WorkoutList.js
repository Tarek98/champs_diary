import React, { Component } from 'react';
import { ListView, Text, View, NetInfo, Linking } from 'react-native';
import { connect } from 'react-redux';
import { CardSection, Card } from '../common';
import {
    routinesFetch,
    connectionChange
} from '../../actions';

const Accordion = require('react-native-accordion');

const Difficulty = ['Best program for beginners', 'Fun program for beginners',
                     'Best program for intermediates', 'Good program for advanced-intermediates'];

class WorkoutList extends Component {
    componentWillMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

        if (this.props.isConnected) {
            this.props.routinesFetch();
        }
        this.createDataSource(this.props);
    }

    componentWillReceiveProps(nextProps) {
        // nextProps: next set of props that component is about to recieve
        // this.props is the old set of props
        
        this.createDataSource(nextProps);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    // Dispatches action with isConnected bool to keep track of user connectivity in redux store
    handleConnectionChange = (isConnected) => {
        this.props.connectionChange({ isConnected });
    };

    createDataSource({ routines }) {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.dataSource = ds.cloneWithRows(routines);
    }

    renderRow(routine) {
        const programURL = routine.program_guide;

        const header = (
            <View>
                <CardSection style={{ backgroundColor: 'grey', height: 40 }}>
                    <Text style={{ color: 'white', fontSize: 15 }}>{routine.routine_name}</Text>
                </CardSection>
            </View>
        );

        const content = (
            <View>
                <CardSection style={{ flexDirection: 'column', marginLeft: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}>
                        Program Guide
                    </Text>
                    <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(programURL)}>
                        {routine.program_guide || 'Not Available'}
                    </Text>
                    <Text />
                    <Text style={{ fontWeight: 'bold' }}>
                        Description
                    </Text>
                    <Text>
                        {Difficulty[routine.level]}
                    </Text>
                </CardSection>
            </View>
        );

        return (
            <Accordion
                header={header}
                content={content}
                easing="easeOutCubic"
                style={{ marginLeft: 5, marginRight: 5 }}
                expanded={routine.level === 0}
            />
        );
    }

    render() {
        return (
            <View>
                <Card>
                    <CardSection>
                        <Text>
                            Tap on the routines below to toggle their details
                        </Text>
                    </CardSection>
                </Card>
                <ListView
                    enableEmptySections
                    dataSource={this.dataSource}
                    renderRow={this.renderRow.bind(this)}
                />
            </View>
        );
    }   
}

const mapStateToProps = state => {
    // workout routines JSON object
    return { routines: state.routines.public, isConnected: state.connection.isConnected };
};

export default connect(mapStateToProps, { routinesFetch, connectionChange })(WorkoutList);

