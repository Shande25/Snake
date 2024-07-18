import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import MainNavigator from './navigators/MainNavigator';

const App = () => {
  return (
    
     <MainNavigator/>
     
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default App;
