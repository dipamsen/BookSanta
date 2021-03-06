import React from 'react';

import { View, Text, FlatList } from 'react-native'
import { ListItem, Icon } from 'react-native-elements';
import MyHeader from '../components/Header'
import SwipableNotifications from '../components/SwipableFlatList'
import firebase from 'firebase';
import db from '../config'

export default class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.email,
      notifications: []
    }
  }
  componentDidMount() {
    this.getNotifications();
  }
  getNotifications = () => {
    db.collection('notifications').where("status", "==", "unread").where("receiverID", "==", this.state.userID).onSnapshot(snapshot => {
      let notifications = [];
      snapshot.docs.map(doc => {
        notifications.push({ ...doc.data(), id: doc.id });
      })
      this.setState({ notifications })
    })
  }
  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item, index }) => {
    return <ListItem
      key={index}
      leftIcon={<Icon name="book" color="#000" />}
      title={item.bookName}
      subtitle={item.message}
      bottomDivider
    />
  }
  render() {
    return (
      <View>
        <Text>Notifications</Text>
        <MyHeader title="Notifications" navigation={this.props.navigation} />
        {
          this.state.notifications.length == 0 ?
            (<Text>No Notifications!</Text>) :
            (
              <SwipableNotifications
                notifications={this.state.notifications}
              />
            )
        }

      </View>
    )
  }
}