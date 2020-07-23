import React, {useState} from 'react';
import {View, Text, StyleSheet, Button, Platform} from 'react-native';
import FormScreen from './components/FormScreen';

export default function App () {
  return (
    <View style={styles.container}>
      <Text>Hi</Text>
        <FormScreen/> 
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button:{
      backgroundColor: '#f3f3f3'
  }
});