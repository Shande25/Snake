import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import WelcomeScreen from '../Screens/WelcomeScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import { RootStackParamList } from '../components/Types';
import { PuntuacionScreen } from '../Screens/PuntuacionScreen';
import { RegisterScreen } from '../Screens/RegisterScreen';
import { GameScreen } from '../Screens/GameScreen';
import { LoginScreen } from '../Screens/LoginScreen';
import CamaraScreen from '../Screens/CamaraScreen';

const Stack = createStackNavigator<RootStackParamList>();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Puntuacion" component={PuntuacionScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Camara" component={CamaraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
