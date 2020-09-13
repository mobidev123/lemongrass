/**
 * Smart Brush
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import theme from './constants/theme';
import Login from './screens/Login';
import Home from './screens/Home';
import Profile from './screens/Profile';
import StackedBarGraph from './screens/StackedBarGraph'
import Devices from './screens/Devices'
import UploadBill from './screens/UploadBill'
import DeviceDetails from './screens/DeviceDetails';
import DeviceList from './screens/DeviceList'
import DeviceListDetails from './screens/DeviceListDetails'
import { fetchDevices } from './actions/device-actions';

import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';

const Tab = createBottomTabNavigator();
const Auth = createStackNavigator();

const reactNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.COLORS.WHITE,
  },
};

function App() {
  return (
    <ApplicationProvider mapping={mapping} theme={lightTheme}>
      <Tab.Navigator>
        {/* <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({color, size}) => (
              <AntDesign name="home" color={color} size={size} />
            ),
          }}
        /> */}
        {/* <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" color={color} size={size} />
            ),
          }}
        /> */}
        <Tab.Screen
          name="UploadBill"
          component={UploadBill}
          options={{
            tabBarLabel: 'upload your bill',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="fridge" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="StackedBarGraph"
          component={StackedBarGraph}
          options={{
            tabBarLabel: 'Usage',
            tabBarIcon: ({ color, size }) => (
              <Entypo name="bar-graph" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Devices"
          component={Devices}
          options={{
            tabBarLabel: 'Devices',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="fridge" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </ApplicationProvider>
  );
}

class SmartBrush extends Component {
  constructor(props) {
    super(props);
    // console.log("hi")
    // console.log(this.props)
    if (this.props.user != null)
      this.props.fetchPoop()
  }

  render() {
    return (
      <NavigationContainer theme={reactNavigationTheme}>
        <Auth.Navigator
          screenOptions={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: theme.COLORS.WHITE,
              shadowColor: theme.COLORS.TRANSPARENT,
              shadowRadius: 0,
              shadowOffset: {
                height: 0,
              }
            },
            headerTitleStyle: {
              fontWeight: 'normal',
            },
          }}>
          {this.props.user ? (
            <Auth.Screen name="App Name" component={App} />
          ) : (
              <Auth.Screen name="Login" component={Login} options={{
                // When logging out, a pop animation feels intuitive
                // You can remove this if you want the default 'push' animation
                animationTypeForReplace: 'pop',
              }} />
            )}
          <Auth.Screen name="DeviceListDetails" component={DeviceListDetails}
            options={({ route, navigation }) => ({
              headerBackTitle: ''
              // headerShown: false,
            })}
          />
        </Auth.Navigator>
      </NavigationContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  // console.log("mapDispatchToProps");
  return {
    fetchPoop: () => {
      // console.log("called fetchDevices in mapDispatchToProps")
      dispatch(fetchDevices())
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SmartBrush);
