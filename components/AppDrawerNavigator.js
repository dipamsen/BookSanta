import React from 'react';

import { View, Text } from 'react-native';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Icon } from 'react-native-elements'
import AppTabNavigator from './AppTabNavigator';
import MyDonations from '../screens/MyDonations'
import SettingsScreen from '../screens/Settings';
import Notifications from '../screens/Notifications'
import SideBar from './CustomSideBar';

const DrawerNavigator = createDrawerNavigator({
  Home: {
    screen: AppTabNavigator, navigationOptions: {
      drawerIcon: <Icon name="home" />
    }
  },
  "My Donations": {
    screen: MyDonations, navigationOptions: {
      drawerIcon: <Icon name="user-alt" type="font-awesome-5" />
    }
  },
  Notifications: {
    screen: Notifications, navigationOptions: {
      drawerIcon: <Icon name="bell" type="font-awesome-5" />
    }
  },
  Settings: {
    screen: SettingsScreen, navigationOptions: {
      drawerIcon: <Icon name="gear" type="font-awesome" />
    }
  },
}, {
  contentComponent: SideBar,
  initialRouteName: "Home",
  drawerType: "slide",
  edgeWidth: 40,
  contentOptions: {
    activeTintColor: "red"
  }
})

export default DrawerNavigator;