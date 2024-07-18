import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ref, set } from 'firebase/database';
import { db, auth } from '../Config/Config';
import { RootStackParamList } from '../components/Types';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';


// Obtener las dimensiones de la pantalla
const { width, height } = Dimensions.get('window');
const CELL_SIZE = Math.floor(Math.min(width, height) / 20); // Tamaño de cada celda

const generateFood = (snake: any[]) => {
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
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState(generateFood(snake));
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [titleColor, setTitleColor] = useState('#36BA98');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isGameOver) {
      saveScoreToDatabase(score);
      navigation.navigate('Puntuacion', { score });
    }
  }, [isGameOver, score, navigation]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [snake, direction, isGameOver, isPaused]);

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

  const handlePanGesture = (event: { nativeEvent: { translationX: any; translationY: any; }; }) => {
    const { translationX, translationY } = event.nativeEvent;
    if (Math.abs(translationX) > Math.abs(translationY)) {
      setDirection(translationX > 0 ? 'RIGHT' : 'LEFT');
    } else {
      setDirection(translationY > 0 ? 'DOWN' : 'UP');
    }
  };

  const restartGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setFood(generateFood([{ x: 10, y: 10 }]));
    setIsGameOver(false);
    setScore(0);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onGestureEvent={handlePanGesture}>
        <View style={styles.gameContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={restartGame}>
              <Text style={styles.buttonText}>↻</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePause}>
              <Text style={styles.buttonText}>{isPaused ? '▶' : '⏸'}</Text>
            </TouchableOpacity>
            <Text style={styles.scoreText}>{score}</Text>
          </View>
          <View style={styles.grid}>
            {Array.from({ length: 20 }).map((_, row) => (
              <View key={row} style={styles.row}>
                {Array.from({ length: 20 }).map((_, col) => {
                  const isSnakeHead = snake[0].x === col && snake[0].y === row;
                  const isSnakeBody = snake.slice(1).some(segment => segment.x === col && segment.y === row);
                  const isFood = food.x === col && food.y === row;
                  return (
                    <View key={`${row}-${col}`} style={[
                      styles.cell,
                      isSnakeHead && styles.snakeHead,
                      isSnakeBody && styles.snakeBody
                    ]}>
                      {isFood && <Image source={require('../assets/image/apple.png')} style={styles.food} />}
                    </View>
                    
                  );
                  
                })}
              </View>
            ))}
          </View>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray', // Color de fondo claro
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Ocupar toda la pantalla
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginVertical: 10,
  },
  scoreText: {
    fontSize: 24,
    color: 'white',
  },
  grid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#555', // Color de fondo para las celdas
  },
  snakeHead: {
    backgroundColor: 'lightgreen', // Color de la cabeza de la serpiente
  },
  snakeBody: {
    backgroundColor: 'green', // Color del cuerpo de la serpiente
  },
  food: {
    width: CELL_SIZE - 4, // Ajustar tamaño de la comida según tamaño de celda
    height: CELL_SIZE - 4,
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
  },
});

export default GameScreen;
