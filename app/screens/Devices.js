import React from 'react';
import { StyleSheet, View, ScrollView, Dimensions, Alert, addons } from 'react-native';
import { Defs, LinearGradient, Stop, parse } from 'react-native-svg';
import { AreaChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { FAB } from 'react-native-paper';
import { Button, Block, Icon, Text } from 'galio-framework';
import theme from '../constants/theme';
import Title from '../components/Title';
import * as mock from '../constants/MockData';
import { Input } from '@ui-kitten/components';
import axios from 'axios';
import { connect } from 'react-redux';
import { fetchDevices, addDevice, updateDevice } from '../actions/device-actions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { prettyPrint } from '../util/GeneralUtil';
let isDeviceUpdateOrAdd = true

const BASE_SIZE = theme.SIZES.BASE;
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

// mock data
const cards = [
  {
    title: 'Dryer',
    subtitle: '15 kWh',
  },
  {
    title: 'Lights',
    subtitle: '5 kWh',
  },
  {
    title: 'Television',
    subtitle: '10 kWh',
  },
];
const statsTitles = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

const ADD_DEVICE_NAME_INPUT_KEY = 'addDeviceNameInput';
const ADD_DEVICE_KILOWATTHOURS_PER_HOUR_INPUT_KEY =
  'addDeviceKiloWattHoursPerHourInput';
const DEVICE_LIST = 'deviceList';

class Devices extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      devices: props.devices,
      isUpdateDevice: false,
      device_id: 0,
    };
    this.state[ADD_DEVICE_NAME_INPUT_KEY] = '';
    this.state[ADD_DEVICE_KILOWATTHOURS_PER_HOUR_INPUT_KEY] = '';

    var response1 = null;

    // console.log('in constructor');
  }

  convertToAlphaNumericString(string) {
    // console.log(string);
    string = string.replace(/\W/g, '');
    return string;
  }

  convertToInt(string) {
    // console.log(string);
    string = string.replace(/[^0-9\.]+/g, '');
    return string;
  }

  updateState(key, value) {
    let newState = { ...this.state };
    newState[key] = value;
    this.setState(newState);
  }

  onEditDevice(device) {
    isDeviceUpdateOrAdd = false

    if (device.device_id > 0) {
      this.setState({ isUpdateDevice: true });
      this.setState({ device_id: device.device_id });
    }
    this.setState({ addDeviceNameInput: device.title });
    this.setState({ addDeviceKiloWattHoursPerHourInput: device.subtitle });

    //this.updateState(ADD_DEVICE_NAME_INPUT_KEY, device.title);
    //this.updateState(ADD_DEVICE_KILOWATTHOURS_PER_HOUR_INPUT_KEY, device.subtitle);
    this.props.navigation.navigate('DeviceListDetails', { device: device })
  }
  renderCard = (props, index) => {
    return (
      <TouchableOpacity onPress={() => this.onEditDevice(props)}>
        <Block
          row
          center
          card
          shadow
          space="between"
          style={styles.card}
          key={props.title} >
          <Block flex>
            <Text size={BASE_SIZE * 1.125}>{props.title}</Text>
            <Text size={BASE_SIZE * 0.875} style={{ marginTop: 5 }} muted>
              {props.subtitle}
            </Text>
          </Block>
          <Button
            shadowless
            style={styles.right}
            onPress={() => Alert.alert('WHERE IS THE DATA!')}>
            <Icon
              size={BASE_SIZE * 1.5}
              name="arrow-right"
              family="simple-line-icon"
              color={COLOR_GREY}
            />
          </Button>
        </Block>
      </TouchableOpacity >
    );
  };

  renderCards = () =>
    this.props.devices.data.map((device, index) =>
      this.renderCard(
        { device_id: device.id, title: device.device_name, subtitle: device.KWH + 'kwh per hour' },
        index,
      ),
    );

  componentDidMount() {
    // console.log('starting fetchDevices prop call in componentDidMount');
    this.props.fetchPoop();
    // console.log('completed fetchDevices prop call in componentDidMount');
  }

  clearInputs() {
    this.setState({ addDeviceNameInput: '' });
    this.setState({ addDeviceKiloWattHoursPerHourInput: null });
    this.setState({ isUpdateDevice: false });
  }

  render() {
    if (this.state[ADD_DEVICE_NAME_INPUT_KEY] == '' && this.state[ADD_DEVICE_KILOWATTHOURS_PER_HOUR_INPUT_KEY] == ''
    ) {
      isDeviceUpdateOrAdd = true
    }
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
            <Block height={150} width={'100%'} marginTop={10}>
              <Input
                placeholder="enter your device name"
                value={this.state[ADD_DEVICE_NAME_INPUT_KEY]}
                onChangeText={name =>
                  this.updateState(ADD_DEVICE_NAME_INPUT_KEY, name)
                }
              />
              <Input
                placeholder="enter kwh consumed per hour" keyboardType="numeric"
                value={this.state[ADD_DEVICE_KILOWATTHOURS_PER_HOUR_INPUT_KEY]}
                onChangeText={name =>
                  this.updateState(
                    ADD_DEVICE_KILOWATTHOURS_PER_HOUR_INPUT_KEY,
                    this.convertToInt(name),
                  )
                }
              />
              <Block style={{ flexDirection: 'row-reverse' }}>
                <Button
                  style={{
                    height: 50,
                    width: 100,
                    backgroundColor: 'green',
                    shadowRadius: 2,
                  }}
                  onPress={() => {
                    if (this.state[ADD_DEVICE_NAME_INPUT_KEY] == '') {
                      Alert.alert('Please add a device name');
                    } else if (
                      this.state[ADD_DEVICE_KILOWATTHOURS_PER_HOUR_INPUT_KEY] ==
                      ''
                    ) {
                      Alert.alert('Please add device consumption');
                    } else {
                      // if (this.state.device_id <= 0 ) {
                      if (isDeviceUpdateOrAdd) {
                        this.props.addDevice({
                          device_name: this.state[ADD_DEVICE_NAME_INPUT_KEY],
                          KWH: this.state[
                            ADD_DEVICE_KILOWATTHOURS_PER_HOUR_INPUT_KEY
                          ],
                        });
                        Alert.alert(
                          'Added ' +
                          this.state[ADD_DEVICE_NAME_INPUT_KEY] +
                          ' to devices',
                        );
                      }
                      else {
                        let updateKWH = this.state[
                          ADD_DEVICE_KILOWATTHOURS_PER_HOUR_INPUT_KEY
                        ]

                        this.props.updateDevice({
                          device_id: this.state.device_id,
                          device_name: this.state[ADD_DEVICE_NAME_INPUT_KEY],
                          KWH: updateKWH.replace('kwh per hour', ''),
                        });
                        isDeviceUpdateOrAdd = true
                        Alert.alert(
                          'Added ' +
                          this.state[ADD_DEVICE_NAME_INPUT_KEY] +
                          ' to devices',
                        );
                      }
                      this.state.isUpdateDevice = false;
                      this.clearInputs();
                    }
                  }}>
                  <Text size={BASE_SIZE * 1}>{isDeviceUpdateOrAdd == true ? 'Add' : 'Update'}</Text>
                </Button>
              </Block>
            </Block>
          </Block>
        </Block>
        <ScrollView style={{ flex: 1 }}>
          {/* cards */}
          {this.renderCards()}
        </ScrollView>
      </Block >
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
    addDevice: device => {
      // console.log('called addDevice in mapDispatchToProps');
      dispatch(addDevice(device));
    },
    updateDevice: device => {
      dispatch(updateDevice(device));

    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Devices);

const styles = StyleSheet.create({
  card: {
    borderColor: 'transparent',
    marginHorizontal: BASE_SIZE,
    marginVertical: BASE_SIZE / 2,
    padding: BASE_SIZE,
    backgroundColor: COLOR_WHITE,
    shadowOpacity: 0.4,
  },
  card2: {
    borderColor: 'transparent',
    marginHorizontal: BASE_SIZE,
    marginVertical: BASE_SIZE / 2,
    padding: BASE_SIZE,
    backgroundColor: COLOR_GREY,
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
