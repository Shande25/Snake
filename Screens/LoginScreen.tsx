import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

const backgroundImage = { uri: 'https://e1.pxfuel.com/desktop-wallpaper/510/297/desktop-wallpaper-snake-art.jpg' }; 
const companyImage = { uri: 'https://i.blogs.es/5c2b53/snake/1366_2000.jpg' };
const gifImage = { uri: 'https://i.pinimg.com/originals/e5/93/ab/e593ab0589d5f1b389e4dfbcce2bce20.gif' };

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [titleColor, setTitleColor] = useState('#36BA98');

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleColor((prevColor) => (prevColor === '#36BA98' ? 'white' : '#36BA98'));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const goToRegister = () => {
    navigation.navigate('Register'); 
  };

  const handleLogin = () => {
    navigation.navigate('WelcomeScreen'); 
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.companyContainer}>
          <Image source={companyImage} style={styles.companyImage} />
        </View>
        <Text style={[styles.title, { color: titleColor }]}>Iniciar Sesión</Text>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
        <View style={styles.gifContainer}>
          <Image source={gifImage} style={styles.gif} />
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
    zIndex: 1,
  },
  companyImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    borderRadius: 45,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20, 
    textAlign: 'center',
  },
  label: {
    color: 'white',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white', // Fondo blanco para los inputs
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#36BA98',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    width: '100%', // Botones ocupan todo el ancho disponible
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  gifContainer: {
    position: 'absolute',
    bottom: 20, 
    width: '100%', 
    alignItems: 'center', 
  },
  gif: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});