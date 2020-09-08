import React from 'react';

import { View, Text } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';

import AppTabNavigator from './AppTabNavigator';
import MyDonations from '../screens/MyDonations'
import SettingsScreen from '../screens/Settings';
import SideBar from './CustomSideBar';

const DrawerNavigator = createDrawerNavigator({
  Home: { screen: AppTabNavigator },
  "My Donations": { screen: MyDonations },
  Settings: { screen: SettingsScreen }
}, {
  contentComponent: SideBar,
  initialRouteName: "Home"
})

export default DrawerNavigator;