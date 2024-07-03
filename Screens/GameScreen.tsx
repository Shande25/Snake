import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

const generateFood = () => {
  return { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
};

export const GameScreen = () => {
  const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState(generateFood);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0); // Estado para la puntuación

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [snake, direction, isGameOver]);

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

    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
      setIsGameOver(true);
      Alert.alert('Game Over', 'You hit the wall!');
      return;
    }

    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setIsGameOver(true);
      Alert.alert('Game Over', 'You hit yourself!');
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood());
      setScore(prevScore => prevScore + 1); // Incrementar la puntuación
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const changeDirection = (newDirection: string) => {
    setDirection(newDirection);
  };

  const restartGame = () => {
    setSnake([{ x: 0, y: 0 }]);
    setDirection('RIGHT');
    setFood(generateFood());
    setIsGameOver(false);
    setScore(0); // Reiniciar la puntuación
  };

  return (
    <View style={styles.container}>
      <Text>Snake Game</Text>
      <View style={styles.scoreContainer}>
        <Text>Score: </Text>
        <Text>{score}</Text>
      </View>
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
      {isGameOver && <Button title="Restart" onPress={restartGame} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    marginBottom: 10,
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
