import React, { Component } from 'react';
import { Text, View } from 'react-native';
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
            return (
                <Card>
                    <CardSection>
                        <Text>You are logged in as {this.props.user.email}</Text>
                    </CardSection>
                    {this.renderError()}
                    <CardSection>
                        {this.renderLogoutButton()}
                    </CardSection>
                </Card>
            );
        }
        // Else display offline settings
        return (
            <Card>
                <CardSection>
                    <Text>You are not logged in!</Text>
                </CardSection>
                <CardSection>
                    <Button>
                        Back To Main Menu
                    </Button>
                </CardSection>
            </Card>
        );
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
