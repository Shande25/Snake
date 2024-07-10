// GameScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ref, set } from 'firebase/database';
import { db, auth } from '../Config/Config';
import { RootStackParamList } from '../Screens/types';

const generateFood = () => {
  return { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
};

type GameScreenNavigationProp = NavigationProp<RootStackParamList, 'Game'>;

export const GameScreen: React.FC = () => {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState(generateFood());
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [titleColor, setTitleColor] = useState('#36BA98');

  useEffect(() => {
    if (isGameOver) {
      saveScoreToDatabase(score);
      navigation.navigate('Puntuacion', { score });
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
      return;
    }

    for (let i = 0; i < newSnake.length; i++) {
      if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
        setIsGameOver(true);
        return;
      }
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood());
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const saveScoreToDatabase = (score: number) => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const scoreRef = ref(db, `scores/${userId}`);
      set(scoreRef, {
        score: score,
        date: new Date().toISOString(),
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: titleColor }]}>Snake Game</Text>
      <Text style={styles.score}>Score: {score}</Text>
      {isGameOver ? (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Puntuacion', { score })}>
          <Text style={styles.buttonText}>Ver Puntuación</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.grid}>
          {Array.from({ length: 20 }).map((_, row) => (
            <View key={row} style={styles.row}>
              {Array.from({ length: 20 }).map((_, col) => {
                const isSnake = snake.some(segment => segment.x === col && segment.y === row);
                const isFood = food.x === col && food.y === row;
                return (
                  <View key={col} style={[styles.cell, isSnake && styles.snake, isFood && styles.food]} />
                );
              })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 24,
    marginVertical: 20,
  },
  grid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  snake: {
    backgroundColor: 'green',
  },
  food: {
    backgroundColor: 'red',
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
  },
});
