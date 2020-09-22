import React from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableHighlight } from 'react-native';

import { ListItem, Icon } from 'react-native-elements'
import { SwipeListView } from 'react-native-swipe-list-view'
// Swipable FlatList Component
import db from '../config'
export default class SwipableFlatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: this.props.notifications
    }
  }
  updateAsReadable = notifications => {
    db.collection("notifications").doc(notifications.id).update({
      status: "read"
    })
  }
  onSwipeValueChange = swipeData => {
    let notifications = this.state.notifications;
    const { key, value } = swipeData;
    if (value < -Dimensions.get("window").width) {
      const newData = [...notifications];
      const prevIndex = notifications.findIndex(item => item.key == key)
      this.updateAsReadable(notifications[prevIndex]);
      newData.splice(prevIndex, 1);
      this.setState({ notifications: newData })
    }
  }
  renderItem = (data) => (
    <ListItem
      leftElement={<Icon name="message" color="#000" />}
      title={data.item.bookName}
      titleStyle={{ color: "red", fontWeight: "bold" }}
      subtitle={data.item.reason}
      bottomDivider
    />
  )
  renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <Text style={styles.backTextWhite}>

      </Text>
    </View>
  )
  render() {
    return (
      <View>
        <SwipeListView
          disableRightSwipe
          data={this.state.notifications}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-Dimensions.get("window").width}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onSwipeValueChange={this.onSwipeValueChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1, },
  backTextWhite: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#29b6f6',
    flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 15,
  },
  backRightBtn: { alignItems: 'center', bottom: 0, justifyContent: 'center', position: 'absolute', top: 0, width: 100, },
  backRightBtnRight: { backgroundColor: '#29b6f6', right: 0, },
});
