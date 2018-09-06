import React from 'react';
import { Text, Image, View } from 'react-native';

const TabIcon = ({ focused, title }) => {
    let iconSource = '';
    switch (title) {
        case 'Lifting':
            iconSource = require('../../media/icons/Lift.png');
            break;
        case 'Running':
            iconSource = require('../../media/icons/Sprint.png');
            break;
        case 'Body Weight':
            iconSource = require('../../media/icons/Scale.png');
            break;
        default:
            break;
    }

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
                source={iconSource}
                style={{ width: 22, height: 25 }}
            />
            <Text style={{ color: focused ? 'red' : 'white' }}>
                {title}
            </Text>
        </View>
    );
};

export default TabIcon;
