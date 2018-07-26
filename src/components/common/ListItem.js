import React, { Component } from 'react';
import { 
    Text, TouchableWithoutFeedback, Platform,
    View, LayoutAnimation, Linking, UIManager
} from 'react-native';
import { connect } from 'react-redux';
import { CardSection } from './CardSection';
import { viewRoutineDetails } from '../../actions';

const Difficulty = ['Best program for beginners', 'Fun program for beginners',
                     'Best program for intermediates', 'Good program for advanced-intermediates'];

class ListItem extends Component {
    constructor() {
        super();

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    componentWillUpdate() {
        LayoutAnimation.spring();
    }

    renderDescription() {
        const { workout, expanded } = this.props;

        if (expanded) {
            return (
                <View>
                    <CardSection style={{ flexDirection: 'column', marginLeft: 5 }}>
                        <Text style={{ fontWeight: 'bold' }}>
                            Program Guide
                        </Text>
                        <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(workout.program_guide)}>
                            {workout.program_guide || 'Not Available'}
                        </Text>
                        <Text />
                        <Text style={{ fontWeight: 'bold' }}>
                            Description
                        </Text>
                        <Text>
                            {Difficulty[workout.level]}
                        </Text>
                    </CardSection>
                </View>
            );
        }
    }

    render() {
        const { titleStyle, titleCardSection } = styles;
        const { routine_name, id } = this.props.workout;

        return (
            <TouchableWithoutFeedback
                onPress={() => this.props.viewRoutineDetails(id)}
            >
                <View>
                    <CardSection style={titleCardSection}>
                        <Text style={titleStyle}>{routine_name}</Text>
                    </CardSection>
                    {this.renderDescription()}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = {
    titleStyle: {
        color: 'white',
        fontSize: 15
    },
    titleCardSection: {
        backgroundColor: 'grey',
        height: 40,
        marginLeft: 5,
        marginRight: 5
    }
};

const mapStateToProps = (state, ownProps) => {
    const expanded = (state.workouts.selectedWorkoutId === ownProps.workout.id);

    return { expanded };
};

const list_item = connect(mapStateToProps, { viewRoutineDetails })(ListItem);

export { list_item as ListItem };
