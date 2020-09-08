import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Card, Header, Icon } from 'react-native-elements'

import db from '../config';
import firebase from 'firebase'

export default class ReceiverDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.email,
      receiverID: this.props.navigation.getParams("details")["email"],
      requestID: this.props.navigation.getParams("details")["id"],
      bookName: this.props.navigation.getParams("details")["bookName"],
      reason: this.props.navigation.getParams("details")["reason"],
      receiverName: '',
      receiverContact: '',
      receiverAddress: '',
      receiverRequestDocID: '',
    }
  }
  fetchReceiverData = () => {
    db.collection("users").where("email", "==", this.state.receiverID).get().then(snapshot => {
      snapshot.forEach(doc => {
        let data = doc.data()
        this.setState({
          receiverName: data.firstName,
          receiverContact: data.contactNo,
          receiverAddress: data.address,
        })
      })
    })
  }
  render() {
    return (
      <View>
        <Header
          leftComponent={
            <Icon name="arrow-icon-left" type="feather" color="#fff" onPress={() => {
              this.props.navigation.goBack();
            }} />
          }
          centerComponent={{
            text: "Donate Books!"
          }}
          backgroundColor="red"
        />
        <Text>Details of Receiver</Text>
        <Card>
          <Text>Name: {this.state.receiverName}</Text>
        </Card>
        <Card>
          <Text>Contact No.: {this.state.receiverContact}</Text>
        </Card>
        <Card>
          <Text>Address: {this.state.receiverAddress}</Text>
        </Card>
        <View>
          {this.state.userID !== this.state.receiverID ? (
            <TouchableOpacity onPress={() => {
              this.updateBookStatus();
              this.props.navigation.navigate("MyDonations")
            }}>
              <Text>I want to Donate!</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    )
  }
  updateBookStatus = () => {
    db.collecion("donations").add({
      bookName: this.state.bookName,
      donorID: this.state.userID,
      requestID: this.state.requestID,
      status: "Donor Interested",
      requestedBy: this.state.receiverName
    })
  }
}