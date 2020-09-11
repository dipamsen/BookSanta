import React from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableHighlight } from 'react-native';

import { ListItem, Icon } from 'react-native-elements'
import SwipeListView from 'react-native-swipe-list-view'
// Swipable FlatList Component
import db from '../config'
export default class SwipableFlatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: this.props.notifications
    }
  }
  onSwipeValueChange = swipeData => {
    /** Comment Comment// */
    /dipam/;
  }
  render() {

  }
}


