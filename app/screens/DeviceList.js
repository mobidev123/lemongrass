import React from 'react';
import {StyleSheet, View, ScrollView, Dimensions, Alert} from 'react-native';
import {Button, Block, Icon, Text} from 'galio-framework';
import theme from '../constants/theme';
import Title from '../components/Title';
import {Input} from '@ui-kitten/components';
import axios from 'axios';
import {connect} from 'react-redux';
import {fetchDevices} from '../actions/device-actions';

const BASE_SIZE = theme.SIZES.BASE;
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

const ADD_DEVICE_NAME_INPUT_KEY = 'addDeviceNameInput';
const ADD_DEVICE_KILOWATTHOURS_PER_HOUR_INPUT_KEY =
  'addDeviceKiloWattHoursPerHourInput';
const DEVICE_LIST = 'deviceList';

class DeviceList extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      devices: props.devices,
    };
    this.state[ADD_DEVICE_NAME_INPUT_KEY] = null;
    this.state[ADD_DEVICE_KILOWATTHOURS_PER_HOUR_INPUT_KEY] = null;

    var response1 = null;

    // console.log('in constructor');
  }

  updateState(key, value) {
    let newState = {...this.state};
    newState[key] = value;
    this.setState(newState);
  }

  renderCard = (props, index) => {
    // console.log(props);
    return (
      <View
        style={{
          borderColor: 'transparent',
          marginHorizontal: BASE_SIZE,
          marginVertical: BASE_SIZE / 2,
          padding: BASE_SIZE,
          backgroundColor: COLOR_WHITE,
          shadowOpacity: 0.2,
          flexDirection: 'row',
          borderRadius: 3,
          shadowOffset: {width: 0, height: 2},
        }}>
        <Text>{props.title}</Text>
      </View>
    );
  };

  renderCards = () =>
    this.props.devices.data.map((device, index) =>
      this.renderCard(
        {title: device.device_name, subtitle: device.KWH + 'kwh per hour'},
        index,
      ),
    );

  componentDidMount() {
    // console.log('starting fetchDevices prop call in componentDidMount');
    this.props.fetchPoop();
    // console.log('completed fetchDevices prop call in componentDidMount');
  }

  render() {
    return (
      <Block safe flex>
        <Title title="Your Devices" />
        <Block
          row
          center
          card
          shadow
          space="between"
          style={styles.card}
          key={'Add Device'}>
          <Block flex>
            <Text size={BASE_SIZE * 1.125}>{'Add Device'}</Text>
            <Block height={100} width={'100%'} marginTop={10}>
              <Input
                placeholder="enter your device name"
                value={this.state[ADD_DEVICE_NAME_INPUT_KEY]}
                onChangeText={name =>
                  this.updateState(ADD_DEVICE_NAME_INPUT_KEY, name)
                }
              />
              <Input
                placeholder="enter kwh consumed per hour"
                value={this.state[ADD_DEVICE_NAME_INPUT_KEY]}
                onChangeText={name =>
                  this.updateState(ADD_DEVICE_NAME_INPUT_KEY, name)
                }
              />
              <View style={{flexDirection: 'row-reverse'}}>
                <Button styles={{backgroundColor: 'red'}} />
              </View>
            </Block>
          </Block>
        </Block>
        <ScrollView style={{flex: 1}}>
          {/* cards */}
          {this.renderCards()}
        </ScrollView>
      </Block>
    );
  }
}

function mapStateToProps(state) {
  // console.log('mapStateToProps');
  // console.log(state);
  return {
    devices: state.devices,
  };
}

function mapDispatchToProps(dispatch) {
  // console.log('mapDispatchToProps');
  return {
    fetchPoop: () => {
      // console.log('called fetchDevices in mapDispatchToProps');
      dispatch(fetchDevices());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeviceList);

const styles = StyleSheet.create({
  card: {
    borderColor: 'transparent',
    marginHorizontal: BASE_SIZE,
    marginVertical: BASE_SIZE / 2,
    padding: BASE_SIZE,
    backgroundColor: COLOR_WHITE,
    shadowOpacity: 0.4,
  },
  menu: {
    width: BASE_SIZE * 2,
    borderColor: 'transparent',
  },
  settings: {
    width: BASE_SIZE * 2,
    borderColor: 'transparent',
  },
  left: {
    marginRight: BASE_SIZE,
  },
  right: {
    width: BASE_SIZE * 2,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  fab: {
    backgroundColor: theme.COLORS.PRIMARY,
    margin: 10,
    right: 5,
  },
});
