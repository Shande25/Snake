import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { LoginScreen } from '../Screens/LoginScreen';
import { RegisterScreen } from '../Screens/RegisterScreen';
import { GameScreen } from '../Screens/GameScreen';
import { PuntuacionScreen } from '../Screens/PuntuacionScreen';
import { RootStackParamList } from '../components/Types';
import WelcomeScreen from '../Screens/WelcomeScreen';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
