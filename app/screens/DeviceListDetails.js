import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button, Block, Icon, Text, Switch } from 'galio-framework';
import theme from '../constants/theme';
import Title from '../components/Title';
import * as mock from '../constants/MockData';
import { Input } from '@ui-kitten/components';
import axios from 'axios';
import { connect } from 'react-redux';
import { fetchDevices, deviceStatus, deviceUpdateStatus } from '../actions/device-actions';
import { DURATIONS, BAR_GRAPH_COLORS } from '../constants/theme'
import { fetchUsageData } from '../actions/usage-actions';
const { width, height } = Dimensions.get('window');
const BASE_SIZE = theme.SIZES.BASE;
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

const ADD_DEVICE_NAME_INPUT_KEY = 'addDeviceNameInput';
const ADD_DEVICE_KILOWATTHOURS_PER_HOUR_INPUT_KEY =
  'addDeviceKiloWattHoursPerHourInput';
const DEVICE_LIST = 'deviceList';
let deviceData;
class DeviceListDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switch: false,
      defaultDate: new Date().getTime(),
      isLoading: false,
      loaderIndex: 0,
      loading: false,
      times: [
        { time: '12:00 AM' },
        { time: '12:30 AM' },
        { time: '01:00 AM' },
        { time: '01:30 AM' },
        { time: '02:00 AM' },
        { time: '02:30 AM' },
        { time: '03:00 AM' },
        { time: '03:30 AM' },
        { time: '04:00 AM' },
        { time: '04:30 AM' },
        { time: '05:00 AM' },
        { time: '05:30 AM' },
        { time: '06:00 AM' },
        { time: '06:30 AM' },
        { time: '07:00 AM' },
        { time: '07:30 AM' },
        { time: '08:00 AM' },
        { time: '08:30 AM' },
        { time: '09:00 AM' },
        { time: '09:30 AM' },
        { time: '10:00 AM' },
        { time: '10:30 AM' },
        { time: '11:00 AM' },
        { time: '11:30 AM' },
        { time: '12:00 PM' },
        { time: '12:30 PM' },
        { time: '01:00 PM' },
        { time: '01:30 PM' },
        { time: '02:00 PM' },
        { time: '02:30 PM' },
        { time: '03:00 PM' },
        { time: '03:30 PM' },
        { time: '04:00 PM' },
        { time: '04:30 PM' },
        { time: '05:00 PM' },
        { time: '05:30 PM' },
        { time: '06:00 PM' },
        { time: '06:30 PM' },
        { time: '07:00 PM' },
        { time: '07:30 PM' },
        { time: '08:00 PM' },
        { time: '08:30 PM' },
        { time: '09:00 PM' },
        { time: '09:30 PM' },
        { time: '10:00 PM' },
        { time: '10:30 PM' },
        { time: '11:00 PM' },
        { time: '11:30 PM' },
      ]
    };
  }
  componentDidMount() {
    let newState = { ...this.props }
    this.getAllStatus(newState.startDate)
  }
  previousDateSet() {
    let newState = { ...this.props }
    let tempPrevDate = this.props.startDate.clone().startOf('day')

    newState.startDate = this.props.startDate.clone().subtract(1, 'day').startOf('day')
    newState.endDate = tempPrevDate
    let newStartDate = this.props.startDate.clone();
    newStartDate.subtract(1, 'day')
    let newEndDate = newStartDate.clone()
    newState.startDate = newStartDate
    newState.endDate = tempPrevDate
    this.getAllStatus(newState.startDate)
    this.setState({ defaultDate: newState.startDate });
    this.props.fetchUsageData(newState.startDate, newState.endDate, newState.duration)
  }

  renderTitleDateString() {
    if (this.props.duration == DURATIONS.DURATION_15_MINUTES) {
      return this.props.startDate.format("MMMM D")
    } else if (this.props.duration == DURATIONS.DURATION_1_HOUR) {
      return this.props.startDate.format("MMMM D")
    } else if (this.props.duration == DURATIONS.DURATION_1_DAY) {
      return (this.props.startDate.format("MMMM D") + " - " + this.props.endDate.format("MMMM D"))
    }
  }

  nextDateSet() {
    let newState = { ...this.props }
    let tempNextDate = this.props.startDate.clone().add(2, 'day').startOf('day')

    newState.startDate = this.props.startDate.clone().subtract(1, 'day').startOf('day')
    newState.endDate = tempNextDate
    let newStartDate = this.props.startDate.clone();
    newStartDate.add(1, 'day')
    let newEndDate = newStartDate.clone()
    newState.startDate = newStartDate
    newState.endDate = tempNextDate
    this.getAllStatus(newState.startDate)
    this.setState({ defaultDate: newState.startDate });
    this.props.fetchUsageData(newState.startDate, newState.endDate, newState.duration)
  }


  getAllStatus(date) {
    let Device = {
      user_id: this.props.user.id,
      device_id: this.props.route.params.device.device_id,
      // date: date
      date: new Date(date)
    }
    this.props.deviceStatus(Device)
  }

  async _onSwitch(datas, index) {
    console.log('datas', datas);
    let newState = { ...this.props }
    this.setState({ isLoading: true, loaderIndex: index })
    this.setState({ switch: datas.status })
    let sts;
    if (datas.status == true) {
      sts = "OFF"
    }
    if (datas.status == false) {
      sts = "ON"
    }

    let deviceUp = {
      user_id: this.props.user.id,
      device_id: this.props.route.params.device.device_id,
      status: sts,
      start_time: datas.start,
      end_time: datas.end
    }
    this.props.deviceUpdateStatus(deviceUp),
      setTimeout(() => {
        this.getAllStatus(newState.startDate)
      }, 1500);
    setTimeout(() => {
      this.setState({ isLoading: false })
    }, 2000);
    // this.props.deviceUpdateStatus(deviceUp)

  }

  render() {
    let deviceDetails = this.props.route.params.device;
    let deviceSts = this.props.DeviceStatusData && this.props.DeviceStatusData
    console.log('----------', deviceSts);
    deviceSts && deviceSts.forEach((element, index) => {
      element.time = this.state.times[index].time
    });
    return (
      <Block safe flex>
        <Block
          row
          center
          card
          shadow
          space="between"
          style={styles.card}
          key={{}} >
          <Block flex>
            <View style={{ borderBottomColor: '#aaa', borderBottomWidth: 1 }} >
              <View style={{
                alignItems: 'center', justifyContent: 'center', width: "100%", flexDirection: "row",
                paddingBottom: 10
              }}>
                <TouchableOpacity
                  style={{ width: 50, alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => this.previousDateSet()}
                >
                  <Icon name="left" family="AntDesign" color={'#aaa'} size={25} />
                </TouchableOpacity>
                <View
                  style={{ margin: 5, marginLeft: 8 }}
                >
                  <Text style={{ fontSize: 20, fontWeight: '600', color: 'gray' }}>
                    {this.props.startDate.format("MMMM D")}
                  </Text>

                </View>
                <TouchableOpacity
                  style={{ width: 50, alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => this.nextDateSet()}
                >
                  <Icon name="right" family="AntDesign" color={'#aaa'} size={25} />

                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text size={BASE_SIZE * 1.125}>{deviceDetails && deviceDetails.title}</Text>
              <Text size={BASE_SIZE * 0.875} style={{ marginTop: 5 }} muted>
                {deviceDetails && deviceDetails.subtitle}
              </Text>
            </View>
          </Block>
        </Block>

        <ScrollView style={{ marginVertical: 10 }}>
          <View>
            {this.state.loading ?
              <View style={{ width: width, height: height - 250, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color='black' size="large" style={{ width: 51 }} />
              </View>
              :
              <View>
                {deviceSts == '' ?
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>No data found</Text>
                  </View>
                  :
                  <View>
                    {
                      deviceSts && deviceSts.map((d, i) => {
                        return (
                          <View style={styles.tableMain}>
                            <View style={styles.tableText}>
                              <Text style={{}}>{d.time}</Text>
                            </View>
                            <View style={styles.tableSwitch}>
                              {this.state.loaderIndex == i ?
                                <>{this.state.isLoading ?
                                  <View>
                                    <ActivityIndicator color='#aaa' size="small" style={{ width: 51 }} />
                                  </View>
                                  :
                                  <Switch
                                    trackColor
                                    value={d.status && d.status}
                                    onChange={() => { }}
                                    onValueChange={() => { this._onSwitch(d, i) }}
                                  />
                                }
                                </>
                                :
                                <Switch
                                  trackColor
                                  disabled={this.state.isLoading ? true : false}
                                  value={d.status && d.status}
                                  onChange={() => { }}
                                  onValueChange={() => { this._onSwitch(d, i) }}
                                />
                              }
                            </View>
                          </View>
                        )
                      })
                    }
                  </View>
                }
              </View>
            }
          </View>


        </ScrollView>
      </Block>
    );
  }
}

function mapStateToProps(state) {
  return {
    devices: state.devices,
    usageData: state.usageData,
    startDate: state.startDate,
    endDate: state.endDate,
    duration: state.duration,
    user: state.user,
    DeviceStatusData: state.DeviceStatusData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPoop: () => {
      dispatch(fetchDevices());
    }, fetchUsageData: (startMoment, endMoment, duration) => {
      dispatch(fetchUsageData(startMoment, endMoment, duration))
    },
    deviceStatus: (deviceDetails) => {
      dispatch(deviceStatus(deviceDetails));
    },
    deviceUpdateStatus: device => {
      dispatch(deviceUpdateStatus(device));

    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeviceListDetails);

const styles = StyleSheet.create({
  card: {
    borderColor: 'transparent',
    marginHorizontal: BASE_SIZE,
    marginVertical: BASE_SIZE / 2,
    paddingHorizontal: BASE_SIZE,
    padding: BASE_SIZE / 1.5,
    backgroundColor: COLOR_WHITE,
    shadowOpacity: 0.4,
  },
  tableMain: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderWidth: 0.5,
    height: 50,
    borderColor: '#ddd',
    backgroundColor: COLOR_WHITE,
  },
  tableText: {
    flex: 1,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderColor: '#ddd',
  },
  tableSwitch: {
    borderWidth: 0.5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderColor: '#ddd',
    borderRightWidth: 1
  }
});
