import React, { Component,useState } from 'react';
import { StyleSheet, SectionList, Text, View, TextInput, Button,TouchableHighlight, Pressable } from 'react-native';
import * as Calendar from 'expo-calendar';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import EventListScreen from './EventListScreen';

const TIME_FORMAT = "DD-MM-YY HH:mm"

class DeleteEventScreen extends Component {
  constructor(props) {
    super(props);
   
  }

   render() {
    return (
      <View >
        <Text>events count: {this.props.route.params['eventIds'].length} </Text>
        
        <Button title="Delete" />
        <Button title="Cancel" />
      </View>
    );
  }
}

export default DeleteEventScreen;