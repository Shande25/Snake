import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';
import { Alert } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyCw5wb7WeIbRnELHXO8JKpB2hYkDhoCUUA",
  authDomain: "snakeii.firebaseapp.com",
  databaseURL: "https://snakeii-default-rtdb.firebaseio.com",
  projectId: "snakeii",
  storageBucket: "snakeii.appspot.com",
  messagingSenderId: "230765432813",
  appId: "1:230765432813:web:427c3fc99ce11d5a5fa1e4"
};

// Inicializa la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Inicializa la autenticación con persistencia en React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Inicializa la base de datos y el almacenamiento
const db = getDatabase(app);
const storage = getStorage(app);

// Exporta las instancias de la base de datos, autenticación y almacenamiento
export { db, auth, storage };

// Define los tipos para los usuarios
type UserProfile = {
  nickname: string;
  age: number;
  email: string;
  password: string;
};

// Ejemplo de cómo usar los tipos definidos
const createUser = (user: UserProfile) => {
  fetchSignInMethodsForEmail(auth, user.email)
    .then((signInMethods) => {
      if (signInMethods.length > 0) {
        console.error('Error: El correo electrónico ya está en uso.');
        Alert.alert('Error', 'El correo electrónico ya está en uso.');
      } else {
        return createUserWithEmailAndPassword(auth, user.email, user.password);
      }
    })
    .then((userCredential) => {
      if (userCredential) {
        const newUser = userCredential.user;
        console.log('User created:', newUser);
      }
    })
    .catch((error) => {
      console.error('Error creating user:', error);
    });
};

// Ejemplo de creación de usuario
const newUser: UserProfile = {
  nickname: 'Usuario',
  age: 30,
  email: 'usuario@example.com',
  password: 'password123'
};

createUser(newUser);
