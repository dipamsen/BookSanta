import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import DonationScreen from '../screens/Donation';
import ReceiverDetails from '../screens/ReceiverDetails';

const StackNav = createStackNavigator({
  DonateList: {
    screen: DonationScreen,
    navigationOptions: {
      headerShown: false
    }
  },
  ReceiverDetails: {
    screen: ReceiverDetails,
    navigationOptions: {
      headerShown: false
    }
  }
}, {
  initialRouteName: "DonateList"
});

export default StackNav