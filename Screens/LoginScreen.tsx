import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Config/Config';

const backgroundImage = { uri: 'https://e1.pxfuel.com/desktop-wallpaper/510/297/desktop-wallpaper-snake-art.jpg' };
const companyImage = { uri: 'https://i.blogs.es/5c2b53/snake/1366_2000.jpg' };

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Función para manejar el inicio de sesión
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate('Welcome');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // Función para limpiar los campos de correo y contraseña
  const clearFields = () => {
    setEmail('');
    setPassword('');
  };

  // Se ejecuta al enfocar nuevamente la pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      clearFields();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Image source={companyImage} style={styles.companyImage} />
        <Text style={styles.title}>Iniciar Sesión</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#ccc"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          secureTextEntry
          placeholderTextColor="#ccc"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  companyImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#fff',
    borderRadius: 5, // Añadir borde redondeado a los inputs
  },
  button: {
    backgroundColor: '#007bff',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold', // Añadir negrita al texto de los botones
  },
  registerButton: {
    backgroundColor: '#28a745', // Diferente color para el botón de registro
  },
});


