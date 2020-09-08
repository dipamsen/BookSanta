import React from 'react';
import { View, Image } from 'react-native';

import { createBottomTabNavigator } from 'react-navigation-tabs'

// import screens
import StackNav from './AppStackNavigator';
import BookRequest from '../screens/Request';

const Nav = createBottomTabNavigator({
  "Donate Books": {
    screen: StackNav,
    navigationOptions: {
      tabBarIcon: <Image source={require('../assets/donate-icon.png')} style={{ width: 40, height: 40 }} />,
      tabBarLabel: "Donate Books"
    }
  },
  "Request Books": {
    screen: BookRequest,
    navigationOptions: {
      tabBarIcon: <Image source={require('../assets/request-icon.png')} style={{ width: 40, height: 40 }} />,
      tabBarLabel: "Request Books"
    }
  },
})

export default Nav