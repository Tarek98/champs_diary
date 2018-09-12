import React, { Component } from 'react';
import { Text, View, Linking } from 'react-native';
import { connect } from 'react-redux';
import { logoutUser } from '../actions';
import { Card, CardSection, Button, Spinner } from './common';

class SettingsPage extends Component {
    onLogoutPress() {
        this.props.logoutUser();
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

    renderLogoutButton() {
        if (this.props.loading) {
            return <Spinner size="large" />;
        }

        return (
        <Button onPress={this.onLogoutPress.bind(this)} styling={{ backgroundColor: 'red' }}>
            Logout
        </Button>
        );
    }

    render() {
        // If a user is logged in, display custom user settings
        if (this.props.user) {
            // User is signed in with facebook if he has displayName
            const userName = (this.props.user.displayName) ? 
                (`${this.props.user.displayName} (Facebook)`) : (this.props.user.email);

            return (
                <View>
                <Card>
                    <CardSection>
                        <Text>You are logged in as {userName}</Text>
                    </CardSection>
                    {this.renderError()}
                    <CardSection>
                        {this.renderLogoutButton()}
                    </CardSection>
                </Card>
                <Card>
                    <CardSection 
                        style={{ 
                            justifyContent: 'center', alignItems: 'center', flexDirection: 'column' 
                        }}
                    >
                        <Text>
                            The icons used by this app are made by Icons8: 
                        </Text>
                        <Text 
                            style={{ color: 'blue' }} 
                            onPress={() => Linking.openURL('https://icons8.com/')}
                        >
                            https://icons8.com/
                        </Text> 
                    </CardSection>
                </Card>
                </View>
            );
        }
        return null;
    }
}

const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
};

const mapStateToProps = ({ auth }) => {
    const { error, loading, user } = auth;

    return { error, loading, user };
};

export default connect(mapStateToProps, { logoutUser })(SettingsPage);
