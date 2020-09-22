import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';

import db from '../config';
import firebase from 'firebase';

import MyHeader from '../components/Header';

import { ListItem } from 'react-native-elements';

export default class DonationScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      requestedBookList: []
    }
    this.requestRef = null;
  }
  fetchData = () => {
    this.requestRef = db.collection("requests");
    this.requestRef.onSnapshot(snapshot => {
      let data = snapshot.docs.map(document => document.data());
      this.setState({ requestedBookList: data })
    })
  };
  componentDidMount() {
    this.fetchData();
  }
  // componentWillUnmount() {
  //   this.requestRef();
  // }
  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item, index }) => {
    return (
      <ListItem
        key={index}
        title={item.bookName}
        subtitle={item.reason}
        titleStyle={{
          color: "red"
        }}
        leftElement={
          <Image
            source={{
              uri: item.imageLink
            }}
            style={{
              width: 80,
              height: 80
            }}
          />
        }
        rightElement={
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate("ReceiverDetails", {
              details: item
            });
          }}>
            <Text>VIEW</Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    )
  }
  render() {
    return (
      <View>
        <MyHeader title="Donate Books" navigation={this.props.navigation} />
        <View>
          {this.state.requestedBookList.length == 0 ? (
            <View>
              <Text>List of All Requested Books</Text>
            </View>
          ) : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.requestedBookList}
                renderItem={this.renderItem}
              />
            )}
        </View>
      </View>
    )
  }
}