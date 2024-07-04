import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { RegisterScreen } from "../Screens/RegisterScreen";
import { WelcomeScreen } from "../Screens/WelcomeScreen";
import { GameScreen } from "../Screens/GameScreen";
import { PuntuacionScreen } from "../Screens/PuntuacionScreen";
import { LoginScreen } from "../Screens/LoginScreen";


export type RootStackParamList = {
  Auth: undefined;
  WelcomeScreen: undefined;
  Game: undefined;
  Puntuacion: { score: number };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = () => (
  <Tab.Navigator>
    <Tab.Screen name="Login" component={LoginScreen} />
    <Tab.Screen name="Register" component={RegisterScreen} />
  </Tab.Navigator>
);

 export const MainNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Auth"
        component={AuthStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Puntuacion" component={PuntuacionScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

