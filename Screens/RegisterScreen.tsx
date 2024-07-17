import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { auth } from '../Config/Config'; 

const backgroundImage = { uri: 'https://e1.pxfuel.com/desktop-wallpaper/510/297/desktop-wallpaper-snake-art.jpg' };
const companyImage = { uri: 'https://i.blogs.es/5c2b53/snake/1366_2000.jpg' };
const gifImage = { uri: 'https://i.gifer.com/4Snj.gif' };

export const RegisterScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [titleColor, setTitleColor] = useState('#36BA98');

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setTitleColor(prevColor => prevColor === '#36BA98' ? '#FFFFFF' : '#36BA98');
    }, 3000);

    return () => clearInterval(colorInterval);
  }, []);

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegistration = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const database = getDatabase();
      await set(ref(database, `users/${user.uid}`), {
        username: username,
        email: email,
        name: name,
        age: age,
      });

      Alert.alert('Mensaje', 'Información guardada correctamente');
      setUsername('');
      setPassword('');
      setEmail('');
      setName('');
      setAge('');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      Alert.alert('Error', 'Hubo un error al registrar el usuario');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.companyContainer}>
          <Image source={companyImage} style={styles.companyImage} />
        </View>
        <View style={styles.container}>
          <Text style={[styles.title, { color: titleColor }]}>Registro</Text>
          <Text style={styles.label}>Nombre de usuario:</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={(text) => setUsername(text)}
            placeholder="Introduce tu nombre de usuario"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
          />
          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Introduce tu nombre"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
          />
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Introduce tu email"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
          />
          <Text style={styles.label}>Contraseña:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            placeholder="Introduce tu contraseña"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
          />
          <Text style={styles.label}>Edad:</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={(text) => setAge(text)}
            keyboardType="numeric"
            placeholder="Introduce tu edad"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
          />
          <TouchableOpacity style={styles.button} onPress={handleRegistration}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={goToLogin}>
            <Text style={styles.secondaryButtonText}>Ya tengo cuenta. Iniciar sesión</Text>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 120, 
  },
  companyContainer: {
    position: 'absolute',
    top: 20, 
    left: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    borderRadius: 45,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginLeft: 5,
    fontSize: 16,
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
  },
  button: {
    backgroundColor: '#36BA98',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    marginTop: 20,
  },
  secondaryButtonText: {
    color: '#36BA98',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gifContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  gif: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default RegisterScreen;
