import React from 'react';

import { View, Text } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';

import AppTabNavigator from './AppTabNavigator';
import MyDonations from '../screens/MyDonations'
import SettingsScreen from '../screens/Settings';
import Notifications from '../screens/Notifications'
import SideBar from './CustomSideBar';

const DrawerNavigator = createDrawerNavigator({
  Home: { screen: AppTabNavigator },
  "My Donations": { screen: MyDonations },
  Notifications: { screen: Notifications },
  Settings: { screen: SettingsScreen },
}, {
  contentComponent: SideBar,
  initialRouteName: "Home"
})

export default DrawerNavigator;