import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Button } from './common';

class ModeSelect extends Component {
    componentWillMount() {
        // If a user is logged in when app starts, navigate them to the main app flow (skip )
        if (this.props.user) {
            Actions.tabBar();
        }
    }

    render() {
        const { menuButton, firstButton, introText } = styles;

        return (
            <View style={{ flex: 1 }}>
                <Text style={introText}>
                    Track your progress in weight lifting and cardio.
                </Text>
    
                <Button styling={[menuButton, firstButton]} onPress={() => Actions.defaultLogin()}> 
                    Login with a Champ Account
                </Button>
                <Button styling={menuButton}>
                    Facebook Login
                </Button>
                <Button styling={menuButton}>
                    Welcome Tutorial
                </Button>
            </View>
        );
    }
}

const styles = {
    introText: {
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    firstButton: {
        marginTop: 25
    },
    menuButton: {
        height: 45,
        flex: 0,
        borderRadius: 10,
        marginBottom: 10
    }
};

const mapStateToProps = ({ auth }) => {
    return { user: auth.user };
};

export default connect(mapStateToProps)(ModeSelect);
