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
  Linking
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
  StackedAreaChart
} from 'react-native-svg-charts'
import { generateMockConsumptionData } from '../constants/MockData'

import { DURATIONS, BAR_GRAPH_COLORS } from '../constants/theme'

import DateRangePicker from 'react-dates'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
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
      exclusionList: new Set(),
      isTrue: false,
      openBox: false,
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
    this.setState({ openBox: false })
    let text = {}
    text = `${selectedOption.toString()}`
    selectedOption = { text }
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


  // renderYAxisTicks(max, min) {
  //   // console.log('max min', max, min);

  //   let yAxisTicks = []
  //   max = max * 2
  //   let numberOfTicks = 10
  //   let temp = min
  //   let tickOptions = [1, 2, 5]
  //   let tickMultiplier = 1
  //   let tickSize = 1
  //   /*  */
  //   // console.log('max++++++++++++++++max', max);

  //   while (max / (tickMultiplier * 5) > 20) {
  //     tickMultiplier = tickMultiplier * 10
  //   }
  //   // console.log('111111111111111', tickMultiplier);

  //   if (max / (tickMultiplier * 5) > 10) {
  //     tickSize = tickMultiplier * 5
  //   } else if (max / (tickMultiplier * 2) > 10) {
  //     tickSize = tickMultiplier * 2
  //   } else {
  //     tickSize = tickMultiplier / 5
  //   }
  //   // tickSize = 500
  //   let positiveMin = min
  //   let max1 = 0
  //   if (min < 0) {
  //     // console.log('--------------22222222-------');

  //     positiveMin = - min
  //     max1 = max + (positiveMin)
  //     // console.log('000000000000', positiveMin);
  //     // console.log('max..........', max1);

  //   } else {
  //     max1 = max
  //   }
  //   while (temp < max) {
  //     percentage = (max1 / 10) / max * 100
  //     stringPercentage = percentage.toString() + "%"
  //     // console.log('stringPercentage', stringPercentage);

  //     yAxisTicks.push(
  //       <View style={{ height: '13%', flexDirection: "column-reverse" }}>
  //         <View style={{ backgroundColor: "gray", height: 1 }}>
  //         </View>
  //         <Text style={{ fontSize: 10, color: "#000" }}>
  //           {temp.toFixed(2)}
  //         </Text>
  //       </View>
  //     );

  //     temp = temp + (max1 / 10);
  //     console.log('+++++++++++temp+++++++++++++', temp);

  //   }
  //   return yAxisTicks
  // }
  renderYAxisTicks(max) {
    let yAxisTicks = []
    max = Math.ceil(max);
    let numberOfTicks = 11
    let temp = 0
    let tickOptions = [1, 2, 5]
    let tickMultiplier = 1
    let tickSize = 1
    // while (max / (tickMultiplier * 5) > 20) {
    // tickMultiplier = tickMultiplier * 10
    // }
    // if (max / (tickMultiplier * 5) > 10) {
    tickSize = max / 10
    // } else if (max / (tickMultiplier * 2) > 10) {
    // tickSize = tickMultiplier * 2
    // } else {
    // tickSize = tickMultiplier / 10
    // }

    // console.log(tickSize)

    while (temp < max) {
      percentage = tickSize / max * 100
      stringPercentage = percentage.toString() + "%"
      // console.log(stringPercentage)

      yAxisTicks.push(
        <View style={{ height: stringPercentage, flexDirection: "column-reverse" }}>
          <View style={{ backgroundColor: "gray", height: 1 }}>

          </View>
          <Text style={{ fontSize: 10, color: "gray" }}>
            {temp.toFixed(2)}
          </Text>
        </View>
      );
      temp = temp + tickSize;
      // console.log('temp-------', temp);
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
    const data = [
      {
        month: new Date(2015, 0, 1),
        apples: 3840,
        bananas: 1920,
        cherries: 960,
        dates: 400,
      },
      {
        month: new Date(2015, 1, 1),
        apples: 1600,
        bananas: 1440,
        cherries: 960,
        dates: 400,
      },
      {
        month: new Date(2015, 2, 1),
        apples: 640,
        bananas: 960,
        cherries: 3640,
        dates: 400,
      },
      {
        month: new Date(2015, 3, 1),
        apples: 3320,
        bananas: 480,
        cherries: 640,
        dates: 400,
      },
    ]

    const colors = ['rgb(138, 0, 230, 0.8)', 'rgb(173, 51, 255, 0.8)', 'rgb(194, 102, 255, 0.8)', 'rgb(214, 153, 255, 0.8)']
    const keys = ['apples', 'bananas', 'cherries', 'dates']


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
    mockBarGraphDataObject = this.createDataInputObjects(this.props.usageData && this.props.usageData, this.props.devices.data && this.props.devices.data)
    // prettyPrint(mockBarGraphDataObject)
    return (
      <View style={{ flex: 1 }}>
        {/* <View style={{ backgroundColor: "white", width: "100%", height: "22%", shadowRadius: 5, elevation: 10, shadowColor: 'black', shadowOpacity: 1.0 }}> */}
        <View style={{ width: "100%", zIndex: 9999 }}>
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
              {/* <View style={{ width: "90%", margin: 5 }}>
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
              </View> */}
              <View style={{ margin: 10, zIndex: 9999 }}>
                <TouchableOpacity
                  onPress={() => this.setState({ openBox: !this.state.openBox })}
                  style={{ flexDirection: 'row', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 5, borderColor: '#ddd' }}>
                  <Text style={{ flex: 1, fontSize: 16 }}>{this.props.duration}</Text>
                  <MaterialCommunityIcons name={this.state.openBox ? 'chevron-up' : 'chevron-down'} size={20} color={'#aaa'} />
                </TouchableOpacity>
                {this.state.openBox &&
                  <View style={{ position: 'absolute', width: '100%', top: 35, borderWidth: 1, borderColor: '#ddd' }}>
                    {options.map((d) => {
                      return (
                        <TouchableOpacity
                          onPress={() => this.setSelectedOption(d.text)}
                          style={{ height: 40, backgroundColor: '#fff', justifyContent: 'center', paddingHorizontal: 10 }}>
                          <Text style={{ fontSize: 16 }}>{d.text}</Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                }
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

        <View style={{ width: "94%", height: "77%", marginLeft: 12, marginRight: 12, flexDirection: 'row' }}>
          {/* <YAxis
            style={{ width: 30 }}
            data={StackedAreaChart.extractDataPoints(mockBarGraphDataObject.data, mockBarGraphDataObject.keys)}
            contentInset={{ top: 10, bottom: 10 }}
            svg={{
              fontSize: 12,
              fill: 'black',
              stroke: 'black',
              strokeWidth: 0.1,
              alignmentBaseline: 'baseline',
              baselineShift: '3',
            }}
          /> */}
          <View
            style={{ width: 30, justifyContent: 'flex-start', height: ComponentUtil.makePercentage(constants.yAxisPercentage), marginTop: 22, flexDirection: 'column-reverse' }}>
            {this.renderYAxisTicks(mockBarGraphDataObject.max, mockBarGraphDataObject.min)}
          </View>
          {/* <View
            style={{ width: 30, justifyContent: 'flex-start', height: ComponentUtil.makePercentage(92.8), marginTop: 22, flexDirection: 'column-reverse' }}>
            {this.renderYAxisTicks(mockBarGraphDataObject.max, mockBarGraphDataObject.min)}
          </View> */}
          <View style={{ backgroundColor: "gray", width: 1, height: ComponentUtil.makePercentage(constants.yAxisPercentage), marginTop: 22 }} />
          {mockBarGraphDataObject && mockBarGraphDataObject.data && mockBarGraphDataObject.data.length > 0 ?
            <ScrollView horizontal={true}>
              <View
                style={{ width: (mockBarGraphDataObject.data.length * constants.barWidth), height: "100%", flexDirection: 'column-reverse' }}
                horizontal={false}
              >
                <View style={{ flexDirection: "row", width: (mockBarGraphDataObject.data.length * constants.barWidth) }}>
                  {this.renderBarLabels(mockBarGraphDataObject.fullBarInfo)}
                </View>
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
              <Text style={{ fontSize: 20, color: 'gray', paddingLeft: 10, textAlign:'center' }}>You can upload your electricity bill using this URL:</Text>
              <TouchableOpacity
            style={{ height: 40, justifyContent: 'center' }}
            onPress={() => Linking.openURL(`http://34.227.18.102:3000/csv?user_id=${user.id}`)}>
            <Text style={{ fontSize: 20, color: 'gray' }}>
              {'Upload csv file'}</Text>
          </TouchableOpacity>{/*  */}
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

