/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
  TouchableOpacityBase,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Title from '../components/Title';
import { connect } from 'react-redux';
import {
  Layout,
  RangeDatepicker,
  Select
} from '@ui-kitten/components';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  StackedBarChart,
  XAxis,
  YAxis, LineChart, Grid,

} from 'react-native-svg-charts'

import { generateMockConsumptionData } from '../constants/MockData'

import { DURATIONS, BAR_GRAPH_COLORS } from '../constants/theme'

import DateRangePicker from 'react-dates'

import * as ComponentUtil from './../util/ComponentUtil'

import { prettyPrint } from '../util/GeneralUtil'
import { fetchUsageData } from '../actions/usage-actions';
const { height } = Dimensions.get('window');
var moment = require('moment');

class StackedBarGraph extends Component {

  constructor(props) {
    super(props);
    // this.state = {
    //   isStartDatePickerVisible: false,
    //   isEndDatePickerVisible: false,
    //   range: {
    //       startDate: moment().startOf('day'),
    //       endDate: moment().endOf('day')
    //   },
    //   selectedOption: { text: this.props.duration},
    //   duration: this.props.duration,
    //   startDate: this.props.startDate,
    //   endDate: this.props.endDate,
    //};
    this.state = {
      exclusionList: new Set()
    }
  }

  makeStartOfWeek(moment) {
    while (newStartDate.day() != 1) {
      newStartDate.subtract(1, 'day')
    }
  }

  makeEndOfWeek(moment) {
    while (newEndDate.day() != 0) {
      newEndDate.add(1, 'day')
    }
  }
  componentWillReceiveProps() {
    this.renderTitleDateString()
  }

  setSelectedOption(selectedOption) {
    let newState = { ...this.props }
    newState["selectedOption"] = selectedOption
    if (newState.selectedOption != null) {
      newState.duration = newState.selectedOption.text
    }
    if (newState.duration == DURATIONS.DURATION_15_MINUTES) {
      let tempDate = this.props.startDate.clone().add(1, 'day').startOf('day')
      newState.startDate = this.props.startDate.clone().startOf('day')
      newState.endDate = tempDate
      // newState.endDate = newState.startDate.clone().endOf('day')
    } else if (newState.duration == DURATIONS.DURATION_1_HOUR) {
      let tempDate = this.props.startDate.clone().add(1, 'day').startOf('day')
      newState.startDate = this.props.startDate.clone().startOf('day')
      newState.endDate = tempDate
    } else if (newState.duration == DURATIONS.DURATION_1_DAY) {
      let tempDate = this.props.startDate.clone().add(1, 'day').startOf('day')
      newStartDate = this.props.startDate.clone();

      this.makeStartOfWeek(newStartDate)
      newEndDate = newStartDate.clone()
      this.makeEndOfWeek(newEndDate)
      newState.startDate = newStartDate
      newState.endDate = tempDate
    } else {
    }
    //prettyPrint(newState)
    //this.setState(newState)
    // if(newState.startDate != null && newState.endDate != null && newState.duration != null){
    //   this.props.fetchUsageData(newState.startDate, newState.endDate, newState.duration)
    // }
    // this.setState(newState)

    this.props.fetchUsageData(newState.startDate, newState.endDate, newState.duration)
  }

  // setRange(newRange) {
  //   let newState = {...this.state}
  //   if(newRange.startDate != null){
  //     newState["startDate"] = moment(newRange.startDate)
  //   }
  //   if(newRange.endDate != null){
  //     newState["endDate"] = moment(newRange.endDate)
  //   }
  //   newState["range"] = newRange
  //   prettyPrint(newState)
  //   this.setState(newState)
  //   if(newState.startDate != null && newState.endDate != null && newState.duration != null){
  //     this.props.fetchUsageData(newState.startDate, newState.endDate, newState.duration)
  //   }
  // }

