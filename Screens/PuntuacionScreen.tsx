import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ref, onValue, push, set } from 'firebase/database';
import { db } from '../Config/Config';

type RootStackParamList = {
  Puntuacion: { score: number };
};

type PuntuacionScreenRouteProp = RouteProp<RootStackParamList, 'Puntuacion'>;

interface ScoreData {
  id: string;
  username: string;
  score: number;
}

const PuntuacionScreen: React.FC = () => {
  const route = useRoute<PuntuacionScreenRouteProp>();
  const { score } = route.params;
  const [username, setUsername] = useState('');
  const [scores, setScores] = useState<ScoreData[]>([]);

  useEffect(() => {
    const scoresRef = ref(db, 'scores');
    const unsubscribe = onValue(scoresRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const scoresArray: ScoreData[] = Object.keys(data).map((key) => ({
          id: key,
          username: data[key].username,
          score: data[key].score,
        }));
        setScores(scoresArray.sort((a, b) => b.score - a.score));
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSaveScore = () => {
    if (username.trim() === '') {
      Alert.alert('Error', 'Por favor ingrese un nombre de usuario.', [{ text: 'Aceptar' }]);
      return;
    }

    const newScoreRef = push(ref(db, 'scores'));
    set(newScoreRef, {
      username: username.trim(),
      score: score,
    });

    setUsername('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puntuaciones</Text>
      <Text style={styles.subtitle}>Tu puntuación: {score}</Text>
      <FlatList
        data={scores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.scoreItem}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu nombre de usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="words"
      />
      <TouchableOpacity style={styles.button} onPress={handleSaveScore}>
        <Text style={styles.buttonText}>Guardar Puntuación</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2E7D32',
    textAlign: 'center',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 22,
    marginBottom: 25,
    color: '#555',
    textAlign: 'center',
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  username: {
    fontSize: 18,
    color: '#555',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#36BA98',
  },
  input: {
    height: 45,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#36BA98',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PuntuacionScreen;
