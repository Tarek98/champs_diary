import React, { Component } from 'react';
import { 
    Text, TouchableWithoutFeedback, Platform,
    View, LayoutAnimation, UIManager
} from 'react-native';
import { connect } from 'react-redux';
import { CardSection } from './CardSection';
import { expandPanel } from '../../actions';

class ListItem extends Component {
    constructor() {
        super();

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental 
                && UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    componentWillUpdate() {
        LayoutAnimation.spring();
    }

    renderDescription() {
        const { expanded, children } = this.props;
        if (expanded) {
            return (
                <View>
                    {children}
                </View>
            );
        }
    }

    render() {
        const { titleStyle, titleCardSection } = styles;
        const { panelId, headerStyle } = this.props;

        return (
            <TouchableWithoutFeedback
                onPress={() => this.props.expandPanel(panelId)}
            >
                <View>
                    <CardSection style={[titleCardSection, headerStyle]}>
                        <Text style={titleStyle}>{this.props.cardTitle}</Text>
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
    const expanded = (state.workouts.selectedPanelId !== 'none' 
        && state.workouts.selectedPanelId === ownProps.panelId);

    return { expanded };
};

const list_item = connect(mapStateToProps, { expandPanel })(ListItem);

export { list_item as ListItem };