  createDataInputObjects(mockData, devices) {
    dataInputObject = {}
    dataInputObject["data"] = []
    max = 0
    min = 0
    mockData.forEach((interval) => {
      intervalDeviceIdToConsumptionMapping = {}
      total = 0
      adjustedIntervalTotal = interval.total
      interval.consumption.forEach((deviceConsumption) => {
        if (!this.state.exclusionList.has(deviceConsumption.deviceId)) {
          intervalDeviceIdToConsumptionMapping[deviceConsumption.deviceId] = deviceConsumption.consumption
          total += deviceConsumption.consumption

        } else {
          adjustedIntervalTotal -= deviceConsumption.consumption
          intervalDeviceIdToConsumptionMapping[deviceConsumption.deviceId] = 0
        }
      })
      prettyPrint(intervalDeviceIdToConsumptionMapping)
      // totalCategorized = interval.consumption.reduce((deviceConsumption1,deviceConsumption2) => {
      //   return {consumption: deviceConsumption1.consumption + deviceConsumption2.consumption}
      // }).consumption
      if (!this.state.exclusionList.has("uncategorized")) {
        intervalDeviceIdToConsumptionMapping["uncategorized"] = adjustedIntervalTotal - total
        total += intervalDeviceIdToConsumptionMapping["uncategorized"]
      } else {
        intervalDeviceIdToConsumptionMapping["uncategorized"] = 0
      }
      max = Math.max(max, total)
      let minTotalArray = mockData.map((minTotal) => {
        return minTotal.total
      })
      minTotalArray.sort((a, b) => a - b)
      min = minTotalArray[0]
      dataInputObject["data"].push(intervalDeviceIdToConsumptionMapping)

    })
    dataInputObject["max"] = max
    dataInputObject["min"] = min
    sortedDeviceList = devices.sort((d1, d2) => {
      if (d1.id < d2.id) {
        return -1;
      }
      if (d1.id > d2.id) {
        return 1;
      }
      return 0;
    });

    var i;
    var colorMap = new Map()
    var keys = []
    var colors = []
    colorMap.set("uncategorized", { color: "#bdbdbd", device_name: "uncategorized" });
    for (i = 0; i < sortedDeviceList.length; i++) {
      colorMap.set(sortedDeviceList[i].id, { color: BAR_GRAPH_COLORS[i], device_name: sortedDeviceList[i].device_name });
      keys.push(sortedDeviceList[i].id)
      colors.push(BAR_GRAPH_COLORS[i])
    }

    keys.push("uncategorized")
    colors.push("#bdbdbd")
    dataInputObject["colorMap"] = colorMap
    dataInputObject["keys"] = keys
    dataInputObject["colors"] = colors
    dataInputObject["fullBarInfo"] = mockData
    return dataInputObject
  }

  // showDatePicker(key){
  //   let newState = {...this.state}
  //   newState[key] = true
  //   this.setState(newState)
  // };

  // hideDatePicker(key){
  //   let newState = {...this.state}
  //   newState[key] = false
  //   this.setState(newState)
  // };

  // handleConfirm(key, date){
  //   console.warn("A date has been picked: ", date);
  //   prettyPrint(this.state)
  //   this.hideDatePicker(key)
  // };

  renderBarLabelString(duration, moment) {
    if (duration == DURATIONS.DURATION_15_MINUTES) {
      return moment.format("h:mm A")
    } else if (duration == DURATIONS.DURATION_1_HOUR) {
      return moment.format("h A")
    } else if (duration == DURATIONS.DURATION_1_DAY) {
      return moment.format("M/D")
    }
  }

  adjustExcludedList(id) {
    let newState = { ...this.state }
    if (newState.exclusionList.has(id)) {
      newState.exclusionList.delete(id)
    } else {
      newState.exclusionList.add(id)
    }
    this.setState(newState)
  }

