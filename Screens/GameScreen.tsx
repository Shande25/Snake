import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ref, set } from 'firebase/database';
import { db, auth } from '../Config/Config';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');
const CELL_SIZE = Math.floor(Math.min(width, height) / 20);

const GameScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'Game'>>();
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState('RIGHT');
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [titleColor, setTitleColor] = useState('#36BA98');
  const [isPaused, setIsPaused] = useState(false);
  const [backgroundSound, setBackgroundSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const backgroundMusic = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/snake-moon-134886.mp3'),
          { shouldPlay: true, isLooping: true }
        );
        setBackgroundSound(sound);
      } catch (error) {
        console.error('Error loading background music:', error);
      }
    };

    backgroundMusic();

    return () => {
      if (backgroundSound) {
        backgroundSound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (isGameOver || isPaused) {
      stopBackgroundMusic();
    } else {
      playBackgroundMusic();
    }
  }, [isGameOver, isPaused]);

  useEffect(() => {
    if (isGameOver) {
      saveScoreToDatabase(score);
      playGameOverSound();
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

  
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(require('../assets/eating-sound-effect-36186.mp3'));
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const playGameOverSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(require('../assets/game-over-arcade-6435.mp3'));
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing game over sound:', error);
    }
  };

  const playBackgroundMusic = async () => {
    try {
      if (backgroundSound) {
        await backgroundSound.playAsync();
      }
    } catch (error) {
      console.error('Error playing background music:', error);
    }
  };

  const stopBackgroundMusic = async () => {
    try {
      if (backgroundSound) {
        await backgroundSound.stopAsync();
      }
    } catch (error) {
      console.error('Error stopping background music:', error);
    }
  };

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
      playSound();
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

  const generateFood = (snake: any[]) => {
    let foodX = Math.floor(Math.random() * 20);
    let foodY = Math.floor(Math.random() * 20);

    while (snake.some(segment => segment.x === foodX && segment.y === foodY)) {
      foodX = Math.floor(Math.random() * 20);
      foodY = Math.floor(Math.random() * 20);
    }

    return { x: foodX, y: foodY };
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
    playBackgroundMusic();
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
                    <View
                      key={`${row}-${col}`}
                      style={[
                        styles.cell,
                        isSnakeHead && styles.snakeHead,
                        isSnakeBody && styles.snakeBody,
                        { width: CELL_SIZE - 2, height: CELL_SIZE - 2 },
                      ]}
                    >
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
    backgroundColor: 'lightgray',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#555',
  },
  snakeHead: {
    backgroundColor: 'lightgreen',
  },
  snakeBody: {
    backgroundColor: 'green',
  },
  food: {
    position: 'absolute',
    width: CELL_SIZE - 4,
    height: CELL_SIZE - 4,
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
  },
});

export default GameScreen;
