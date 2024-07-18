import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput, Button } from 'react-native';
import { auth, db, storage } from '../Config/Config';
import { onValue, ref, update } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userId = user.uid;
        const userRef = ref(db, `users/${userId}`);
        const unsubscribeUser = onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          setUsername(userData.username || '');
          setEmail(userData.email || '');
          setAge(userData.age || '');
          setProfileImage(userData.profileImage || null);
        });

        return () => {
          unsubscribeUser();
        };
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const selectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos insuficientes', 'Se necesita permiso para acceder a la galería.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUploading(true);
        const imageUrl = await uploadImage(result.assets[0].uri);
        setProfileImage(imageUrl);
        await saveProfileImageToFirebase(imageUrl);
        setImageUploading(false);
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      Alert.alert('Error', 'Hubo un error al seleccionar la imagen.');
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('No user is currently signed in.');
      }
      
      const imageName = `profile_images/${userId}`;
      const imageRef = storageRef(storage, imageName);

      await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      Alert.alert('Error', 'Hubo un error al subir la imagen.');
      setImageUploading(false);
      return null;
    }
  };

  const saveProfileImageToFirebase = async (imageUrl: string | null) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('No user is currently signed in.');
      }
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, { profileImage: imageUrl });
    } catch (error) {
      console.error('Error al guardar la imagen de perfil en Firebase:', error);
      Alert.alert('Error', 'Hubo un error al guardar la imagen de perfil.');
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('No user is currently signed in.');
      }
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, {
        username,
        email,
        age,
      });
      setIsEditing(false);
      Alert.alert('Perfil actualizado', 'Los cambios se guardaron correctamente.');
    } catch (error) {
      console.error('Error al guardar los cambios en el perfil:', error);
      Alert.alert('Error', 'Hubo un error al guardar los cambios en el perfil.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileImageContainer} onPress={selectImage}>
        {imageUploading ? (
          <Text style={styles.uploadingText}>Subiendo...</Text>
        ) : (
          <>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Text style={styles.uploadText}>Seleccionar Imagen</Text>
            )}
          </>
        )}
      </TouchableOpacity>
      <Text style={styles.profileTitle}>Perfil del usuario activo</Text>
      <View style={styles.editButtonContainer}>
        {isEditing ? (
          <Button title="Guardar" onPress={handleSaveChanges} />
        ) : (
          <Button title="Editar" onPress={handleEditProfile} />
        )}
      </View>
      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>Información de Perfil</Text>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Nombre de usuario:</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.editableField]}
              value={username}
              onChangeText={setUsername}
              placeholder="Ingrese nombre de usuario"
            />
          ) : (
            <Text style={styles.infoValue}>{username}</Text>
          )}
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Correo electrónico:</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.editableField]}
              value={email}
              onChangeText={setEmail}
              placeholder="Ingrese correo electrónico"
            />
          ) : (
            <Text style={styles.infoValue}>{email}</Text>
          )}
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Edad:</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.editableField]}
              value={age}
              onChangeText={setAge}
              placeholder="Ingrese edad"
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.infoValue}>{age}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Constants.statusBarHeight + 20,
    backgroundColor: '#000000',
  },
  profileImageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  uploadingText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  uploadText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  editButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#CCCCCC',
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  editableField: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    color: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#FFFFFF',
    paddingHorizontal: 10,
  },
});

export default ProfileScreen;
