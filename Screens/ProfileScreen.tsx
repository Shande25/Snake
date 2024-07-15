import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../Config/Config'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';

const firestore = getFirestore();

type UserProfile = {
  nickname: string;
  age: string;
  email: string;
  password: string;
};

export const ProfileScreen = () => {
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
      <Text style={styles.label}>Nickname:</Text>
      <TextInput
        style={styles.input}
        value={userData.nickname}
        editable={isEditing}
        onChangeText={(text) => setUserData({ ...userData, nickname: text })}
      />
      <Text style={styles.label}>Age:</Text>
      <TextInput
        style={styles.input}
        value={userData.age}
        editable={isEditing}
        onChangeText={(text) => setUserData({ ...userData, age: text })}
      />
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={userData.email}
        editable={false}
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={userData.password}
        editable={isEditing}
        secureTextEntry={true}
        onChangeText={(text) => setUserData({ ...userData, password: text })}
      />
      <TouchableOpacity 
        style={[styles.button, isEditing ? styles.saveButton : styles.editButton]} 
        onPress={isEditing ? handleSave : handleEdit}
      >
        <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007BFF',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
