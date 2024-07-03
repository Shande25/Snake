  import React, { useState, useEffect } from 'react';
  import { View, Text, StyleSheet, Button } from 'react-native';

  export const GameScreen = () => {
    const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
    const [direction, setDirection] = useState('RIGHT');
    const [food, setFood] = useState({ x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) });

    useEffect(() => {
      const interval = setInterval(moveSnake, 200);
      return () => clearInterval(interval);
    }, [snake, direction]);

    const moveSnake = () => {
      let newSnake = [...snake];
      let head = { ...newSnake[0] };

      switch (direction) {
        case 'RIGHT':
          head.x += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        default:
          break;
      }

      newSnake.unshift(head);
      newSnake.pop();
      setSnake(newSnake);
    };

    const changeDirection = (newDirection:any) => {
      setDirection(newDirection);
    };

    return (
      <View style={styles.container}>
        <Text>Snake Game</Text>
        <View style={styles.board}>
          {snake.map((segment, index) => (
            <View key={index} style={[styles.snake, { left: segment.x * 10, top: segment.y * 10 }]} />
          ))}
          <View style={[styles.food, { left: food.x * 10, top: food.y * 10 }]} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Up" onPress={() => changeDirection('UP')} />
          <Button title="Down" onPress={() => changeDirection('DOWN')} />
          <Button title="Left" onPress={() => changeDirection('LEFT')} />
          <Button title="Right" onPress={() => changeDirection('RIGHT')} />
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    board: {
      width: 200,
      height: 200,
      backgroundColor: 'lightgrey',
      position: 'relative',
    },
    snake: {
      width: 10,
      height: 10,
      backgroundColor: 'green',
      position: 'absolute',
    },
    food: {
      width: 10,
      height: 10,
      backgroundColor: 'red',
      position: 'absolute',
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: 20,
    },
  });

