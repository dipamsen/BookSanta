import React from 'react';
import { View, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert, Text, StyleSheet, FlatList } from 'react-native';

import MyHeader from '../components/Header';

import firebase from 'firebase';
import db from '../config'
import BookSearch from 'react-native-google-books/BookSearch';

const API_KEY = "AIzaSyD4fw1-7s3O6sZ-NriHQqnhzyU4QuChCzI"


export default class RequestScreen extends React.Component {
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
      showFlatList: false,
      imageLink: ''
    }
  }
  componentDidMount() {
    this.updateState();
    this.getBookRequest();
  }
  createUniqueID = () => Math.random().toString(36).substring(7)
  addRequest = async (bookName, reason) => {
    let email = this.state.user;
    let id = this.createUniqueID();
    let books = await BookSearch.searchbook(bookName, API_KEY)
    db.collection("requestedBooks").add({
      bookName: bookName,
      reason: reason,
      email: email,
      id: id,
      status: "requested",
      date: firebase.firestore.FieldValue.serverTimestamp(),
      imageLink: books.data[0].volumeInfo.imageLinks.smallThumbnail
    })
    this.setState({ bookName: '', description: '' });
    db.collection("users").where("email", "==", this.state.user).get().then(snapshot => {
      snapshot.forEach(doc => {
        db.collection("users").doc(doc.id).update({
          bookRequested: true
        })
      })
    })
    this.setState({ bookName: '', requestID: '' })
    return Alert.alert("Book Requested Successfully.")
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

  async getBookDetails(bookName) {
    this.setState({
      bookName: bookName
    })
    if (bookName.length > 2) {
      let books = await BookSearch.searchbook(bookName, API_KEY)
      this.setState({
        dataSource: books.data,
        showFlatList: true
      })

    }
  }
  renderItem = (item, i) => {
    let obj = {
      title: item.volumeInfo.title,
      selfLink: item.selfLink,
      buyLink: item.saleInfo.buyLink,
      imageLink: item.volumeInfo.imageLinks
    }
    console.log(item.volumeInfo)
    return (
      <TouchableHighlight
        style={styles.option}
        activeOpacity={0.5}
        onPress={() => {
          this.setState({
            showFlatList: false,
            bookName: "Dummy" //item.volumeInfo.title
          })
        }}
      >
        <Text>{item.volumeInfo.title || "jshssj"}</Text>
      </TouchableHighlight>
    )
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
    const requestedBooks = db.collection("requestedBooks").where("email", "==", this.state.user).onSnapshot(snapshot => {
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
        <View style={{ marginTop: 20 }}>
          <MyHeader
            title="Requested Book"
            navigation={this.props.navigation}
          />
          <Text> Book Name:  {this.state.bookName} </Text>
          <Text> Request Status: {this.state.status} </Text>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => {
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
        <View style={{ flex: 1 }}>
          <MyHeader
            title="Request Books!"
            navigation={this.props.navigation} />
          <KeyboardAvoidingView style={styles.container}>
            <TextInput
              placeholder="Book Name"
              value={this.state.bookName}
              style={styles.inp}
              onChangeText={(text) => this.getBookDetails(text)}
              onClear={text => this.getBookDetails("")}
            />
            {this.state.showFlatList ?
              (
                <FlatList
                  data={this.state.dataSource}
                  renderItem={this.renderItem}
                  enableEmptySections={true}
                  keyExtractor={(item, index) => index.toString()}
                />
              ) : (
                <TextInput
                  placeholder="Why do you want this book?"
                  style={styles.inp}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  value={this.state.description}
                  onChangeText={(text) => { this.setState({ description: text }) }}
                />
              )}

            <TouchableOpacity
              onPress={() => { this.addRequest(this.state.bookName, this.state.description) }}
              style={styles.button}
            >
              <Text style={styles.btnTxt}>INITIALIZE REQUEST!</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View >
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "s"
  },
  inp: {
    borderWidth: 1,
    margin: 5,
    padding: 3,
    paddingHorizontal: 5,
    width: "80%",
    alignSelf: "center",
    fontSize: 16

    // alignSelf: "center"
  },
  button: {
    backgroundColor: "red",
    alignSelf: "center",
    width: "80%",
    padding: 6,
    borderRadius: 4,
    elevation: 3,
    margin: 10
  },
  btnTxt: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  }

})
