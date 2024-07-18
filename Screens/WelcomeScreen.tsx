import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from "react-native";

export const WelcomeScreen = ({ navigation }: any) => {
  const [titleColor, setTitleColor] = useState("#36BA98");

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setTitleColor(prevColor => prevColor === "#36BA98" ? "#FFFFFF" : "#36BA98");
    }, 3000);

    return () => clearInterval(colorInterval);
  }, []);

  const gifUrl = "https://66.media.tumblr.com/9356a5343569692547be79f4fe460829/tumblr_mit6meq11R1rfjowdo1_500.gif";

  return (
    <ImageBackground
      source={{ uri: "https://e1.pxfuel.com/desktop-wallpaper/510/297/desktop-wallpaper-snake-art.jpg" }}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: titleColor }]}>Bienvenido</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Game")}
          >
            <Text style={styles.buttonText}>Iniciar Juego</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate("Puntuacion", { score: 0 })}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Ver Puntuación
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate("Perfil")}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Mi Perfil
            </Text>
          </TouchableOpacity>
        </View>
        {/* GIF desde URL */}
        <Image source={{ uri: gifUrl }} style={styles.gif} />
        {/* Botón de retroceso */}
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
    justifyContent: "space-between", // Alinea los elementos verticalmente y deja espacio entre ellos
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 50,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#36BA98",
    width: 250, // Ancho fijo para todos los botones
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: "#36BA98",
    width: 250, // Ancho fijo para todos los botones
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  gif: {
    width: "100%", 
    height: 85, 
    resizeMode: "contain", 
  },
  backButton: {
    backgroundColor: "#888",
    width: 250,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});

export default WelcomeScreen;
