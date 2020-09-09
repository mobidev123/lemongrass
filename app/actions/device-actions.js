import axios from 'axios';
import { prettyPrint } from '../util/GeneralUtil';
let uri = 'http://34.227.18.102:3000'

export const fetchDevices = function () {
  //console.log('fetchDevices action before async');
  return async (dispatch, getState) => {
    //console.log('fetchDevices action after async');
    dispatch({ type: 'IS_DEVICE_LOADING' });
    //console.log('fetchDevices action dispatched IS_DEVICE_LOADING');
    var statedata = getState('GET_USER');

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
      .then(response => {
        //console.log('getting data from axios', response.data);
        //console.log('RESPONSE 1', response.data.data);
        dispatch({ type: 'SET_DEVICES', payload: response.data });
      })
      .catch(error => {
        dispatch({ type: 'DEVICE_HAS_ERROR', payload: error });
        // console.log(error);
      })
      .finally(error => {
        dispatch({ type: 'DEVICE_HAS_ERROR', payload: error });
        // console.log(error);
      });
  };
};

export const addDevice = function (device) {
  // console.log('addDevice action before async');
  return async (dispatch, getState) => {
    // console.log('addDevice action after async');
    var statedata = getState('GET_USER');
    axios.defaults.validateStatus = () => {
      return true;
    };
    // console.log(statedata.user.id)
    // await new Promise(function(resolve, reject) {
    //   resolve(device);
    // })
    await axios({
      method: 'post',
      url: uri + '/add_device',
      data: {
        ...device,
        user_id: statedata.user.id,
      },
    })
      .then(response => {
        console.log('response', response);
        // prettyPrint('added device in the backend', response);

        dispatch(fetchDevices());
      })
      .catch(error => {
        console.error(error);
      })
      .finally(error => {
        // console.log('completed add device action');
      });
  };
};


export const updateDevice = function (device) {
  return async (dispatch, getState) => {
    var statedata = getState('GET_USER');
    axios.defaults.validateStatus = () => {
      return true;
    };
    // console.log(device);
    // await new Promise(function(resolve, reject) {
    //   resolve(device);
    // })
    await axios({
      method: 'post',
      url: uri + '/update_device',
      data: {
        ...device,
        user_id: statedata.user.id,
      },
    })
      .then(response => {
        //  console.log('update device in the backend', response);
        dispatch(fetchDevices());
      })
      .catch(error => {
        // console.error(error);
      })
      .finally(error => {
        // console.log('completed add device action');
      });
  };
};

export const deviceStatus = function (device) {
  console.log('device', new Date(device.date).getTime());
  let datas = {
    date: new Date(device.date).getTime(),
    device_id: device.device_id,
    user_id: device.user_id
  }
  console.log('datas', datas);
  return async (dispatch, getState) => {

    // console.log("switch update 1111=====")
    var statedata = getState('Set_Device_Status');
    // axios.defaults.validateStatus = () => {
    //   return true;
    // };
    // console.log('statedata.user.id', statedata.user.id)
    // await new Promise(function(resolve, reject) {
    //   resolve(device);
    // })

    await axios({
      method: 'post',
      url: uri + '/device_status_on_date',
      headers: {
        'Content-Type': 'application/json'
      },
      data:
        datas,
    })
      .then(response => {
        // prettyPrint('added device in the backend', response);
        dispatch(fetchDevices());
        let res = response.data.data
        dispatch({
          type: 'Set_Device_Status', payload: {
            DeviceStatusData: res
          }
        })

      })
      .catch(error => {
        console.error(error);
      })
      .finally(error => {
        // console.log('completed add device action');
      });
  };
};

export function deviceUpdateStatus(device) {
  return function (dispatch, getState) {
    // return new Promise((resolve, reject) => {
    var statedata = getState('Set_Device_Status');
    axios.defaults.validateStatus = () => {
      return true;
    };
    // console.log('statedata.user.id', statedata.user.id)
    // await new Promise(function(resolve, reject) {
    //   resolve(device);
    // })

    let dynamicData = {
      "user_id": device.user_id,
      "device_id": device.device_id,
      "status": device.status,
      "start_time": device.start_time,
      "end_time": device.end_time
    }
    // console.log('dynamicData', dynamicData);

    axios({
      method: 'post',
      url: uri + '/update_device_status',
      headers: {
        'Content-Type': 'application/json'
      },
      data: dynamicData
      // user_id: statedata.user.id,

    }).then(response => {
      // prettyPrint('added device in the backend', response);
      dispatch(fetchDevices());
      dispatch({
        type: 'Set_Device_Status_update', payload: {
          DeviceStatusUpdate: response.data.data
        }
      })
      // resolve(response);
    })
      .catch(error => {
        console.error(error);
      })
      .finally(error => {
        // console.log('completed add device action');
      });
    // });
  };
};
