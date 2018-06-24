import React from 'react';
import { View, Text } from 'react-native';
import { Button } from './common';

const ModeSelect = () => {
    const { menuButton, firstButton, introText } = styles;

    return (
        <View style={{ flex: 1 }}>
            <Text style={introText}>
                Track your progress in weight lifting and cardio.
            </Text>

            <Button styling={[menuButton, firstButton]}>
                Facebook Login
            </Button>
            <Button styling={menuButton}> 
                Login with a Champ Account
            </Button>
            <Button styling={menuButton}>
                Create a Champ Account
            </Button>
            <Button styling={menuButton}>
                Welcome Tutorial
            </Button>
        </View>
    );
};

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

export default ModeSelect;
