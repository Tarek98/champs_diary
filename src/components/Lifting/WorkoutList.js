import React, { Component } from 'react';
import { ListView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { CardSection, Card, ListItem, Spinner } from '../common';
import {
    routinesFetch
} from '../../actions';

class WorkoutList extends Component {
    componentWillMount() {
        this.props.routinesFetch();
        
        // Wait for routines fetch (async action) to finish and then create data source
        if (!this.props.loading) {
            this.createDataSource(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        // nextProps: next set of props that component is about to recieve
        // this.props is the old set of props
        
        this.createDataSource(nextProps);
    }

    createDataSource({ routines }) {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.dataSource = ds.cloneWithRows(routines);
    }

    renderRow(routine) {
        return <ListItem workout={routine} />;
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
            <ListView
                enableEmptySections
                dataSource={this.dataSource}
                renderRow={this.renderRow.bind(this)}
            />
        );
    }

    render() {
        return (
            <View>
                <Card>
                    <CardSection>
                        <Text>
                            Tap on the routines below to view their details
                        </Text>
                    </CardSection>
                </Card>
                {this.renderListView()}
            </View>
        );
    }   
}

const mapStateToProps = state => {
    return { routines: state.workouts.public, 
             loading: state.workouts.loading };
};

export default connect(mapStateToProps, { routinesFetch })(WorkoutList);

