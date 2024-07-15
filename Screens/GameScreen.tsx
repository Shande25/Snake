import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ref, set } from 'firebase/database';
import { db, auth } from '../Config/Config';
import { RootStackParamList } from '../components/Types';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

const generateFood = (snake: { x: number; y: number }[]) => {
  let foodX = Math.floor(Math.random() * 20);
  let foodY = Math.floor(Math.random() * 20);

  while (snake.some(segment => segment.x === foodX && segment.y === foodY)) {
    foodX = Math.floor(Math.random() * 20);
    foodY = Math.floor(Math.random() * 20);
  }

  return { x: foodX, y: foodY };
};

type GameScreenNavigationProp = NavigationProp<RootStackParamList, 'Game'>;

const GameScreen: React.FC = () => {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState(generateFood(snake));
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
      setTitleColor(prevColor => (prevColor === '#36BA98' ? 'white' : '#36BA98'));
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

    for (let segment of newSnake) {
      if (segment.x === head.x && segment.y === head.y) {
        setIsGameOver(true);
        return;
      }
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood(newSnake));
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

  const handlePanGesture = (event: PanGestureHandlerGestureEvent) => {
    const { translationX, translationY } = event.nativeEvent;
    if (Math.abs(translationX) > Math.abs(translationY)) {
      setDirection(translationX > 0 ? 'RIGHT' : 'LEFT');
    } else {
      setDirection(translationY > 0 ? 'DOWN' : 'UP');
    }
  };

  const restartGame = () => {
    setSnake([{ x: 0, y: 0 }]);
    setDirection('RIGHT');
    setFood(generateFood([{ x: 0, y: 0 }]));
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={handlePanGesture}>
        <View style={styles.container}>
          <Text style={[styles.title, { color: titleColor }]}>Snake Game</Text>
          <Text style={styles.score}>Score: {score}</Text>
          {isGameOver ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Puntuacion', { score })}>
                <Text style={styles.buttonText}>Ver Puntuación</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={restartGame}>
                <Text style={styles.buttonText}>Volver a Jugar</Text>
              </TouchableOpacity>
            </View>
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
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  score: {
    fontSize: 24,
    marginVertical: 20,
    color: 'white',
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
    backgroundColor: 'white',
  },
  snake: {
    backgroundColor: 'green',
  },
  food: {
    backgroundColor: 'red',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#36BA98',
    marginTop: 10,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameScreen;
