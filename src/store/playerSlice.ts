import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
  player1Name: string;
  player2Name: string;
  theme: 'dark' | 'light';
  accentColor: string;
}

const initialState: PlayerState = {
  player1Name: 'Player 1',
  player2Name: 'Player 2',
  theme: 'dark',
  accentColor: '#007AFF', // Default iOS blue
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayer1Name: (state, action: PayloadAction<string>) => {
      state.player1Name = action.payload || 'Player 1';
    },
    setPlayer2Name: (state, action: PayloadAction<string>) => {
      state.player2Name = action.payload || 'Player 2';
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
    },
    resetNames: (state) => {
      state.player1Name = 'Player 1';
      state.player2Name = 'Player 2';
    },
  },
});

export const {
  setPlayer1Name,
  setPlayer2Name,
  setTheme,
  setAccentColor,
  resetNames,
} = playerSlice.actions;

export default playerSlice.reducer; 