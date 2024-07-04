import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';


type RootStackParamList = {
  Puntuacion: { score: number };
};

type PuntuacionScreenRouteProp = RouteProp<RootStackParamList, 'Puntuacion'>;

export const PuntuacionScreen = () => {
  const route = useRoute<PuntuacionScreenRouteProp>();
  const { score } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puntuaciones de Jugadores</Text>
      <Text style={styles.score}>Tu puntuación fue: {score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center', // Alinear texto al centro
  },
  score: {
    fontSize: 18,
    marginBottom: 10,
    color: '#666',
    textAlign: 'center', // Alinear texto al centro
  },
});

