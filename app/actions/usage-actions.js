import axios from 'axios';
import moment from 'moment'
import { generateMockConsumptionData } from '../constants/MockData'
import { prettyPrint } from '../util/GeneralUtil';
import _ from 'lodash';
import { DURATIONS, BAR_GRAPH_COLORS } from '../constants/theme'
import { UTCDate } from '../util/UTCDate';
// import { UTCDate } from '../util/UTCDate'
let uri = 'http://34.227.18.102:3000'

export const fetchUsageData = function (startMoment, endMoment, duration) {
  console.log('API--call-----', startMoment.toString(),endMoment, duration);

  //console.log('fetchUsageData action before async');
  return async (dispatch, getState) => {

    var statedata = getState('GET_USER');

    console.log('fetchUsageData action after async', statedata);

    axios.defaults.validateStatus = () => {
      return true;
    };
    await axios({
      method: 'post',
      url: uri + '/get_all_device',
      data: {
        user_id: statedata.user.id,
      },
    })
      .then(async response => {

        console.log('>>>>> startMoment >>>>>', startMoment, UTCDate(startMoment).toString());
        max = 1000

        let _duration = 15;
        if (duration == DURATIONS.DURATION_1_HOUR) {
          _duration = 60;
        } else if (duration == DURATIONS.DURATION_1_DAY) {
          _duration = 24 * 60;
          endMoment=endMoment.add(1, 'day').startOf('day')
          console.log('enddate+++++++++++++', endMoment);
        }

        await axios({
          method: 'post',
          url: uri + '/getConsumptionByInterval',
          headers: {
            'Content-Type': 'application/json'
          },

          data: {
            user_id: statedata.user.id,
            start_time: new Date(startMoment).getTime(),
            end_time: new Date(endMoment).getTime(),
            // start_time: startMoment,
            // end_time: endMoment,
            // start_time: moment(startMoment).format('YYYY/MM/DD'),
            // end_time:  moment(endMoment).format('YYYY/MM/DD'),
            interval: _duration
            // "user_id": 103,
            // "start_time": 1587795300000,
            // "end_time": 1587804240000,
            // "interval": 15
          },
        })
          .then(responseInterval => {
            console.log('response.data.datav', responseInterval, response.data.data);

            consumptionData = generateMockConsumptionData(
              response.data.data.map(device => device.id), startMoment, endMoment, duration, max, responseInterval.data.data)
            // console.log('consumptionData', consumptionData);
            var tempStartMoment = startMoment
            new Date(tempStartMoment)

            var tempEndMoment = endMoment
            new Date(tempEndMoment)
            dispatch({
              type: 'SET_USAGE_DATA', payload: {

                usageData: consumptionData,
                startDate: startMoment,
                endDate: endMoment,
                duration: duration
              }
            })
          })
          .catch(error => {
            // console.log('responseInterval catch', error);
            dispatch({
              type: 'SET_USAGE_DATA', payload: {
                usageData: [],
                startDate: tempStartMoment,
                endDate: tempEndMoment,
                duration: duration
              }
            })
          })
          .finally(error => {
            // console.log('responseInterval finally', error);

          });
        //console.log("generatingConsumptionData")
        //prettyPrint(response.data.data)
        //consumptionData = generateMockConsumptionData(response.data.data.map(device => device.id), startMoment,endMoment,duration,max)
        //prettyPrint(consumptionData)
        // dispatch({type: 'SET_USAGE_DATA', payload: {
        //   usageData: consumptionData,
        //   startDate: startMoment,
        //   endDate: endMoment,
        //   duration: duration
        // }})
      })
      .catch(error => {
        //console.error(error);
        dispatch({
          type: 'SET_USAGE_DATA', payload: {
            usageData: [],
            startDate: tempStartMoment,
            endDate: tempEndMoment,
            duration: duration
          }
        })
      })
      .finally(error => {
        //console.log('completed fetchUsageData action');
      });
  };
};
