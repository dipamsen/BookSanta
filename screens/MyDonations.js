import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { ListItem } from 'react-native-elements'

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
    this.requestRef = db.collection("donations")
    this.requestRef.where("donorID", "==", this.state.userID).onSnapshot(snapshot => {
      let allDonations = snapshot.docs.map(doc => {
        this.setState({
          allDonations: [...this.state.allDonations, doc.data()]
        })
      });
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
          <TouchableOpacity>
            <Text>SEND BOOK</Text>
          </TouchableOpacity>
        }
      />
    )
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