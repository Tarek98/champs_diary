import React, { Component } from 'react';
import { ScrollView, Text, Image, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import { Button, Card, CardSection, Spinner } from './common';
import { loginFBUser } from '../actions';

class ModeSelect extends Component {
    componentWillMount() {
        // If a user is logged in when app starts, navigate them to the main app flow (skip )
        if (this.props.user) {
            Actions.main();
        }
    }

    // The following function opens the FB login dialogue
    // + Handles login/signup of associated firebase account, through dispatching auth Redux action
    facebookLogin = async () => {
        try {
        const result = await LoginManager.logInWithReadPermissions(['email']);
    
        if (result.isCancelled) {
            console.log('User cancelled request');
        }
        
        if (result.grantedPermissions === null) {
            console.log('Request did not go through...');
        } else {
            console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
            // get the access token
            const data = await AccessToken.getCurrentAccessToken();
        
            if (!data) {
                console.log('Something went wrong obtaining the users access token'); 
            }
        
            // create a new firebase credential with the token
            const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
        
            // login with credential
            firebase.auth().signInAndRetrieveDataWithCredential(credential)
            .then((currentUser) => {
                const userData = currentUser.user.toJSON();
                this.props.loginFBUser(userData);
            })
            .catch(error => console.log(error));
        }
        } catch (e) {
            console.error(e);
        }
    };

    render() {
        const { height, width } = Dimensions.get('window');
        const { menuButton, firstButton, introText } = styles;

        return (
            <ScrollView style={{ flex: 1 }}>
                <Card style={{ borderColor: 'steelblue' }}>
                    <CardSection 
                        style={{ 
                        justifyContent: 'center',
                        alignItems: 'center', 
                        backgroundColor: 'grey' }}
                    >
                        <Text style={introText}>
                            Track your sports and body weight progress
                        </Text>
                    </CardSection>
                </Card>
                <Card 
                    style={{ 
                    justifyContent: 'center',
                     alignItems: 'center', 
                     backgroundColor: 'white' 
                    }}
                >
                    <Image
                        source={require('../media/icons/GoldMedal.jpg')}
                        style={{ width: width - 10, height: height - 285 }}
                    />
                </Card>
                <Card>
                    <CardSection style={styles.transparentSubHeader}>
                        <Button 
                            styling={[menuButton, firstButton]}
                            onPress={() => Actions.defaultLogin()}
                            disabled={this.props.loading}
                        > 
                            Login with a Champion Account
                        </Button>
                    </CardSection>
                    {(this.props.loading) ? (
                        <CardSection>
                            <Spinner />
                        </CardSection>
                    ) : 
                        <CardSection style={styles.transparentSubHeader}>
                            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>OR</Text>
                        </CardSection>
                    }
                    <CardSection style={styles.transparentSubHeader}>
                        <Button 
                            styling={menuButton} 
                            onPress={() => this.facebookLogin()}
                            disabled={this.props.loading}
                        >
                            Login with Facebook
                        </Button>
                    </CardSection>
                </Card>
            </ScrollView>
        );
    }
}

const styles = {
    introText: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white'
    },
    transparentSubHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.0)'
    }
};

const mapStateToProps = ({ auth }) => {
    const { user, loading } = auth;
    return { user, loading };
};

export default connect(mapStateToProps, { loginFBUser })(ModeSelect);
