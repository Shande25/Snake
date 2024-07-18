import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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

export const PuntuacionScreen: React.FC = () => {
  const route = useRoute<PuntuacionScreenRouteProp>();
  const { score } = route.params;
  const [username, setUsername] = useState('');
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [titleColor, setTitleColor] = useState('#fff');
  const [scoreSaved, setScoreSaved] = useState(false); 
  const [saving, setSaving] = useState(false); // Nuevo estado de guardado pendiente

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleColor((prevColor) => (prevColor === '#fff' ? '#36BA98' : '#fff'));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveScore = () => {
    // Verificar si el puntaje ya ha sido guardado
    if (scoreSaved) {
      Alert.alert('Error', 'Ya has guardado tu nombre con este puntaje.', [{ text: 'Aceptar' }]);
      return;
    }

    // Verificar si hay un puntaje válido para guardar
    if (score === 0) {
      Alert.alert('Error', 'Primero juega para obtener un puntaje válido.', [{ text: 'Aceptar' }]);
      return;
    }

    if (username.trim() === '') {
      Alert.alert('Error', 'Por favor ingrese un nombre de usuario.', [{ text: 'Aceptar' }]);
      return;
    }

    setSaving(true); // Activar el estado de guardado pendiente

    const newScoreRef = push(ref(db, 'scores'));
    set(newScoreRef, {
      username: username.trim(),
      score: score,
    }).then(() => {
      setSaving(false); // Desactivar el estado de guardado pendiente
      setScoreSaved(true); // Marcar que el puntaje ha sido guardado
      setUsername('');
    });
  };

  const handleNewGame = () => {
    setScoreSaved(false); // Reiniciar para permitir un nuevo guardado
    // Reiniciar otros estados relacionados con iniciar un nuevo juego...
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: titleColor }]}>Puntuaciones</Text>
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
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="words"
        editable={!scoreSaved && !saving} // Deshabilitar la edición si el puntaje ya ha sido guardado o está en proceso de guardado
      />
      {saving ? (
        <ActivityIndicator size="large" color="#36BA98" /> // Indicador de carga
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSaveScore} disabled={scoreSaved || saving}>
          <Text style={styles.buttonText}>Guardar Puntuación</Text>
        </TouchableOpacity>
      )}
         </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: '#2E7D32',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 22,
    marginBottom: 25,
    color: '#fff',
    textAlign: 'center',
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    width: '100%',
    backgroundColor: '#111',
    borderRadius: 5,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  username: {
    fontSize: 18,
    color: '#fff',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#36BA98',
  },
  input: {
    height: 45,
    width: '100%',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#222',
    color: '#fff',
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
    marginBottom: 10, 
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PuntuacionScreen;