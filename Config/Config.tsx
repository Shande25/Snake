import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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

// Inicializa la autenticación y la base de datos
const db = getDatabase(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Exporta las instancias de la base de datos y autenticación
export { db, auth };

// Define los tipos para los usuarios
type UserProfile = {
  nickname: string;
  age: number;
  email: string;
  password: string;
};

// Ejemplo de cómo usar los tipos definidos
const createUser = (user: UserProfile) => {
  createUserWithEmailAndPassword(auth, user.email, user.password)
    .then((userCredential) => {
      const newUser = userCredential.user;
      console.log('User created:', newUser);
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
