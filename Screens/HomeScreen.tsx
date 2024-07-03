import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

export const HomeScreen = ({ navigation }: { navigation: any  }) => { 
  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Welcome to the Snake Game!</Text>
      <Text style={styles.subtitle}>Are you ready to play?</Text>
      <Button
        title="Start Game"
        onPress={() => navigation.navigate('Game')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
});

export default HomeScreen;
