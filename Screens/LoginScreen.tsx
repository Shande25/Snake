import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Config/Config';

const backgroundImage = { uri: 'https://e1.pxfuel.com/desktop-wallpaper/510/297/desktop-wallpaper-snake-art.jpg' };
const companyImage = { uri: 'https://i.blogs.es/5c2b53/snake/1366_2000.jpg' };
const gifImage = { uri: 'https://i.pinimg.com/originals/e5/93/ab/e593ab0589d5f1b389e4dfbcce2bce20.gif' };

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [titleColor, setTitleColor] = useState('#36BA98'); // Starting with the original green color

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        Alert.alert('Acceso Correcto', 'Has iniciado sesión correctamente.');
        navigation.navigate('Welcome');
      })
      .catch((error) => {
        let errorMessage;
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'El formato del correo electrónico no es válido.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Este usuario ha sido deshabilitado.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Usuario no encontrado.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Contraseña incorrecta.';
            break;
          default:
            errorMessage = 'Ocurrió un error. Por favor, intenta de nuevo.';
        }
        setError(errorMessage);
      });
  };

  const clearFields = () => {
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      clearFields();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleColor((prevColor) => (prevColor === '#36BA98' ? 'white' : '#36BA98'));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image source={companyImage} style={styles.companyImage} />
          <Text style={[styles.title, { color: titleColor, fontFamily: 'Roboto', fontSize: 24, fontWeight: 'bold' }]}>Iniciar Sesión</Text>
          {error ? <Text style={[styles.error, { fontFamily: 'Roboto', fontSize: 16 }]}>{error}</Text> : null}
          <TextInput
            style={[styles.input, { fontFamily: 'Roboto', fontSize: 16 }]}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={[styles.input, { fontFamily: 'Roboto', fontSize: 16 }]}
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            secureTextEntry
            placeholderTextColor="#ccc"
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={[styles.buttonText, { fontFamily: 'Roboto', fontSize: 18 }]}>Ingresar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
            <Text style={[styles.buttonText, { fontFamily: 'Roboto', fontSize: 18 }]}>Registrarse</Text>
          </TouchableOpacity>
          <View style={styles.gifContainer}>
            <Image source={gifImage} style={styles.gif} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 120, // Adjust as needed
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    backgroundColor: '#36BA98',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  gifContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  gif: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default LoginScreen;
