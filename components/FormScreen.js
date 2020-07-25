import React, { Component,useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button,TouchableHighlight } from 'react-native';


class FormScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'title',
      eventStart:'',
      eventEnd:'',
    };
   }

  componentWillUnmount() {}
  OnSubmit(){}
  render() {
    return (

      <View style={styles.container}>
        
        <TextInput
          placeholder="שם האירוע"  
          style={styles.inputText}
          onChangeText={ (text)=> this.setState({title:text})}
        />
        
        <Button
          title={'הוסף'}
          style={styles.input}
          
        />
      </View>


    );
  }
}


const styles = StyleSheet.create({
  
  container: {
    flex: 1,
        alignItems: 'flex-start',
    backgroundColor: '#F5FCff',
    borderWidth: 2,
    padding: 10,
  },
  input:{
    backgroundColor: 'skyblue',
  },
  inputText: {
    padding: 10,
    textAlign:'right',
    borderWidth: 1,
    borderColor: 'skyblue',
    borderTopColor:'transparent',
    borderRightColor:'transparent',
    borderLeftColor:'transparent',
    margin: 20,
    width:270,
  },
});

export default FormScreen;