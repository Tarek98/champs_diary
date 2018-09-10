import React from 'react';
import { TextInput, View, Text } from 'react-native';

const Input = ({ label, value, onChangeText, onFocus, placeholder, labelStyle, hideLabel,
    secureTextEntry, editable, inputTextStyle, inputType, maxLength }) => {
    const { inputStyle, label1, containerStyle } = styles;

    return (
        <View style={containerStyle}>
            { hideLabel !== true && <Text style={[label1, labelStyle]}>{label}</Text> }
            <TextInput 
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                autoCorrect={false}
                style={[inputStyle, inputTextStyle]}
                underlineColorAndroid="transparent"
                value={value}
                onChangeText={onChangeText}
                onFocus={onFocus}
                editable={editable}
                keyboardType={inputType}
                maxLength={maxLength}
                returnKeyType='done'
            />
        </View>
    );
};

const styles = {
    inputStyle: {
        height: 20,
        width: 100,
        color: '#000',
        paddingRight: 5,
        paddingLeft: 5,
        paddingVertical: 0,
        fontSize: 18,
        lineHeight: 23,
        flex: 2
    },
    label1: {
        fontSize: 18,
        paddingLeft: 20,
        flex: 1
    },
    containerStyle: {
        height: 40,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
};

export { Input };
