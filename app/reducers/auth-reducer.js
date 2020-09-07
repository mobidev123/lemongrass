import { prettyPrint } from "../util/GeneralUtil";

export default function authReducer(
  state = {
    user: null,
    isLoading: false,
    error: null,
    selectedDeviceId: 1111,
    devices: null,
    isDeviceLoading: false,
    deviceError: false,
    pge: {
      provider: '',
      username: '',
      password: '',
    },
    usageData: null,
    startDate: null,
    endDate: null,
    duration: null,
    DeviceStatusData: null
  },
  action,
) {
  //console.log('inside authReducer');
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isLoading: false };
    case 'GET_USER':
      return { ...state };
    case 'IS_LOADING':
      return { ...state, isLoading: true };
    case 'AUTH_FAILURE':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_DEVICES':
      //prettyPrint({...state, devices: action.payload, isDeviceLoading: false});
      return { ...state, devices: action.payload, isDeviceLoading: false };
    case 'IS_DEVICE_LOADING':
      //prettyPrint({...state, isDeviceLoading: true});
      return { ...state, isDeviceLoading: true };
    case 'DEVICE_HAS_ERROR':
      //prettyPrint({...state, deviceError: true});
      return { ...state, deviceError: true };
    case 'SET_PGE_CREDENTIALS':
      //prettyPrint({...state, pge: action.payload});
      return { ...state, pge: action.payload };
    case 'SET_USAGE_DATA':
      //prettyPrint({...state, usageData: action.payload})
      return { ...state, usageData: action.payload.usageData, startDate: action.payload.startDate, endDate: action.payload.endDate, duration: action.payload.duration };
    case 'Set_Device_Status':
      //prettyPrint({...state, usageData: action.payload})
      return { ...state, DeviceStatusData: action.payload.DeviceStatusData };
    case 'Set_Device_Status_update':
      //prettyPrint({...state, usageData: action.payload})
      return { ...state, DeviceStatusUpdate: action.payload.DeviceStatusUpdate };
  }
  return state;
}
