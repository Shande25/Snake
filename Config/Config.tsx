import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage'; // Importa Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyAgAJ3zNMSh_jkDAG7JUyZfVuIKLLlfaNo",
  authDomain: "app-snake-cf8c9.firebaseapp.com",
  databaseURL: "https://app-snake-cf8c9-default-rtdb.firebaseio.com",
  projectId: "app-snake-cf8c9",
  storageBucket: "app-snake-cf8c9.appspot.com",
  messagingSenderId: "68071561947",
  appId: "1:68071561947:web:63529b342db9ff45a78afe"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app); // Inicializa el storage

export { db, auth, storage }; // Exporta el storage