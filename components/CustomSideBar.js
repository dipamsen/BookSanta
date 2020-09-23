import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements'
import { DrawerItems } from 'react-navigation-drawer';
import * as ImagePicker from 'expo-image-picker'
import db from '../config'
import firebase from 'firebase';

export default class Drawer extends React.Component {
  constructor() {
    super();
    this.state = {
      userID: firebase.auth().currentUser.email,
      image: "#",
      name: '',
      docID: '',
    }
  }
  componentDidMount() {
    this.fetchImage(this.state.userID);
    this.getUserProfile();
  }
  choosePicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })
    if (!cancelled) {
      this.uploadImage(uri, this.state.userID)
    }
  }
  uploadImage = async (uri, id) => {
    let response = await fetch(uri);
    let blob = await response.blob();
    let ref = firebase.storage().ref().child("userProfile/" + id);
    ref.put(blob).then(response => {
      console.log(response)
      alert("Photo has been uploaded")
      this.fetchImage(id)
    }).catch(err => alert(err.message))
  }
  fetchImage = (id) => {
    let ref = firebase.storage().ref().child("userProfile/" + id).getDownloadURL().then(url => {
      this.setState({ image: url })
    }).catch(err => {
      console.log(err)
      this.setState({ image: "#" })
    })
  }
  getUserProfile = () => {
    db.collection("users").where("email", "==", this.state.userID).onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        this.setState({
          name: doc.data().firstName + ' ' + doc.data().lastName,
          docID: doc.id,
          image: doc.data().image
        })
      })
    })
  }
  render() {
    return (
      <View style={{ marginTop: 40 }}>
        <Text style={{ marginTop: 8, fontSize: 40, textAlign: 'center' }}>
          Book Santa!</Text>

        <Avatar
          rounded
          source={{ uri: this.state.image }}
          size="xlarge"
          title="DS"
          onAccessoryPress={this.choosePicture}
          showEditButton
          showAccessory
          containerStyle={{
            margin: 20,
            alignSelf: 'center',
            borderWidth: 1
          }}
        />
        <Text style={{ fontSize: 24, textAlign: 'center' }}>
          {this.state.name}
        </Text>
        <DrawerItems {...this.props} />
        <View>
          <TouchableOpacity
            style={{ width: "90%", backgroundColor: "red", borderRadius: 8, padding: 8, alignSelf: "center" }}
            onPress={() => {
              this.props.navigation.navigate('LoginScreen');
              firebase.auth().signOut();
            }}>
            <Text style={{ textAlign: 'center', fontSize: 16, color: "#fff", fontWeight: 'bold' }}>
              LOG OUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}