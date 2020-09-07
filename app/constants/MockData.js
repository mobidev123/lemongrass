import moment from 'moment';

import { DURATIONS } from './theme';
import DeviceDetails from '../screens/DeviceDetails';
import { max } from 'react-native-reanimated';
import { prettyPrint } from '../util/GeneralUtil';

export const devices = [
  {
    id: 1,
    name: 'dryer',
    kiloWattHoursPerHour: 3,
  },
  {
    id: 2,
    name: 'washer',
    kiloWattHoursPerHour: 4.4,
  },
  {
    id: 3,
    name: 'living room lights',
    kiloWattHoursPerHour: 0.0134,
  },
  {
    id: 4,
    name: 'kitchen lights',
    kiloWattHoursPerHour: 0.0144,
  },
  {
    id: 5,
    name: 'garage lights',
    kiloWattHoursPerHour: 0.0174,
  },
  {
    id: 6,
    name: 'master bedroom lights',
    kiloWattHoursPerHour: 0.02,
  },
  {
    id: 7,
    name: 'microwave',
    kiloWattHoursPerHour: 1.2,
  },
  {
    id: 8,
    name: 'toaster',
    kiloWattHoursPerHour: 0.12,
  },
  {
    id: 9,
    name: 'swimming pool',
    kiloWattHoursPerHour: 0.285,
  },
  {
    id: 10,
    name: 'kitchen fridge',
    kiloWattHoursPerHour: 0.01,
  },
  {
    id: 11,
    name: 'garage fridge',
    kiloWattHoursPerHour: 0.083,
  },
  {
    id: 12,
    name: 'master shower',
    kiloWattHoursPerHour: 30,
  },
  {
    id: 13,
    name: 'jakes shower',
    kiloWattHoursPerHour: 30,
  },
  {
    id: 24,
    name: 'jakes room lights',
    kiloWattHoursPerHour: 0.015,
  },
  {
    id: 25,
    name: 'TV',
    kiloWattHoursPerHour: 0.003,
  },
  {
    id: 26,
    name: 'stove',
    kiloWattHoursPerHour: 1.5,
  },
];

export function generateMockConsumptionData(devices, startMoment, endMoment, duration, max, intervalData = []) {
  /**
   * so we need a start moment, end moment, duration, and deviceInfo (deviceId, deviceName)
   */
  // declaring input constants
  // startMoment = moment()
  //   .year(2020)
  //   .month(0)
  //   .date(1);
  // endMoment = moment()
  //   .year(2020)
  //   .month(0)
  //   .date(2);
  // duration = DURATIONS.DURATION_1_HOUR;
  // let max = 1000

  // console.log(max)
  // console.log("in generateMockConsumptionData")
  // console.log(devices)
  // console.log(startMoment)
  // console.log(endMoment)
  // console.log(duration)

  startMoment = startMoment.clone()
  endMoment = endMoment.clone()

  if (duration == DURATIONS.DURATION_15_MINUTES) {
    increment = {
      minutes: 15,
      hour: 0,
      day: 0
    };
  } else if (duration == DURATIONS.DURATION_1_HOUR) {
    increment = {
      minutes: 0,
      hour: 1,
      day: 0
    };
  } else {
    increment = {
      minutes: 0,
      hour: 0,
      day: 1
    };
  }
  // let devices = ["1", "2", "3"]
  consumption = []

  // while (!startMoment.isAfter(endMoment)) {
  //   let total = Math.random() * max
  //   console.log('called while');
  //   consumption.push({
  //     total: total * 1.2,
  //     startTime: startMoment.valueOf(),
  //     endTime: startMoment.clone().add(increment).valueOf(),
  //     consumption: distributeConsumption(devices, total)
  //   })
  //   startMoment.add(increment)
  // }


  for (let i = 0; i < intervalData.length; i++) {
    console.log('intervalData[i].start', intervalData[i].start, intervalData[i].end);
    consumption.push({
      total: intervalData[i].totalUsage,
      startTime: intervalData[i].start,
      endTime: intervalData[i].end,
      consumption: distributeConsumption(devices, intervalData[i].totalUsage, intervalData[i].devices)
    });
  }
  return consumption
}

function distributeConsumption(devices, total, interval) {
  // let randomNumerators = devices.map((device) => Math.random());
  // let aggregateDenominator = randomNumerators.reduce((a, b) => a + b);
  let randomDistribution = []
  for (let i = 0; i < devices.length; i++) {
    let intervalId = interval.findIndex(element => element.device_id == devices[i]);
    if (intervalId == -1) {
      randomDistribution.push(
        {
          deviceId: devices[i],
          consumption: 0
        }
      )
    } else {
      randomDistribution.push(
        {
          deviceId: devices[i],
          consumption: interval[intervalId].usage
        }
      )
    }
  }
  return randomDistribution;
}
