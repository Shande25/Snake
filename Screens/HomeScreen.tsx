import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export const HomeScreen = ({ navigation }:any) => {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Snake Game!</Text>
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
  },
});

export default HomeScreen;
