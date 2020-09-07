import React from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {signUp, googleSignIn, facebookSignIn} from '../actions/auth-actions';
import {Block, Button, Input, Text, Icon} from 'galio-framework';
import theme from '../constants/theme';
import Title from '../components/Title';

const {width} = Dimensions.get('window');

const SOCIAL_ICON_SIZE = theme.SIZES.BASE * 1.5;
const SOCIAL_BTN_SIZE = theme.SIZES.BASE * 3;

class Login extends React.Component {
  state = {
    user: {},
  };

  handleChange = (key, value) => {
    var user = {...this.state.user};
    user[key] = value;
    this.setState({user});
  };

  render() {
    return (
      <Block safe flex style={styles.container}>
        <ScrollView style={styles.flex} keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={5}>
            <Title title="Login" />
            <Block flex middle>
              <Form handleChange={this.handleChange} />
              <Block flex center style={{marginBottom: 20}}>
                <Button
                  style={styles.button}
                  round
                  color={theme.COLORS.PRIMARY}
                  shadowColor={theme.COLORS.PRIMARY}
                  onPress={() => this.props.signUp(this.state.user)}>
                  Sign up
                </Button>
                <Button
                  round
                  color={theme.COLORS.TRANSPARENT}
                  shadowColor={theme.COLORS.MUTED}
                  style={[styles.button, {borderColor: theme.COLORS.MUTED}]}
                  onPress={() => this.props.googleSignIn()}>
                  <Icon
                    size={SOCIAL_ICON_SIZE}
                    name="google"
                    family="font-awesome"
                    color={theme.COLORS.MUTED}
                  />
                </Button>
                <Button
                  round
                  color={theme.COLORS.FACEBOOK}
                  shadowColor={theme.COLORS.FACEBOOK}
                  style={styles.button}
                  onPress={() => this.props.facebookSignIn()}>
                    <Icon
                    size={SOCIAL_ICON_SIZE}
                    name="facebook"
                    family="font-awesome"
                    color={theme.COLORS.WHITE}
                  />
                </Button>
              </Block>
            </Block>
          </KeyboardAvoidingView>
        </ScrollView>
      </Block>
    );
  }
}

const Form = ({handleChange}) => (
  <Block style={{marginBottom: 20}}>
    <Input
      borderless
      placeholder="Name"
      icon="user"
      family="antdesign"
      style={styles.input}
      onChangeText={text => handleChange('givenName', text)}
    />
    <Input
      borderless
      placeholder="Last name"
      icon="user"
      family="antdesign"
      style={styles.input}
      onChangeText={text => handleChange('familyName', text)}
    >
    </Input>
    <Input
      borderless
      type="email-address"
      placeholder="Email"
      icon="mail"
      family="antdesign"
      autoCapitalize="none"
      style={styles.input}
      onChangeText={text => handleChange('email', text)}
    />
    <Input
      borderless
      password
      viewPass
      placeholder="Password"
      icon="lock"
      family="antdesign"
      style={styles.input}
      onChangeText={text => handleChange('password', text)}
    />
  </Block>
);

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    googleSignIn: () => dispatch(googleSignIn()),
    facebookSignIn: () => dispatch(facebookSignIn()),
    signUp: user => dispatch(signUp(user)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.WHITE,
    paddingTop: 15,
  },
  flex: {
    flex: 1,
  },
  social: {
    width: SOCIAL_BTN_SIZE,
    height: SOCIAL_BTN_SIZE,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
  },
  socialContainer: {
    marginVertical: theme.SIZES.BASE * 1.875,
  },
  input: {
    alignSelf: 'center',
    width: width * 0.89,
    borderBottomColor: theme.COLORS.BLACK,
    borderWidth: theme.SIZES.BASE * 0.04,
    borderRadius: 0,
    paddingHorizontal: 0,
  },
  button: {
    marginVertical: 10,
    width: width * 0.89,
  },
});
