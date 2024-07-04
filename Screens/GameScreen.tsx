import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const generateFood = () => {
  return { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
};

export const GameScreen: React.FC = () => {
  const navigation = useNavigation();
  const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState(generateFood());
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [titleColor, setTitleColor] = useState('#36BA98');

  useEffect(() => {
    if (isGameOver) {
      console.log('Navigating to Puntuacion screen with score:', score);
      navigation.navigate('Puntuacion', { score: score });
    }
  }, [isGameOver, score, navigation]);

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [snake, direction, isGameOver]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleColor((prevColor) => (prevColor === '#36BA98' ? 'white' : '#36BA98'));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
      setScore(prevScore => prevScore + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const changeDirection = (newDirection: any) => {
    setDirection(newDirection);
  };

  const restartGame = () => {
    setSnake([{ x: 0, y: 0 }]);
    setDirection('RIGHT');
    setFood(generateFood());
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: titleColor }]}>Snake Game</Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: </Text>
        <Text style={styles.scoreText}>{score}</Text>
      </View>
      <View style={styles.board}>
        {snake.map((segment, index) => (
          <View key={index} style={[styles.snake, { left: segment.x * 10, top: segment.y * 10 }]} />
        ))}
        <View style={[styles.food, { left: food.x * 10, top: food.y * 10 }]} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => changeDirection('UP')}>
          <Text style={styles.buttonText}>Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => changeDirection('DOWN')}>
          <Text style={styles.buttonText}>Down</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => changeDirection('LEFT')}>
          <Text style={styles.buttonText}>Left</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => changeDirection('RIGHT')}>
          <Text style={styles.buttonText}>Right</Text>
        </TouchableOpacity>
      </View>
      {isGameOver && (
        <TouchableOpacity style={styles.button} onPress={restartGame}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
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
  button: {
    backgroundColor: '#36BA98',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