  renderLegendRows(colorMap) {
    let legendRows = []
    let keyso = [...colorMap.keys()];
    for (let i = 0; i < keyso.length; i++) {
      let parentViewStyle;
      if (i == 0) {
        parentViewStyle = { height: 30, width: "100%", borderColor: "grey", marginLeft: 2, marginRight: 2, flexDirection: "row", padding: 5 }
      } else if (i > 0 && i < keyso.length - 1) {
        parentViewStyle = { height: 30, width: "100%", borderColor: "grey", marginLeft: 2, marginRight: 2, flexDirection: "row", padding: 5 }
      } else {
        parentViewStyle = { height: 30, width: "100%", borderColor: "grey", marginLeft: 2, marginRight: 2, flexDirection: "row", padding: 5 }
      }
      if (this.state.exclusionList.has(keyso[i])) {
        legendRows.push(
          <TouchableOpacity style={parentViewStyle} onPress={() => this.adjustExcludedList(keyso[i])}>
            <View style={{ height: 20, width: 20, borderColor: colorMap.get(keyso[i]).color, borderRadius: 2, borderWidth: 1 }}>
            </View>
            <Text style={{ fontSize: 14, marginLeft: 3, color: "gray" }}>
              {colorMap.get(keyso[i]).device_name}
            </Text>
          </TouchableOpacity>
        );
      } else {
        legendRows.push(
          <TouchableOpacity style={parentViewStyle} onPress={() => this.adjustExcludedList(keyso[i])}>
            <View style={{ height: 20, width: 20, backgroundColor: colorMap.get(keyso[i]).color, borderRadius: 2 }}>
            </View>
            <Text style={{ fontSize: 14, marginLeft: 3, color: "gray" }}>
              {colorMap.get(keyso[i]).device_name}
            </Text>
          </TouchableOpacity>
        );
      }
    }
    return legendRows
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
    if (this.props.duration == DURATIONS.DURATION_15_MINUTES) {
      let tempNextDate = this.props.startDate.clone().add(2, 'day').startOf('day')
      newState.startDate = this.props.startDate.clone().add(1, 'day').startOf('day')
      newState.endDate = tempNextDate
    } else if (this.props.duration == DURATIONS.DURATION_1_HOUR) {
      let tempNextDate = this.props.startDate.clone().add(2, 'day').startOf('day')
      newState.startDate = this.props.startDate.clone().add(1, 'day').startOf('day')
      newState.endDate = tempNextDate
    } else if (this.props.duration == DURATIONS.DURATION_1_DAY) {
      newStartDate = this.props.startDate.clone()
      newStartDate.add(7, 'day')
      this.makeStartOfWeek(newStartDate)
      newEndDate = newStartDate.clone()
      this.makeEndOfWeek(newEndDate)
      newState.startDate = newStartDate
      newState.endDate = newEndDate
    }
    this.setState({ defaultDate: newState.startDate })
    this.props.fetchUsageData(newState.startDate, newState.endDate, newState.duration)
  }

  previousDateSet() {
    let newState = { ...this.props }
    if (this.props.duration == DURATIONS.DURATION_15_MINUTES) {
      let tempPrevDate = this.props.startDate.clone().startOf('day')
      newState.startDate = this.props.startDate.clone().subtract(1, 'day').startOf('day')
      newState.endDate = tempPrevDate
    } else if (this.props.duration == DURATIONS.DURATION_1_HOUR) {
      let tempPrevDate = this.props.startDate.clone().startOf('day')
      newState.startDate = this.props.startDate.clone().subtract(1, 'day').startOf('day')
      newState.endDate = tempPrevDate
    } else if (this.props.duration == DURATIONS.DURATION_1_DAY) {
      newStartDate = this.props.startDate.clone()
      newStartDate.subtract(7, 'day')
      this.makeStartOfWeek(newStartDate)
      newEndDate = newStartDate.clone()
      this.makeEndOfWeek(newEndDate)
      newState.startDate = newStartDate
      newState.endDate = newEndDate
    }
    this.props.fetchUsageData(newState.startDate, newState.endDate, newState.duration)
  }


