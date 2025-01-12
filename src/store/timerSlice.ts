import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimerState, TimeFormat } from '../types/timer';
import { DEFAULT_TIME_CONTROLS } from '../utils/timeUtils';

const initialState: TimerState = {
  player1: {
    timeRemaining: DEFAULT_TIME_CONTROLS[2].minutes * 60000 + DEFAULT_TIME_CONTROLS[2].seconds * 1000,
    isActive: false,
    isLowTime: false,
    name: 'Player 1'
  },
  player2: {
    timeRemaining: DEFAULT_TIME_CONTROLS[2].minutes * 60000 + DEFAULT_TIME_CONTROLS[2].seconds * 1000,
    isActive: false,
    isLowTime: false,
    name: 'Player 2'
  },
  isGameActive: false,
  isPaused: false,
  selectedTimeControl: DEFAULT_TIME_CONTROLS[2],
  playerNames: {
    player1: 'Player 1',
    player2: 'Player 2'
  }
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    updateTime: (state, action: PayloadAction<{ player: 'player1' | 'player2', deltaTime: number }>) => {
      const { player, deltaTime } = action.payload;
      state[player].timeRemaining = Math.max(0, state[player].timeRemaining - deltaTime);
      state[player].isLowTime = state[player].timeRemaining <= 30000;
    },
    switchPlayer: (state) => {
      if (!state.isGameActive || state.isPaused) return;
      
      const currentPlayer = state.player1.isActive ? 'player1' : 'player2';
      const nextPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
      
      state[currentPlayer].isActive = false;
      state[nextPlayer].isActive = true;
      
      // Add increment to the player who just completed their move
      if (state.selectedTimeControl.increment > 0) {
        state[currentPlayer].timeRemaining += state.selectedTimeControl.increment * 1000;
      }
    },
    startGame: (state) => {
      state.isGameActive = true;
      state.isPaused = false;
      state.player1.isActive = true;
      state.player2.isActive = false;
    },
    pauseGame: (state) => {
      state.isPaused = true;
    },
    resumeGame: (state) => {
      state.isPaused = false;
    },
    resetGame: (state) => {
      const baseTime = (state.selectedTimeControl.minutes * 60 + state.selectedTimeControl.seconds) * 1000;
      state.player1.timeRemaining = baseTime;
      state.player2.timeRemaining = baseTime;
      state.player1.isActive = false;
      state.player2.isActive = false;
      state.player1.isLowTime = false;
      state.player2.isLowTime = false;
      state.isGameActive = false;
      state.isPaused = false;
    },
    setTimeControl: (state, action: PayloadAction<TimeFormat>) => {
      state.selectedTimeControl = action.payload;
      const baseTime = (action.payload.minutes * 60 + action.payload.seconds) * 1000;
      state.player1.timeRemaining = baseTime;
      state.player2.timeRemaining = baseTime;
    },
    setPlayerName: (state, action: PayloadAction<{ player: 'player1' | 'player2'; name: string }>) => {
      const { player, name } = action.payload;
      state.playerNames[player] = name;
      state[player].name = name;
    },
    resetNames: (state) => {
      state.playerNames = initialState.playerNames;
      state.player1.name = initialState.player1.name;
      state.player2.name = initialState.player2.name;
    }
  },
});

export const {
  updateTime,
  switchPlayer,
  startGame,
  pauseGame,
  resumeGame,
  resetGame,
  setTimeControl,
  setPlayerName,
  resetNames
} = timerSlice.actions;

export default timerSlice.reducer; 