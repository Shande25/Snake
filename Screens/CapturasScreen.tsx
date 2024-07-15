import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

export default function CapturasScreen() {
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const storage = getStorage();
      const listRef = ref(storage, "Taller/");

      try {
        const res = await listAll(listRef);
        const urls = await Promise.all(
          res.items.map((itemRef) => getDownloadURL(itemRef))
        );
        setImagenes(urls);
      } catch (error) {
        console.error("Error al obtener las imágenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capturas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={imagenes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} />
          )}
          numColumns={2}
          contentContainerStyle={styles.imageContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  image: {
    width: "48%",
    height: 150,
    margin: 4,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
