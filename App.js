import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {StyleSheet} from 'react-native';

import AddEventScreen from './components/AddEventScreen';
import HomeScreen from './components/HomeScreen'
import EventListScreen from './components/EventListScreen';

const Stack = createStackNavigator();

export default function App () {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="מסך הבית">
      <Stack.Screen name="מסך הבית" component={HomeScreen} />
      <Stack.Screen name="הוסף אירוע" component={AddEventScreen} />
      <Stack.Screen name="רשימת אירועים" component={EventListScreen} />
    </Stack.Navigator>
  </NavigationContainer>

  );
};