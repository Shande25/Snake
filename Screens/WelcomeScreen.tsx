import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text>Bienvenido</Text>
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
