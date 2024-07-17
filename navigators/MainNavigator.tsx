import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "../Screens/WelcomeScreen";
import { RootStackParamList } from "../components/Types";
import RegisterScreen from "../Screens/RegisterScreen";
import LoginScreen from "../Screens/LoginScreen";
import GameScreen from "../Screens/GameScreen";
import PuntuacionScreen from "../Screens/PuntuacionScreen";
import { ProfileScreen } from "../Screens/PerfilScreen";






const Stack = createStackNavigator<RootStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Puntuacion" component={PuntuacionScreen} />
        <Stack.Screen name="Perfil" component={ProfileScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
