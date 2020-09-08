import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, ScrollView } from 'react-native';
import firebase from 'firebase';
import db from '../config'

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      address: '',
      contactNo: null,
      confirmPassword: '',
      isModalVisible: false
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <View style={{ alignItems: "center", margin: 20, backgroundColor: "white" }}>
            {this.showModal()}
          </View>
          <Text style={styles.heading}>Book Santa!</Text>
          <TextInput style={styles.login}
            value={this.state.username}
            placeholderTextColor="#444444"
            onChangeText={(text) => { this.setState({ username: text }) }}
            placeholder="Email ID"
            keyboardType="email-address"
          />
          <TextInput style={styles.login}
            value={this.state.password}
            placeholderTextColor="#444444"
            onChangeText={(text) => { this.setState({ password: text }) }}
            placeholder="Password"
            secureTextEntry={true}
          />
          <View style={styles.buttons}>
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => { this.login(this.state.username, this.state.password) }}>
              <Text style={styles.bttext}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => { this.setState({ isModalVisible: true }) }}>
              <Text style={styles.bttext}>SIGN-UP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  showModal = () => {
    return (
      <Modal animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}
        style={styles.modalContainer}
      >
        <View>
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
              <TextInput
                style={styles.login}
                value={this.state.username}
                onChangeText={(text) => { this.setState({ username: text }) }}
                placeholder="Email ID"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.login}
                value={this.state.password}
                onChangeText={(text) => { this.setState({ password: text }) }}
                placeholder="Password"
                secureTextEntry={true}
              />
              <TextInput
                style={styles.login}
                value={this.state.confirmPassword}
                onChangeText={(text) => { this.setState({ confirmPassword: text }) }}
                placeholder="Confirm Password"
                secureTextEntry={true}
              />
              <View>
                <TouchableOpacity style={styles.registerButton} onPress={() => { this.signup(this.state.username, this.state.password, this.state.confirmPassword) }}><Text style={styles.registerButtonText}>REGISTER</Text></TouchableOpacity>
                <TouchableOpacity style={styles.registerButton} onPress={() => { this.setState({ isModalVisible: false }) }}><Text style={styles.registerButtonText}>CANCEL</Text></TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    )
  }
  login = async (username, password) => {
    firebase.auth().signInWithEmailAndPassword(username, password).then((response) => {
      Alert.alert("Login successful!");
      this.props.navigation.navigate("Donate Books")
    }).catch((err) => {
      Alert.alert("Error", err.message);
      this.setState({ username: '', password: '' })
    })
  }
  signup = async (email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      Alert.alert("Password doesn't match")
      return;
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, password).then((response) => {
        return Alert.alert("User added successfully")
      }).catch((err) => {
        Alert.alert("Error", err.message);
      })
      db.collection("users").add({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.username,
        contact: this.state.contactNo,
        address: this.state.address
      })
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "lightgreen"
  },
  heading: {
    fontSize: 36,
    textAlign: "center",
    color: "green",
    fontWeight: "bold",

  },
  login: {
    width: '90%',
    margin: 10,
    padding: 5,
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderColor: "green"
  },
  button: {
    backgroundColor: "green",
    // flex: 1,
    borderWidth: 2,
    margin: 8,
    borderRadius: 10,
    elevation: 6,
    padding: 8
  },
  bttext: {
    textAlign: "center",
    fontSize: 18,
    color: "white",
  },
  main: {
    width: '90%',
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 4
  },
  profileContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  title: {
    fontSize: 65, fontWeight: '300', paddingBottom: 30, color: '#ff3d00'
  },
  loginBox: {
    width: 300, height: 40, borderBottomWidth: 1.5, borderColor: '#ff8a65', fontSize: 20, margin: 10, paddingLeft: 10
  },
  KeyboardAvoidingView: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  modalContainer: { flex: 1, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: "#ffff", marginRight: 30, marginLeft: 30, marginTop: 80, marginBottom: 80, },
  formTextInput: { width: "75%", height: 35, alignSelf: 'center', borderColor: '#ffab91', borderRadius: 10, borderWidth: 1, marginTop: 20, padding: 10 },
  registerButton: { width: 200, height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 10, marginTop: 30 }, registerButtonText: { color: '#ff5722', fontSize: 15, fontWeight: 'bold' }, cancelButton: { width: 200, height: 30, justifyContent: 'center', alignItems: 'center', marginTop: 5, },
  button: { width: 300, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 25, backgroundColor: "#ff9800", shadowColor: "#000", shadowOffset: { width: 0, height: 8, }, shadowOpacity: 0.30, shadowRadius: 10.32, elevation: 16, padding: 10 }, buttonText: { color: '#ffff', fontWeight: '200', fontSize: 20 }
})
