import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { DrawerItems } from 'react-navigation-drawer';

import firebase from 'firebase';

export default class Drawer extends React.Component {
  render() {
    return (
      <View>
        <DrawerItems {...this.props} />
        <View>
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate('LoginScreen');
            firebase.auth().signOut();
          }}>
            <Text>LOG OUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}