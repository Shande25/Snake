import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { auth, db } from '../Config/Config'; // Asegúrate de ajustar la ruta según la ubicación de tu archivo de configuración de Firebase
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';

const firestore = getFirestore();

type UserProfile = {
  nickname: string;
  age: string;
  email: string;
  password: string;
};

const ProfileScreen = () => {
  const [userData, setUserData] = useState<UserProfile>({ nickname: '', age: '', email: '', password: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserProfile);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, userData);
      setIsEditing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Nickname:</Text>
      <TextInput
        style={styles.input}
        value={userData.nickname}
        editable={isEditing}
        onChangeText={(text) => setUserData({ ...userData, nickname: text })}
      />
      <Text>Age:</Text>
      <TextInput
        style={styles.input}
        value={userData.age}
        editable={isEditing}
        onChangeText={(text) => setUserData({ ...userData, age: text })}
      />
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={userData.email}
        editable={false}
      />
      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        value={userData.password}
        editable={isEditing}
        secureTextEntry={true}
        onChangeText={(text) => setUserData({ ...userData, password: text })}
      />
      {isEditing ? (
        <Button title="Save" onPress={handleSave} />
      ) : (
        <Button title="Edit" onPress={handleEdit} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
});

export default ProfileScreen;
