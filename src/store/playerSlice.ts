import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PlayerStats {
  gamesPlayed: number;
  averageTimePerMove: number;
  favoriteTimeControl: string;
}

interface PlayerState {
  player1Name: string;
  player2Name: string;
  theme: 'dark' | 'light' | 'minimalist' | 'colorblind' | 'classic';
  accentColor: string;
  player1Avatar: string | null;
  player2Avatar: string | null;
  player1Stats: PlayerStats;
  player2Stats: PlayerStats;
  preferredSide1: 'top' | 'bottom';
  preferredSide2: 'top' | 'bottom';
  customSoundEffects: {
    player1Move: string;
    player2Move: string;
    lowTime: string;
    gameEnd: string;
  };
  animationSpeed: 'slow' | 'normal' | 'fast';
  hapticIntensity: 'off' | 'light' | 'medium' | 'heavy';
}

interface PlayerAvatarPayload {
  playerId: number;
  avatar: string;
}

interface PreferredSidePayload {
  playerId: number;
  side: string;
}

const initialState: PlayerState = {
  player1Name: 'Player 1',
  player2Name: 'Player 2',
  theme: 'dark',
  accentColor: '#007AFF',
  player1Avatar: null,
  player2Avatar: null,
  player1Stats: {
    gamesPlayed: 0,
    averageTimePerMove: 0,
    favoriteTimeControl: '5+3',
  },
  player2Stats: {
    gamesPlayed: 0,
    averageTimePerMove: 0,
    favoriteTimeControl: '5+3',
  },
  preferredSide1: 'bottom',
  preferredSide2: 'top',
  customSoundEffects: {
    player1Move: 'default',
    player2Move: 'default',
    lowTime: 'default',
    gameEnd: 'default',
  },
  animationSpeed: 'normal',
  hapticIntensity: 'medium',
};

// Helper function to save state to AsyncStorage
const saveStateToStorage = async (state: PlayerState) => {
  try {
    await AsyncStorage.setItem('@chess_timer_settings', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const loadSettings = createAsyncThunk(
  'player/loadSettings',
  async () => {
    const savedSettings = await AsyncStorage.getItem('@chess_timer_settings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return null;
  }
);

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayer1Name: (state, action: PayloadAction<string>) => {
      state.player1Name = action.payload || 'Player 1';
      saveStateToStorage(state);
    },
    setPlayer2Name: (state, action: PayloadAction<string>) => {
      state.player2Name = action.payload || 'Player 2';
      saveStateToStorage(state);
    },
    setTheme: (state, action: PayloadAction<PlayerState['theme']>) => {
      state.theme = action.payload;
      saveStateToStorage(state);
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
      saveStateToStorage(state);
    },
    setPlayerAvatar: (state, action: PayloadAction<PlayerAvatarPayload>) => {
      if (action.payload.playerId === 1) {
        state.player1Avatar = action.payload.avatar;
      } else {
        state.player2Avatar = action.payload.avatar;
      }
      saveStateToStorage(state);
    },
    setPreferredSide: (state, action: PayloadAction<PreferredSidePayload>) => {
      if (action.payload.playerId === 1) {
        state.preferredSide1 = action.payload.side as 'top' | 'bottom';
      } else {
        state.preferredSide2 = action.payload.side as 'top' | 'bottom';
      }
      saveStateToStorage(state);
    },
    setCustomSound: (state, action: PayloadAction<{ type: keyof PlayerState['customSoundEffects']; sound: string }>) => {
      state.customSoundEffects[action.payload.type] = action.payload.sound;
      saveStateToStorage(state);
    },
    setAnimationSpeed: (state, action: PayloadAction<PlayerState['animationSpeed']>) => {
      state.animationSpeed = action.payload;
      saveStateToStorage(state);
    },
    setHapticIntensity: (state, action: PayloadAction<PlayerState['hapticIntensity']>) => {
      state.hapticIntensity = action.payload;
      saveStateToStorage(state);
    },
    loadSavedSettings: (state, action: PayloadAction<PlayerState>) => {
      return { ...action.payload };
    },
    resetSettings: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadSettings.fulfilled, (state, action) => {
      if (action.payload) {
        return { ...action.payload };
      }
    });
  },
});

export const {
  setPlayer1Name,
  setPlayer2Name,
  setTheme,
  setAccentColor,
  setPlayerAvatar,
  setPreferredSide,
  setCustomSound,
  setAnimationSpeed,
  setHapticIntensity,
  loadSavedSettings,
  resetSettings,
} = playerSlice.actions;

export default playerSlice.reducer; 