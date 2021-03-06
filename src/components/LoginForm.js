import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { emailChanged, passwordChanged, loginUser } from '../actions';
import { Card, CardSection, Input, Button, Spinner } from './common';

class LoginForm extends Component {
    onEmailChange(text) {
        this.props.emailChanged(text);
    }

    onPasswordChange(text) {
        this.props.passwordChanged(text);
    }

    onButtonPress() {
        const { email, password } = this.props;
        // Trim trailing and leading spaces from email before login
        this.props.loginUser({ email: String(email).trim(), password });
    }

    renderError() {
        if (this.props.error) {
            return (
                <View style={{ backgroundColor: 'white' }}>
                    <Text style={styles.errorTextStyle}>
                        {this.props.error}
                    </Text>
                </View>
            );
        }
    }

    renderButton() {
        if (this.props.loading) {
            return <Spinner size="large" />;
        }

        return (
        <Button onPress={this.onButtonPress.bind(this)}>
            Login
        </Button>
        );
    }

    render() {
        return (
            <Card>
                <CardSection>
                    <Input 
                        label="Email"
                        placeholder="email@gmail.com"
                        onChangeText={this.onEmailChange.bind(this)}
                        value={this.props.email}
                    />
                </CardSection>

                <CardSection>
                    <Input 
                        secureTextEntry
                        label="Password"
                        placeholder="password"
                        onChangeText={this.onPasswordChange.bind(this)}
                        value={this.props.password}
                    />
                </CardSection>

                {this.renderError()}

                <CardSection>
                    {this.renderButton()}
                </CardSection>

                 
                <CardSection>
                    <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
                    ** If you aren't yet registered, an account will be created for you upon login. **
                    </Text>
                </CardSection>
            </Card>
        );
    }
}

const styles = {
    errorTextStyle: {
        fontSize: 15,
        alignSelf: 'center',
        color: 'red'
    }
};

const mapStateToProps = ({ auth, connection }) => {
    const { email, password, error, loading, user } = auth;
    const { isConnected } = connection;

    return { email, password, error, loading, user, isConnected };
};

export default connect(mapStateToProps, 
    { emailChanged, passwordChanged, loginUser })(LoginForm);
