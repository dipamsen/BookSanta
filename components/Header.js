import React from 'react';
import { View, Text } from 'react-native';
import { Header, Icon, Badge } from 'react-native-elements';
import db from '../config'
import firebase from 'firebase'

class BellIconWithBadge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      user: firebase.auth().currentUser.email
    }
  }
  componentDidMount() {
    this.getUnreadNotificationCount()
  }
  getUnreadNotificationCount() {
    db.collection("notifications").where("status", "==", "unread").where("receiverID", "==", this.state.user)
      .onSnapshot(snapshot => {
        let allNotifications = snapshot.docs.map(doc => doc.data())
        this.setState({ value: allNotifications.length })
      })
  }
  render() {
    return (
      <View>
        <Icon name="bell" type="font-awesome" color="#fff" onPress={() => this.props.navigation.navigate("Notifications")} />
        <Badge value={this.state.value} containerStyle={{ position: "absolute", top: -4, right: -4 }} />
      </View>
    )
  }
}

const MyHeader = props => {
  return (
    <Header
      leftComponent={
        <Icon onPress={() => { props.navigation.toggleDrawer() }} name="bars" type="font-awesome" color="#fff" />
      }
      centerComponent={{
        text: props.title,
        style: {
          fontSize: 24,
          color: '#fff',
          fontWeight: "bold"
        }
      }}
      rightComponent={
        <BellIconWithBadge {...props} />
      }
      backgroundColor="red"
    />
  )
}

export default MyHeader;