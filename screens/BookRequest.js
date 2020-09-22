import React, { Component } from 'react'
import { Alert, KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import db from '../config';
import firebase from 'firebase'
import BookSearch from "react-native-google-books";
/**
 * 
 * 
 * 
 * 
 * This is wrong file
 */
export default class CurrentBookRequestScreen extends Component {
  constructor() {
    super();
    this.state = {
      user: firebase.auth().currentUser.email,
      bookName: '',
      reason: '',
      bookRequested: '',
      status: '',
      requestID: "",
      userID: '',
      docID: '',
      bookName: '',
      dataSource: '',
      showFlatList: false
    }
  }
  componentDidMount() {
    this.updateState();
    this.getBookRequest();
  }
  createRandomID = () => Math.random().toString().substring(7)
  addRequest = async (bookName, reason) => {
    let email = this.state.user
    let randomID = this.createRandomID();
    db.collection("requestedBooks").add({
      user: email,
      bookName: bookName,
      reason: reason,
      requestID: this.state.requestID,
      status: this.state.status,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      id: randomID,
    })
    await this.getBookRequest();
    db.collection("users").where("email", "==", this.state.user).get().then(snapshot => {
      snapshot.forEach(doc => {
        db.collection("users").doc(doc.id).update({
          bookRequested: true
        })
      })
    })
    this.setState({ bookName: '', reason: '', requestID: '' })
    Alert.alert("Book Requested Successfully")
  }
  receiveBook = (bookName) => {
    let email = this.state.user;
    let requestID = this.state.requestID;
    db.collection("receivedBooks").add({
      userID: email,
      bookName: bookName,
      requestID: requestID,
      status: this.state.status
    })
  }
  sendNotification = () => {
    db.collection("users").where("email", "==", this.state.user).get().then(snapshot => {
      snapshot.forEach(doc => {
        let fName = doc.data().firstName;
        let lName = doc.data().lastName;
        db.collection("requests").where("id", "==", this.state.requestID).get().then(snapshot => {
          snapshot.forEach(doc => {
            let donorID = doc.data().donorID;
            let bookName = doc.data().bookName;
            db.collection("notifications").add({
              targetedUserID: donorID,
              message: `${fName} ${lName} received the book ${bookName}!`,
              status: "unread",
              bookName: bookName
            })
          })
        })
      })
    })
  }
  getBookRequest = () => {
    const rb = db.collection("requestedBooks").where("user", "==", this.state.user).get().then(snapshot => {
      snapshot.forEach(doc => {
        if (doc.data().status !== "received") {
          this.setState({
            requestID: doc.data().id,
            bookName: doc.data().bookName,
            status: doc.data().status,
            docID: doc.id
          })
        }
      })
    })
  }
  updateState = () => {
    db.collection('users').where("email", "==", this.state.user).onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        this.setState({
          bookRequested: doc.data().bookRequested,
          docID: doc.id
        })
      })
    })
  }
  updateRequestStatus = () => {
    db.collection("requestedBooks").doc(this.state.docID).update({
      status: 'received'
    })
    db.collection("users").where("email", "==", this.state.user).get().then(snapshot => {
      snapshot.forEach(doc => {
        db.collection("users").doc(doc.id).update({
          bookRequested: false
        })
      })
    })
  }
  render() {
    if (this.state.bookRequested == true) {
      return (
        <View>
          <Text> Book Name:  {this.state.bookName} </Text>
          <Text> Request Status: {this.state.status} </Text>
          <TouchableOpacity onPress={() => {
            this.sendNotification();
            this.updateRequestStatus();
            this.receiveBook(this.state.bookName)
          }}>
            <Text>I received the book!</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View>
          <Header title="Request Books" navigation={this.props.navigation} />

        </View>
      )
    }
  }
}
