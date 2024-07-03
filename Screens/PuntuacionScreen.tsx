import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

type RootStackParamList = {
  Puntuacion: { score: number };
};

type PuntuacionScreenRouteProp = RouteProp<RootStackParamList, 'Puntuacion'>;

const PuntuacionScreen = () => {
  const route = useRoute<PuntuacionScreenRouteProp>();
  const { score } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puntuaciones de Jugadores</Text>
      <Text style={styles.score}>Tu puntuación fue: {score}</Text>
      {/* Aquí puedes agregar más elementos de UI según necesites */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  score: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default PuntuacionScreen;
