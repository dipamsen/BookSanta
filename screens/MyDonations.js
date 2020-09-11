import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { ListItem, Icon } from 'react-native-elements'

import db from '../config'
import firebase from 'firebase'
import MyHeader from '../components/Header'

export default class MyDonations extends React.Component {
  constructor() {
    super();
    this.state = {
      allDonations: [],
      userID: firebase.auth().currentUser.email
    }
    this.requestRef = null;
  }
  getAllDonations = () => {
    this.requestRef = db.collection("donations").where("donorID", "==", this.state.userID).onSnapshot(snapshot => {
      let allDonations = snapshot.docs.map(doc => ({
        docID: doc.id,
        ...doc.data()
      }));
      this.setState({ allDonations: allDonations })
    });
  }
  componentDidMount() {
    this.getAllDonations();
  }
  componentWillUnmount() {
    this.requestRef();
  }
  keyExtractor = (item, index) => {
    return index
  }
  renderItem = (item, i) => {
    return (
      <ListItem
        key={i}
        title={item.bookName}
        subTitle={"Requested By: " + item.requesterName + "\nStatus: " + item.status}
        leftElement={<Icon name="book" type="font-awesome" color="red" />}
        titleStyle={{
          color: "#ff0000"
        }}
        rightElement={
          <TouchableOpacity onPress={() => {
            this.sendBook(item)
          }}>
            <Text>SEND BOOK</Text>
          </TouchableOpacity>
        }
      />
    )
  }
  sendNotification = (bookDetails, requestStatus) => {
    let requestID = bookDetails.requestID;
    let donorID = bookDetails.donorID;
    db.collection("notifications").where("requestID", "==", requestID).where("donorID", "==", donorID).get().then(snapshot => {
      snapshot.forEach(doc => {
        let message = "";
        if (requestStatus == "book sent") {
          message = this.state.donorName + " sent you the book!"
        } else {
          message = this.state.donorName + " is interested in donating the book!"
        }
        db.collection("notifications").doc(doc.id).update({
          message: message,
          status: "unread",
          date: firebase.firestore.FieldValue.serverTimestamp()
        })
      })
    })
  }
  sendBook = (bookDetails) => {
    if (bookDetails.requestStatus == "book sent") {
      let requestStatus = "donor interested";
      db.collection("donations").doc(bookDetails.docID).update({
        status: requestStatus
      })
      this.sendNotification(bookDetails, requestStatus);
    } else {
      let requestStatus = "book sent"
      db.collection("donations").doc(bookDetails.docID).update({
        status: requestStatus
      })
      this.sendNotification(bookDetails, requestStatus)
    }
  }
  render() {
    return (
      <View>
        <MyHeader
          navigation={this.props.navigation}
          title="My Donations"
        />
        <View>
          {this.state.allDonations.length == 0 ? (
            <Text>List of Donations</Text>
          ) : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allDonations}
                renderItem={this.renderItem}
              />
            )}
        </View>
        <View></View>
      </View>
    )
  }
}