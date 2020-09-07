import axios from 'axios';
let uri = 'http://34.227.18.102:3000'

export const postPGECredentials = function (credentials) {
  // console.log('postPGECredentials action before async');
  return async (dispatch, getState) => {
    // console.log('postPGECredentials action after async');
    var statedata = getState('GET_USER');
    axios.defaults.validateStatus = () => {
      return true;
    };

    await axios({
      method: 'post',
      url: uri + '/updateCredentials',
      data: {
        ...credentials,
        user_id: statedata.user.id,
      },
    })
      .then(response => {
        // console.log(
        //   'successfully updated pge credentials in backend',
        //   response.data,
        // );
        dispatch(fetchPGECredentials());
      })
      .catch(error => {
        // console.error(error);
      });
  };
};

export const fetchPGECredentials = function () {
  // console.log('fetchPGECredentials action before async');
  return async (dispatch, getState) => {
    // console.log('fetchPGECredentials action after async');
    var statedata = getState('GET_USER');
    axios.defaults.validateStatus = () => {
      return true;
    };

    await axios({
      method: 'post',
      url: uri + '/getCredentials',
      data: {
        user_id: statedata.user.id,
      },
    })
      .then(response => {
        // console.log('got PGECredentials data from axios', response.data);
        dispatch({ type: 'SET_PGE_CREDENTIALS', payload: response.data.data });
      })
      .catch(error => {
        // console.error(error);
      });
  };
};
