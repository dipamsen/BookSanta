import React from 'react';
import { View, Text } from 'react-native';
import { Header, Icon } from 'react-native-elements';

const MyHeader = props => {
  return (
    <Header
      leftComponent={
        <Icon name="menu" type="font-awesome-5" color="#fff" />
      }
      centerComponent={{
        text: props.title,
        style: {
          fontSize: 24,
          color: '#fff',
          fontWeight: "bold"
        }
      }}
      backgroundColor="red"
    />
  )
}

export default MyHeader;