  renderYAxisTicks(max, min) {
    // console.log('max min', max, min);

    let yAxisTicks = []
    max = max * 2
    let numberOfTicks = 10
    let temp = min
    let tickOptions = [1, 2, 5]
    let tickMultiplier = 1
    let tickSize = 1
    /*  */
    // console.log('max++++++++++++++++max', max);

    while (max / (tickMultiplier * 5) > 20) {
      tickMultiplier = tickMultiplier * 10
    }
    // console.log('111111111111111', tickMultiplier);

    if (max / (tickMultiplier * 5) > 10) {
      tickSize = tickMultiplier * 5
    } else if (max / (tickMultiplier * 2) > 10) {
      tickSize = tickMultiplier * 2
    } else {
      tickSize = tickMultiplier / 5
    }
    // tickSize = 500
    let positiveMin = min
    let max1 = 0
    if (min < 0) {
      // console.log('--------------22222222-------');

      positiveMin = - min
      max1 = max + (positiveMin)
      // console.log('000000000000', positiveMin);
      // console.log('max..........', max1);

    } else {
      max1 = max
    }
    while (temp < max) {
      percentage = (max1 / 10) / max * 100
      stringPercentage = percentage.toString() + "%"
      // console.log('stringPercentage', stringPercentage);

      yAxisTicks.push(
        <View style={{ height: stringPercentage, flexDirection: "column-reverse" }}>
          <View style={{ backgroundColor: "gray", height: 1 }}>
          </View>
          <Text style={{ fontSize: 10, color: "#000" }}>
            {temp.toFixed(2)}
          </Text>
        </View>
      );

      temp = temp + (max1 / 10);
      // console.log('+++++++++++temp+++++++++++++', temp);

    }
    return yAxisTicks
  }

  renderBarLabels(fullBarInfo) {
    let xAxisTicks = []/*  */
    for (i = 0; i < mockBarGraphDataObject.fullBarInfo.length; i++) {
      xAxisTicks.push(
        <View style={{ width: constants.barWidth, height: "100%", alignItems: "center" }}>
          <Text style={{ fontSize: 10, color: "gray", marginTop: 5 }}>
            {this.renderBarLabelString(this.props.duration, moment(mockBarGraphDataObject.fullBarInfo[i].startTime))}
          </Text>
        </View>
      );
    }
    return xAxisTicks
  }



