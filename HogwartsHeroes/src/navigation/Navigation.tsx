import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CharacterListScreen from '../screens/CharacterListScreen'; 
import React from 'react';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Hogwarts Heroes" component={CharacterListScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}
