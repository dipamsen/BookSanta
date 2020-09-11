import React from 'react';
import { View, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert, Text, StyleSheet } from 'react-native';

import MyHeader from '../components/Header';

import firebase from 'firebase';
import db from '../config'

export default class RequestScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      bookName: '',
      description: '',
      emailID: firebase.auth().currentUser.email
    }
  }
  createUniqueID = () => Math.random().toString(36).substring(7)
  addRequest = (bookName, reason) => {
    let email = this.state.emailID;
    let id = this.createUniqueID();
    db.collection("requests").add({
      bookName: bookName,
      reason: reason,
      email: email,
      id: id,
    })
    this.setState({ bookName: '', description: '' });
    return Alert.alert("Book Requested Successfully.")
  }
  render() {
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
            onChangeText={(text) => { this.setState({ bookName: text }) }}
          />
          <TextInput
            placeholder="Why do you want this book?"
            style={styles.inp}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={this.state.description}
            onChangeText={(text) => { this.setState({ description: text }) }}
          />
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