  render() {
    const options = [
      { text: DURATIONS.DURATION_15_MINUTES },
      { text: DURATIONS.DURATION_1_HOUR },
      { text: DURATIONS.DURATION_1_DAY }
    ]
    startMoment = moment()
      .year(new Date().getFullYear())
      .month(new Date().getMonth())
      .date(new Date().getDate())
      .startOf('day')
    endMoment = moment()
      .year(new Date().getFullYear())
      .month(new Date().getMonth())
      .date(new Date().getDate() + 1)
      .startOf('day')

    duration = DURATIONS.DURATION_1_HOUR;
    //max = 1000
    deviceIds = [1, 2, 3]
    mockBarGraphDataObject = this.createDataInputObjects(this.props.usageData, this.props.devices.data)

    // prettyPrint(mockBarGraphDataObject)

    return (
      <View style={{ flex: 1 }}>
        {/* <View style={{ backgroundColor: "white", width: "100%", height: "22%", shadowRadius: 5, elevation: 10, shadowColor: 'black', shadowOpacity: 1.0 }}> */}
        <View style={{ backgroundColor: "white", width: "100%", zIndex: 9999 }}>
          <Title title="Usage Stats" />
          <View style={{ flexDirection: "row", width: "100%" }} >
            <View style={{ flexDirection: "column", width: "55%" }} >
              <View style={{ margin: 5, marginLeft: 8, marginRight: 30, marginBottom: 10, width: "100%", flexDirection: "row" }}>
                <Button
                  title="<"
                  onPress={() => this.previousDateSet()}
                >
                  <Text>
                    "hello"
                  </Text>
                </Button>
                <View
                  style={{ margin: 5, marginLeft: 8, marginRight: 30, marginBottom: 10, width: "45%", flexDirection: "row" }}
                >
                  <Text>
                    {this.renderTitleDateString()}
                  </Text>

                </View>
                <Button
                  title=">"
                  onPress={() => this.nextDateSet()}
                >
                  <Text>
                    "hello"
                  </Text>
                </Button>
              </View>
              <View style={{ width: "90%", margin: 5 }}>
                <Select
                  data={options}
                  selectedOption={{ text: this.props.duration }}
                  onSelect={(option) => this.setSelectedOption(option)}
                  placeholder={
                    <Text>
                      duration
                        </Text>
                  }
                />
              </View>
            </View>
            <View style={{ width: "45%" }}>
              <ScrollView
                horizontal={false}
                style={{ height: 90, width: 180, borderColor: "gray", borderWidth: 1, borderRadius: 3 }}
              >
                {this.renderLegendRows(mockBarGraphDataObject.colorMap)}
              </ScrollView>
            </View>
          </View>

        </View>

        <View style={{ width: "94%", height: "68%", marginLeft: 12, marginRight: 12, flexDirection: 'row' }}>

          {/* <View
            style={{ width: "25%", marginRight: 10, marginLeft: 10, borderColor: "", position: "absolute", top: "1%", left: "64%", zIndex: 1 }}
          >

          </View> */}
          <View
            style={{ width: 30, justifyContent: 'flex-start', height: ComponentUtil.makePercentage(82), marginTop: 22, flexDirection: 'column-reverse' }}>
            {this.renderYAxisTicks(mockBarGraphDataObject.max, mockBarGraphDataObject.min)}
          </View>
          <View style={{ backgroundColor: "gray", width: 1, height: ComponentUtil.makePercentage(73), marginTop: 23 }}>

          </View>
          {mockBarGraphDataObject && mockBarGraphDataObject.data && mockBarGraphDataObject.data.length > 0 ?
            <ScrollView
              horizontal={true}
            >
              <View
                style={{ width: (mockBarGraphDataObject.data.length * constants.barWidth), height: "100%", flexDirection: 'column-reverse' }}
                horizontal={false}
              >

                <View style={{ flexDirection: "row", width: (mockBarGraphDataObject.data.length * constants.barWidth) }}>
                  {this.renderBarLabels(mockBarGraphDataObject.fullBarInfo)}
                </View>
                {/* <View style={{ flexDirection: "row", backgroundColor: "gray", height: 1, width: (mockBarGraphDataObject.data.length * constants.barWidth) }}>
              </View> */}
                <StackedBarChart
                  style={{ height: ComponentUtil.makePercentage(92), width: "100%", }}
                  keys={mockBarGraphDataObject.keys}
                  colors={mockBarGraphDataObject.colors}
                  data={mockBarGraphDataObject.data}
                  showGrid={false}
                />
              </View>
            </ScrollView>
            :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, color: 'gray' }}>No consumption data found</Text>
            </View>
          }
        </View>
      </View>
    );
  }

}

function mapStateToProps(state) {
  return {
    devices: state.devices,
    usageData: state.usageData,
    startDate: state.startDate,
    endDate: state.endDate,
    duration: state.duration
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPoop: () => {
      dispatch(fetchDevices());
    },
    addDevice: device => {
      dispatch(addDevice(device));
    },
    fetchUsageData: (startMoment, endMoment, duration) => {
      dispatch(fetchUsageData(startMoment, endMoment, duration))
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StackedBarGraph);

const constants = {
  topPanelBackground: "white",
  yAxisPercentage: 93,
  barWidth: 50,
};
