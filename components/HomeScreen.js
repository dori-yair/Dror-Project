import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  Button,
  View,
  AppRegistry,
} from 'react-native'


 
export function HomeScreen({ navigation }) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 24 }} >שלום וברוך הבא</Text>
        
        <Button
          title="הוסף אירוע"
          onPress={() => navigation.navigate('הוסף אירוע')}
        />
        <Button
          title="רשימת אירועים"
          onPress={() => navigation.navigate('רשימת אירועים')}
        />
         <Button
          title="בלתמ"
          onPress={() => navigation.navigate('בלתמ')}
        />
      </View>
    );
  }
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: '#F5FCFF',
    },
    button:{
        backgroundColor: '#f3f3f3',
        borderColor: 'blue',
      borderWidth:2
    }
  });

  export default HomeScreen;
  //AppRegistry.registerComponent( 'HomeScreen',() => HomeScreen)