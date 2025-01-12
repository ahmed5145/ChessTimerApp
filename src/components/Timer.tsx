import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import type { RootState } from '../store/store';
import {
  startGame,
  pauseGame,
  resumeGame,
  resetGame,
  switchPlayer,
  updateTime,
} from '../store/timerSlice';
import { soundManager } from '../utils/soundUtils';
import { statsManager } from '../utils/statsUtils';
import { hapticPatterns } from '../utils/hapticPatterns.ts';
import { formatTime } from '../utils/timeUtils';

type TimerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Timer'>;

const { width, height } = Dimensions.get('window');

const Timer = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<TimerScreenNavigationProp>();
  const timer = useAppSelector((state: RootState) => state.timer);
  const [lastLowTimeWarning, setLastLowTimeWarning] = React.useState(0);
  const [gameOver, setGameOver] = React.useState<'player1' | 'player2' | null>(null);
  const fadeAnim1 = React.useRef(new Animated.Value(1)).current;
  const fadeAnim2 = React.useRef(new Animated.Value(1)).current;
  const scaleAnim1 = React.useRef(new Animated.Value(1)).current;
  const scaleAnim2 = React.useRef(new Animated.Value(1)).current;
  const [gameStartTime, setGameStartTime] = React.useState<number | null>(null);
  const [lastMoveTime, setLastMoveTime] = React.useState<number | null>(null);
  const [playerMoves, setPlayerMoves] = React.useState({ player1: 0, player2: 0 });
  const [timeSpent, setTimeSpent] = React.useState({ player1: 0, player2: 0 });
  const [showEndGameModal, setShowEndGameModal] = React.useState(false);
  const activePlayer = timer.player1.isActive ? 'player1' : 'player2';

  useEffect(() => {
    soundManager.initializeSounds();
    return () => {
      soundManager.cleanup();
    };
  }, []);

  const handlePlayerPress = useCallback(async (player: 'player1' | 'player2') => {
    if (gameOver) return;
    
    if (!timer.isGameActive) {
      dispatch(startGame());
      setGameStartTime(Date.now());
      setLastMoveTime(Date.now());
      await hapticPatterns.start();
      await soundManager.play('click');
    } else if (
      (player === 'player1' && timer.player1.isActive) ||
      (player === 'player2' && timer.player2.isActive)
    ) {
      const now = Date.now();
      const moveTime = now - (lastMoveTime || now);
      
      setPlayerMoves(prev => ({
        ...prev,
        [activePlayer]: prev[activePlayer] + 1
      }));
      setTimeSpent(prev => ({
        ...prev,
        [activePlayer]: prev[activePlayer] + moveTime
      }));
      setLastMoveTime(now);

      dispatch(switchPlayer());
      await hapticPatterns.switch();
      await soundManager.play('click');
    }
  }, [timer.isGameActive, timer.player1.isActive, timer.player2.isActive, gameOver, lastMoveTime, activePlayer, dispatch]);

  const handleReset = async () => {
    dispatch(resetGame());
    setGameOver(null);
    setGameStartTime(null);
    setLastMoveTime(null);
    setPlayerMoves({ player1: 0, player2: 0 });
    setTimeSpent({ player1: 0, player2: 0 });
    await hapticPatterns.reset();
    await soundManager.play('click');
  };

  const handleEndGame = (reason: 'checkmate' | 'resignation') => {
    if (!gameStartTime) return;

    const winner = (reason === 'resignation' ? (activePlayer === 'player1' ? 'player2' : 'player1') : activePlayer) as 'player1' | 'player2';
    const loser = winner === 'player1' ? 'player2' : 'player1';
    
    const gameStats = {
      date: new Date().toISOString(),
      duration: Date.now() - gameStartTime,
      winner,
      endReason: reason,
      timeControl: {
        minutes: timer.selectedTimeControl.minutes,
        seconds: timer.selectedTimeControl.seconds,
        increment: timer.selectedTimeControl.increment,
      },
      timeRemaining: {
        winner: timer[winner].timeRemaining,
        loser: timer[loser].timeRemaining,
      },
      moves: {
        total: playerMoves.player1 + playerMoves.player2,
        player1: playerMoves.player1,
        player2: playerMoves.player2,
        avgTimePerMove: {
          player1: playerMoves.player1 > 0 ? timeSpent.player1 / playerMoves.player1 : 0,
          player2: playerMoves.player2 > 0 ? timeSpent.player2 / playerMoves.player2 : 0,
        },
      },
    };

    statsManager.saveGameStats(gameStats);
    setGameOver(winner);
    setShowEndGameModal(false);
    
    // Navigate to Stats screen after a short delay
    setTimeout(() => {
      navigation.navigate('Stats');
    }, 1500);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timer.isGameActive && !timer.isPaused) {
      interval = setInterval(() => {
        const activePlayer = timer.player1.isActive ? 'player1' : 'player2';
        const activeTime = timer[activePlayer].timeRemaining;

        if (activeTime <= 0) {
          // Game Over - Time Up
          dispatch(pauseGame());
          soundManager.play('timeup', true);
          hapticPatterns.timeUp();
          const winner = activePlayer === 'player1' ? 'player2' : 'player1';
          setGameOver(winner);
        } else {
          dispatch(updateTime({ player: activePlayer, deltaTime: 100 }));

          // Handle low time warning
          if (activeTime <= 10000) { // 10 seconds
            const now = Date.now();
            if (now - lastLowTimeWarning >= 1000) { // Warning every second
              soundManager.play('warning');
              hapticPatterns.lowTime();
              setLastLowTimeWarning(now);
            }
          }
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [timer.isGameActive, timer.isPaused, timer.player1.isActive, timer.player2.isActive, lastLowTimeWarning, dispatch]);

  // Animate player switch
  useEffect(() => {
    if (timer.isGameActive) {
      if (timer.player1.isActive) {
        Animated.parallel([
          Animated.sequence([
            Animated.timing(fadeAnim1, {
              toValue: 0.8,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim1, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(scaleAnim1, {
              toValue: 1.05,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim1, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      } else {
        Animated.parallel([
          Animated.sequence([
            Animated.timing(fadeAnim2, {
              toValue: 0.8,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim2, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(scaleAnim2, {
              toValue: 1.05,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim2, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }
    }
  }, [timer.player1.isActive, timer.isGameActive, fadeAnim1, fadeAnim2, scaleAnim1, scaleAnim2]);

  // Add game over message
  const getTimeDisplay = (timeRemaining: number, player: 'player1' | 'player2') => {
    if (timeRemaining <= 0) {
      return "Time's Up!";
    }
    if (gameOver === player) {
      return "Victory!";
    }
    return formatTime(timeRemaining);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TimeControl')}
            style={styles.headerButton}
          >
            <Ionicons name="timer-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.headerButton}
          >
            <Ionicons name="settings-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const EndGameModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showEndGameModal}
      onRequestClose={() => setShowEndGameModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>End Game</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => handleEndGame('checkmate')}
          >
            <Text style={styles.modalButtonText}>Checkmate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => handleEndGame('resignation')}
          >
            <Text style={styles.modalButtonText}>Resignation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setShowEndGameModal(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={{ 
        flex: 1, 
        width: '100%',
        opacity: fadeAnim2,
        transform: [{ scale: scaleAnim2 }]
      }}>
        <TouchableOpacity
          style={[
            styles.playerButton,
            styles.player2Button,
            timer.player2.isActive && styles.activePlayer,
            timer.player2.isLowTime && styles.lowTime,
            timer.player2.timeRemaining <= 0 && styles.timeUp,
            gameOver === 'player2' && styles.victory,
          ]}
          onPress={() => handlePlayerPress('player2')}
          disabled={timer.player2.timeRemaining <= 0 || gameOver !== null}
        >
          <Text style={[
            styles.timeText,
            timer.player2.isActive && styles.activeTimeText,
            timer.player2.timeRemaining <= 0 && styles.timeUpText,
            gameOver === 'player2' && styles.victoryText,
          ]}>
            {getTimeDisplay(timer.player2.timeRemaining, 'player2')}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleReset}
        >
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={async () => {
            if (timer.isPaused) {
              dispatch(resumeGame());
            } else {
              dispatch(pauseGame());
            }
            await hapticPatterns.switch();
            await soundManager.play('click');
          }}
          disabled={gameOver !== null}
        >
          <Ionicons
            name={timer.isPaused ? "play" : "pause"}
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
        {timer.isGameActive && !gameOver && (
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => {
              setShowEndGameModal(true);
              hapticPatterns.switch();
              soundManager.play('click');
            }}
          >
            <Ionicons name="flag-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
        {gameOver && (
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => navigation.navigate('Stats')}
          >
            <Ionicons name="stats-chart" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>

      <Animated.View style={{ 
        flex: 1, 
        width: '100%',
        opacity: fadeAnim1,
        transform: [{ scale: scaleAnim1 }]
      }}>
        <TouchableOpacity
          style={[
            styles.playerButton,
            styles.player1Button,
            timer.player1.isActive && styles.activePlayer,
            timer.player1.isLowTime && styles.lowTime,
            timer.player1.timeRemaining <= 0 && styles.timeUp,
            gameOver === 'player1' && styles.victory,
          ]}
          onPress={() => handlePlayerPress('player1')}
          disabled={timer.player1.timeRemaining <= 0 || gameOver !== null}
        >
          <Text style={[
            styles.timeText,
            timer.player1.isActive && styles.activeTimeText,
            timer.player1.timeRemaining <= 0 && styles.timeUpText,
            gameOver === 'player1' && styles.victoryText,
          ]}>
            {getTimeDisplay(timer.player1.timeRemaining, 'player1')}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      
      <EndGameModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  playerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  player1Button: {
    backgroundColor: '#1a1a1a',
  },
  player2Button: {
    backgroundColor: '#1a1a1a',
    transform: [{ rotate: '180deg' }],
  },
  activePlayer: {
    backgroundColor: '#2a2a2a',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  lowTime: {
    backgroundColor: '#4a1a1a',
  },
  timeText: {
    fontSize: width * 0.15,
    color: '#fff',
    fontWeight: 'bold',
  },
  activeTimeText: {
    color: '#007AFF',
    textShadowColor: 'rgba(0, 122, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1a1a1a',
  },
  controlButton: {
    padding: 10,
    marginHorizontal: 10,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 15,
  },
  timeUp: {
    backgroundColor: '#4a1a1a',
  },
  timeUpText: {
    color: '#ff4444',
  },
  victory: {
    backgroundColor: '#1a4a1a',
    shadowColor: '#4eff4e',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 8,
  },
  victoryText: {
    color: '#4eff4e',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  modalButtonText: {
    color: '#007AFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#4a1a1a',
  },
  cancelButtonText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Timer; 