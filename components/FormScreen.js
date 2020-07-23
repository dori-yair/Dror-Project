import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
 

class FormScreen extends Component {
  //state = {}
    
  constructor(props) {
    super(props);
   }

  componentWillUnmount() {
    
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to add new event screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCff',

  },

});

export default FormScreen;