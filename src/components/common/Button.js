import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = ({ onPress, children, styling, disabled }) => {
    const { buttonStyle, textStyle } = styles;

    return (
        <TouchableOpacity onPress={onPress} style={[buttonStyle, styling]} disabled={disabled}>
            <Text style={textStyle}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
      flex: 1,
      alignSelf: 'stretch',
      backgroundColor: 'steelblue',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'white',
      marginLeft: 5,
      marginRight: 5
  }  
};

export { Button };
