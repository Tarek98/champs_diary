import React from 'react';
import { Text } from 'react-native';

const TabIcon = ({ focused, title }) => {
    return (
        <Text style={{ color: focused ? 'red' : 'white' }}>
            {title}
        </Text>
    );
};

export default TabIcon;
