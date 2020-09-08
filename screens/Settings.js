import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import MyHeader from '../components/Header'
// import 

import firebase from 'firebase';
import db from '../config'

export default class SettingsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      contactNo: '',
      address: '',
      emailID: '',
      docID: ""
    }
  }
  componentDidMount() {
    this.fetchDetails();
  }
  fetchDetails = () => {
    let userEmail = firebase.auth().currentUser.email;
    db.collection('users').where("email", "==", userEmail).get().then(snapshot => {
      snapshot.forEach(doc => {
        userData = doc.data();
        this.setState({
          firstName: userData.firstName,
          emailID: userData.email,
          lastName: userData.lastName,
          contactNo: userData.contactNo,
          address: userData.address,
          docID: doc.id
        })
      })
    })
  }
  updateDetails = () => {
    db.collection("users").doc(this.state.docID).update({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      contactNo: this.state.contactNo,
      address: this.state.address
    })
    Alert.alert("Profile Updated Successfully");
  }
  render() {
    return (
      <View style={styles.container}>
        <MyHeader title="Settings" navigation={this.props.navigation} />
        <ScrollView style={{ width: 180 }}>
          <KeyboardAvoidingView>
            <Text>Registration Form</Text>
            <TextInput
              style={styles.login}
              placeholder="First Name"
              value={this.state.firstName}
              maxLength={18}
              onChangeText={(text) => { this.setState({ firstName: text }) }}
            />
            <TextInput
              style={styles.login}
              placeholder="Last Name"
              value={this.state.lastName}
              maxLength={18}
              onChangeText={(text) => { this.setState({ lastName: text }) }}
            />
            <TextInput
              style={styles.login}
              placeholder="Contact No"
              value={this.state.contactNo}
              keyboardType="numeric"
              maxLength={10}
              onChangeText={(text) => { this.setState({ contactNo: text }) }}
            />
            <TextInput
              style={styles.login}
              placeholder="Address"
              value={this.state.address}
              multiline={true}
              onChangeText={(text) => { this.setState({ address: text }) }}
            />
            <TouchableOpacity onPress={this.updateDetails}>
              <Text>Save Changes</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  }
})