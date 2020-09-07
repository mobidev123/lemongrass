import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { fetchPGECredentials } from './profile-actions';
import { fetchUsageData } from './usage-actions';
import axios from 'axios';
import { fetchDevices } from './device-actions';

import { DURATIONS, BAR_GRAPH_COLORS } from '../constants/theme'

import DateRangePicker from 'react-dates'

import * as ComponentUtil from './../util/ComponentUtil'

import { prettyPrint } from '../util/GeneralUtil'
let uri = 'http://34.227.18.102:3000'

var moment = require('moment');
import { Platform } from 'react-native';
const FBSDK = require('react-native-fbsdk');
const { LoginManager, AccessToken } = FBSDK;

Platform.OS === 'ios' ?
  GoogleSignin.configure({
    //It is mandatory to call this method before attempting to call signIn()
    //scopes: ['profile', 'email'],
    scopes: ['profile'],
    //webClientId: '1023254476105-5rg3hf0q63rqhh77skkcjdq48o566j4a.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    //offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    //hostedDomain: '', // specifies a hosted domain restriction
    //loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
    //forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    //androidClientId: '800816865978-1673chdpcr4e6kibl11vglbr8jk4j9ki.apps.googleusercontent.com',
    iosClientId: '270217226325-7n7dapev6bn7rch487rq2ecroicm1gdu.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  }) : GoogleSignin.configure({
    //It is mandatory to call this method before attempting to call signIn()
    //scopes: ['profile', 'email'],
    scopes: ['profile'],
    webClientId: '1023254476105-5rg3hf0q63rqhh77skkcjdq48o566j4a.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    hostedDomain: '', // specifies a hosted domain restriction
    loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
    forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.

    //androidClientId: '800816865978-1673chdpcr4e6kibl11vglbr8jk4j9ki.apps.googleusercontent.com',
    //iosClientId: '270217226325-7n7dapev6bn7rch487rq2ecroicm1gdu.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  });


export const googleSignIn = function () {
  return async (dispatch, getState) => {
    dispatch({ type: 'IS_LOADING' });
    await GoogleSignin.hasPlayServices({
      //Check if device has Google Play Services installed.
      //Always resolves to true on iOS.
      showPlayServicesUpdateDialog: true,
    });
    //console.log("after googleSignIn Call");
    let userInfo = await GoogleSignin.signIn().catch(err => console.log(`ERROR:.....  ${err}`));

    userInfo.user.authProvider = 'GOOGLE';
    var user_name = userInfo.user.name.split(" ");
    var firstname = "";
    var lastname = "";
    if (user_name.length > 1) {
      firstname = user_name[0];
      lastname = user_name[1];
    } if (user_name.length == 1) {
      firstname = user_name[1];
    }
    prettyPrint({
      email: userInfo.user.email,
      first_name: firstname,
      last_name: lastname,
      token: userInfo.user.id
    });
    await axios({
      method: 'post',
      url: uri + '/social_login',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        email: userInfo.user.email,
        first_name: firstname,
        last_name: lastname,
        token: userInfo.user.id
      },
    })
      .then(responseLogin => {
        console.log('responseLogin', responseLogin);

        prettyPrint("responseLogin ==========: ")
        prettyPrint(responseLogin);
        if (responseLogin.data.status == 1 || responseLogin.data.status == '1') {
          var currentUser = responseLogin.data.data;
          currentUser.authProvider = 'GOOGLE';

          currentUser.id = responseLogin.data.data.id;
          dispatch({ type: 'SET_USER', payload: currentUser });
          dispatch(fetchPGECredentials());
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
          // moment().add(1, 'days').calendar();      
          duration = DURATIONS.DURATION_1_HOUR;
          //console.log("about to fetch usage data")
          dispatch(fetchDevices())
          dispatch(fetchUsageData(startMoment, endMoment, duration))
        }
      })
      .catch(error => {

      })
      .finally(error => {

      });
    // dispatch({ type: 'SET_USER', payload: userInfo.user });
    // dispatch(fetchPGECredentials());
    // startMoment = moment()
    //   .year(2020)
    //   .month(0)
    //   .date(1);
    // endMoment = moment()
    //   .year(2020)
    //   .month(0)
    //   .date(2);
    // duration = DURATIONS.DURATION_1_HOUR;
    // //console.log("about to fetch usage data")
    // dispatch(fetchUsageData(startMoment, endMoment, duration))
  };
};

export const facebookSignIn = function () {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: 'IS_LOADING' });
      await LoginManager.logInWithPermissions(['public_profile']);
      let accessToken = await AccessToken.getCurrentAccessToken();
      let userInfo = await fetch(
        `https://graph.facebook.com/v6.0/me?fields=email,first_name,last_name,picture&access_token=${
        accessToken.accessToken
        }`,
      );
      userInfo = await userInfo.json();
      // console.log(userInfo)
      // let picture = await fetch(`https://graph.facebook.com/v6.0/me/picture&access_token=${accessToken.accessToken}`);
      // console.log(picture)
      let user = {
        givenName: userInfo.first_name,
        familyName: userInfo.last_name,
        email: userInfo.email,
        photo: userInfo.picture.data.url,
        authProvider: 'FACEBOOK',
      };
      dispatch({ type: 'SET_USER', payload: user });
      dispatch(fetchPGECredentials());
      startMoment = moment()
        .year(2020)
        .month(0)
        .date(1);
      endMoment = moment()
        .year(2020)
        .month(0)
        .date(2);
      duration = DURATIONS.DURATION_1_HOUR;
      // console.log("about to fetch usage data")
      dispatch(fetchUsageData(startMoment, endMoment, duration))
    } catch (error) {
      // console.log(error);
      dispatch({ type: 'AUTH_FAILURE', payload: error });
    }
  };
};

export const signOut = function () {
  return async (dispatch, getState) => {
    let user = getState().user;
    dispatch({ type: 'IS_LOADING' });
    // console.log(user);
    try {
      if (user.authProvider == 'GOOGLE') {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } else if (user.authProvider == 'FACEBOOK') {
        let accessToken = await AccessToken.getCurrentAccessToken();
        // let userId = AccessToken.getUserId();
        // Log out doesn't quite work
        let response = await fetch(
          `https://graph.facebook.com/v2.5/me?access_token=${
          accessToken.accessToken
          }`,
          {
            method: 'delete',
          },
        );
        // console.log(response);
        await LoginManager.logOut();
      }
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error) {
      console.error(error);
      dispatch({ type: 'AUTH_FAILURE', payload: error });
    }
  };
};

export const signUp = function (user) {
  return async (dispatch, getState) => {
    dispatch({ type: 'IS_LOADING' });
    dispatch({ type: 'SET_USER', payload: user });
  };
};
