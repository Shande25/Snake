import { TouchableOpacity, Image, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes } from "firebase/storage";
import { storage } from '../Config/Config';

export default function GaleriaScreen() {
  const [imagen, setImagen] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', '¡Se requiere permiso para acceder a la biblioteca de medios!');
      }
    })();
  }, []);

  const pickImageFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', '¡Se requiere permiso para acceder a la cámara!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const subir = async () => {
    if (!imagen) {
      Alert.alert('No se ha seleccionado imagen', 'Por favor, selecciona una imagen primero.');
      return;
    }

    try {
      const storageRef = ref(storage, 'Taller/' + Date.now().toString());
      const response = await fetch(imagen);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      Alert.alert('Subida completa', '¡Tu imagen ha sido subida!');
      setImagen(null); // Limpiar la imagen después de subir
    } catch (error) {
      console.error('Error al subir:', error);
      Alert.alert('Error de subida', 'Hubo un error al subir tu imagen.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImageFromLibrary}>
        <Text style={styles.buttonText}>Seleccionar imagen de la galería</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={pickImageFromCamera}>
        <Text style={styles.buttonText}>Tomar una foto</Text>
      </TouchableOpacity>
      {imagen && <Image source={{ uri: imagen }} style={styles.image} />}
      <TouchableOpacity style={[styles.button, styles.uploadButton]} onPress={subir}>
        <Text style={styles.buttonText}>Subir Imagen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#000',
  },
  button: {
    backgroundColor: '#36BA98', // Verde especificado
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#36BA98',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
