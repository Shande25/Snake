import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import { db } from '../Config/Config';

type RootStackParamList = {
  Puntuacion: { score: number };
};

type PuntuacionScreenRouteProp = RouteProp<RootStackParamList, 'Puntuacion'>;

type Score = {
  username: string;
  score: number;
};

export const PuntuacionScreen: React.FC = () => {
  const route = useRoute<PuntuacionScreenRouteProp>();
  const { score: currentScore } = route.params;
  const [highScores, setHighScores] = useState<Score[]>([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchHighScores();
  }, []);

  const fetchHighScores = () => {
    const dbRef = ref(db, 'scores/');
    onValue(dbRef, (snapshot) => {
      const scores: Score[] = [];
      snapshot.forEach((childSnapshot) => {
        const { username, score } = childSnapshot.val();
        scores.push({ username, score });
      });
      scores.sort((a, b) => b.score - a.score); // Ordena los puntajes de mayor a menor
      setHighScores(scores.slice(0, 3)); // Obtén solo las 3 mejores puntuaciones
    });
  };

  const saveScore = () => {
    if (username.trim() === "") {
      alert("Por favor ingrese un nombre de usuario válido.");
      return;
    }

    const dbRef = ref(db, 'scores/');
    push(dbRef, {
      username: username,
      score: currentScore
    }).then(() => {
      setUsername(""); // Limpia el campo de nombre de usuario después de guardar
      fetchHighScores(); // Actualiza la lista de puntuaciones después de guardar
      alert("Puntuación guardada exitosamente.");
    }).catch((error) => {
      console.error("Error al guardar la puntuación: ", error);
      alert("Ocurrió un error al guardar la puntuación.");
    });
  };

  return (
    <ImageBackground source={{ uri: 'https://e1.pxfuel.com/desktop-wallpaper/510/297/desktop-wallpaper-snake-art.jpg' }} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Puntuaciones de Jugadores</Text>
          <Text style={styles.score}>Tu puntuación fue: {currentScore}</Text>
        </View>
        <FlatList
          style={styles.list}
          data={highScores}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.scoreItem}>
              <Text style={styles.scoreItemText}>{index + 1}. {item.username}: {item.score}</Text>
            </View>
          )}
        />
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ingresa tu nombre de usuario:</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={(text) => setUsername(text)}
            placeholder="Nombre de usuario"
          />
          <TouchableOpacity style={styles.button} onPress={saveScore}>
            <Text style={styles.buttonText}>Guardar Puntuación</Text>
          </TouchableOpacity>
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
    resizeMode: 'cover',
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#36BA98',
    textAlign: 'center',
  },
  score: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
  },
  list: {
    flex: 3,
    width: '100%',
  },
  scoreItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  scoreItemText: {
    fontSize: 16,
    color: 'white',
  },
  inputContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gifContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 20,
  },
  gif: {
    width: 200,
    height: 200,
  },
});


