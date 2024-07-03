import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text>Bienvenido</Text>
      <Button
        title="Start Game"
        onPress={() => navigation.navigate('Game')} 
        color="#841584" // Cambia el color según tus preferencias
      />
      <Button
        title="Ver Puntuación"
        onPress={() => navigation.navigate('Puntuacion', { score: 0 })} // Aquí puedes pasar el score inicial si es necesario
        color="#841584" // Cambia el color según tus preferencias
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%', // Ajusta el ancho según tus necesidades
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', // Cambia el color del texto según tus preferencias
  },
});
