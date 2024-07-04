import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type RootStackParamList = {
  Puntuacion: { score: number };
};

type PuntuacionScreenRouteProp = RouteProp<RootStackParamList, 'Puntuacion'>;

export const PuntuacionScreen: React.FC = () => {
  const route = useRoute<PuntuacionScreenRouteProp>();
  const { score } = route.params;

  return (
    <ImageBackground source={{ uri: 'https://e1.pxfuel.com/desktop-wallpaper/510/297/desktop-wallpaper-snake-art.jpg' }} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Puntuaciones de Jugadores</Text>
          <Text style={styles.score}>Tu puntuación fue: {score}</Text>
        </View>
        <View style={styles.gifContainer}>
          <Image source={{ uri: 'https://i.gifer.com/4Snj.gif' }} style={styles.gif} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' as per your preference
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Espacio adicional para bajar el texto
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#36BA98', // Verde original
    textAlign: 'center',
  },
  score: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
  gifContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  gif: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});


