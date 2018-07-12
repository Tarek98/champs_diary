import React from 'react';
import { Text, View } from 'react-native';

const Header = (props) => {
    const { textStyle, viewStyle } = styles;

    return (
        <View style={viewStyle}>  
            <Text style={textStyle}>{props.textContent}</Text>
        </View> 
    );  
};

const styles = {
    viewStyle: {
        backgroundColor: '#4B0082',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        paddingTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 2,
        position: 'relative'
    },
    textStyle: {
        color: '#C0C0C0',
        fontSize: 20
    }
};

// Make component usable by all other files in project
export { Header };
