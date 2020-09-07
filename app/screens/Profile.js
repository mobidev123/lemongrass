import React, { Component } from 'react';
import { StyleSheet, View, Image, Alert, ScrollView } from 'react-native';
import { Button, Text, Input, Block } from 'galio-framework';
import { connect } from 'react-redux';
import { signOut } from '../actions/auth-actions';
import theme from '../constants/theme';
import Title from '../components/Title';
import { postPGECredentials } from '../actions/profile-actions';
import { generateMockConsumptionData } from '../constants/MockData'
import { DURATIONS, BAR_GRAPH_COLORS } from '../constants/theme'
import moment from 'moment';


const ADD_DEVICE_NAME_INPUT_KEY = 'addDeviceNameInput';
const ADD_DEVICE_KILOWATTHOURS_PER_HOUR_INPUT_KEY =
  'addDeviceKiloWattHoursPerHourInput';

const PGE_USERNAME = 'pge_username';

const PGE_PASSWORD = 'pge_password';

class Profile extends Component {
  constructor(props) {
    super(props);
    // console.log('Profile component constructor');
    // console.log(props.pge);
    this.state = {};
    this.state[PGE_USERNAME] = props.pge.username;
    this.state[PGE_PASSWORD] = props.pge.password;

    if (this.state['PGE_USERNAME'] == undefined) {
      this.setState({ 'PGE_USERNAME': '' });
    }
    if (this.state['PGE_PASSWORD'] == undefined) {
      this.setState({ 'PGE_PASSWORD': '' });
    }
    // console.log(this.state[PGE_USERNAME]);
    // console.log(this.state[PGE_PASSWORD]);

  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.user != null;
  }

  updateState(key, value) {
    let newState = { ...this.state };
    newState[key] = value;
    this.setState(newState);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log('In Profile.componentDidUpdate');
    // console.log(prevProps);
    // console.log(this.props);
    if (this.props.pge != prevProps.pge) {
      this.setState({
        ...this.state,
        pge_username: this.props.pge.username,
        pge_password: this.props.pge.password,
      });
    }
  }

  render() {
    // console.log("Profile components render")


    startMoment = moment()
      .year(2020)
      .month(0)
      .date(1);
    endMoment = moment()
      .year(2020)
      .month(0)
      .date(2);
    duration = DURATIONS.DURATION_1_HOUR;
    max = 1000
    //deviceIds = [1, 2, 3]
    // console.log("Generating mock consumption data")
    //consumptionData = generateMockConsumptionData(deviceIds, startMoment,endMoment,duration,max)
    // console.log(JSON.stringify(consumptionData, null, 2))
    // console.log(JSON.stringify(BAR_GRAPH_COLORS.sort(() => Math.random() - 0.5), null, 2))


    return (
      <Block flex>
        <Title title="Profile" />
        <ScrollView>
          <Block flex center>
            <Image
              source={{
                uri: this.props.user.photo,
              }}
              style={{ width: 200, height: 200, borderRadius: 200 / 2 }}
            />
            <Button
              disabled
              color={theme.COLORS.TRANSPARENT}
              style={styles.profileInfoFields}>
              <Text color={theme.COLORS.MUTED}>
                {this.props.user.first_name + ' ' + this.props.user.last_name}
              </Text>
            </Button>
            <Button
              disabled
              color={theme.COLORS.TRANSPARENT}
              style={styles.profileInfoFields}>
              <Text color={theme.COLORS.MUTED}>{this.props.user.email}</Text>
            </Button>
            <Block flex />
            <Text>PGE Credentials</Text>
            <Input
              placeholder="username"
              value={this.state[PGE_USERNAME]}
              onChangeText={value => {
                // console.log('username on change');
                // console.log(value);
                this.updateState(PGE_USERNAME, value);
              }}
              style={styles.pgeInfoFields}
            />
            <Input
              placeholder="password"
              value={this.state[PGE_PASSWORD]}
              password
              viewPass
              onChangeText={value => {
                // console.log('password on change');
                // console.log(value);
                this.updateState(PGE_PASSWORD, value);
              }}
              style={styles.pgeInfoFields}
            />
            <Button
              color="#3F88C0"
              shadowColor="#3F88C0"
              round
              style={styles.buttons}
              onPress={() => {
                // console.log(this.state);
                this.props.postPGECredentials({
                  username: this.state[PGE_USERNAME],
                  password: this.state[PGE_PASSWORD],
                  provider: 'PGE',
                });
                Alert.alert('Updated PGE Credentials.');
              }}>
              Update PGE Credentials
          </Button>
            <Button
              color={theme.COLORS.PRIMARY}
              shadowColor={theme.COLORS.PRIMARY}
              round
              style={styles.buttons}
              onPress={() => this.props.signOut()}>
              Sign Out
          </Button>
          </Block>
        </ScrollView>
        <Block flex center middle style={{ height: 10 }} />
      </Block>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    pge: state.pge,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    signOut: () => dispatch(signOut()),
    postPGECredentials: credentials => {
      // console.log('postPGECredentials in postPGECredentials');
      dispatch(postPGECredentials(credentials));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);

const styles = StyleSheet.create({
  profileInfoFields: {
    borderColor: theme.COLORS.MUTED,
    marginVertical: 10,
    borderRadius: 8,
    alignItems: 'flex-start',
    paddingLeft: 15,
  },
  pgeInfoFields: {
    width: '90%',
  },
  buttons: {
    margin: 10,
  },
});
