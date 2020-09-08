import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Nav from './components/AppTabNavigator'
import DrawerNav from './components/AppDrawerNavigator'
import LoginScreen from './screens/LoginScreen'

import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs';

export default class App extends React.Component {
  render() {
    return (
      <MainApp />
    );
  }
}

const SwitchNav = createSwitchNavigator({
  LoginScreen: { screen: LoginScreen }, Drawer: { screen: DrawerNav }
})

const MainApp = createAppContainer(SwitchNav)