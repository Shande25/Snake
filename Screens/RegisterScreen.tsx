import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground, Image } from "react-native";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { db } from "../Config/Config";

const backgroundImage = { uri: 'https://e1.pxfuel.com/desktop-wallpaper/510/297/desktop-wallpaper-snake-art.jpg' }; 
const companyImage = { uri: 'https://i.blogs.es/5c2b53/snake/1366_2000.jpg' };
const gifImage = { uri: 'https://i.gifer.com/4Snj.gif' };

export const RegisterScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [titleColor, setTitleColor] = useState("#36BA98");

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleColor((prevColor) => (prevColor === "#36BA98" ? "white" : "#36BA98"));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const goToLogin = () => {
    navigation.navigate("Login");
  };

  function writeUserData(username: string, password: string, email: string) {
    const db = getDatabase();
    set(ref(db, `users/` + username), {
      password: password,
      email: email,
    });
    Alert.alert("Mensaje", "Información guardada");
    setUsername("");
    setPassword("");
    setEmail("");
  }

  useEffect(() => {
    const starCountRef = ref(db, 'posts/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      const dataTemp = Object.keys(data).map((key) => ({ key, ...data[key] }));
    });
  }, []);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.companyContainer}>
          <Image source={companyImage} style={styles.companyImage} />
        </View>
        <Text style={[styles.title, { color: titleColor }]}>Registro</Text>
        <Text style={styles.label}>Nombre de usuario:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={(texto) => setUsername(texto)}
          placeholder="Introduce tu nombre de usuario"
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(texto) => setEmail(texto)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Introduce tu email"
        />
        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(texto) => setPassword(texto)}
          secureTextEntry
          placeholder="Introduce tu contraseña"
        />
        <TouchableOpacity style={styles.button} onPress={() => writeUserData(username, password, email)}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={goToLogin}>
          <Text style={styles.secondaryButtonText}>Ya tengo cuenta. Iniciar sesión</Text>
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
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  companyContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  companyImage: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    borderRadius: 45,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    marginLeft: 5,
    fontSize: 16,
    color: "#fff",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    marginTop: 20,
  },
  secondaryButtonText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  gifContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  gif: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});
