import React, { Component } from 'react';
import { ListView, Text, TouchableWithoutFeedback, View, NetInfo } from 'react-native';
import { connect } from 'react-redux';
import { CardSection } from '../common';
import {
    routinesFetch,
    connectionChange
} from '../../actions';

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
        return (
            <TouchableWithoutFeedback>
                <View>
                    <CardSection>
                        <Text>{routine.routine_name}</Text>
                    </CardSection>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        return (
            <ListView
                enableEmptySections
                dataSource={this.dataSource}
                renderRow={this.renderRow}
            />
        );
    }   
}

const mapStateToProps = state => {
    // workout routines JSON object
    return { routines: state.routines.public, isConnected: state.isConnected };
};

export default connect(mapStateToProps, { routinesFetch, connectionChange })(WorkoutList);

