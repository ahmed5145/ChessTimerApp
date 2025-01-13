import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageSourcePropType } from 'react-native';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: ImageSourcePropType;
  unlockedAt?: Date;
}

export interface PlayerStats {
  winRate: number;
  gamesPlayed: number;
  avgTimePerMove: number;
  highestWinStreak: number;
}

export interface SocialFeatures {
  shareStats: boolean;
  publicProfile: boolean;
  showRating: boolean;
}

export interface PlayerState {
  player1Name: string;
  player2Name: string;
  theme: 'light' | 'dark';
  accentColor: string;
  timeOdds: {
    enabled: boolean;
    player1: {
      minutes: number;
      seconds: number;
      increment: number;
    };
    player2: {
      minutes: number;
      seconds: number;
      increment: number;
    };
  };
  socialFeatures: SocialFeatures;
  achievements: Achievement[];
  stats: PlayerStats;
}

const initialState: PlayerState = {
  player1Name: 'Player 1',
  player2Name: 'Player 2',
  theme: 'light',
  accentColor: '#007AFF',
  timeOdds: {
    enabled: false,
    player1: {
      minutes: 5,
      seconds: 0,
      increment: 3,
    },
    player2: {
      minutes: 5,
      seconds: 0,
      increment: 3,
    },
  },
  socialFeatures: {
    shareStats: true,
    publicProfile: false,
    showRating: true,
  },
  achievements: [],
  stats: {
    winRate: 0,
    gamesPlayed: 0,
    avgTimePerMove: 0,
    highestWinStreak: 0,
  },
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerName: (state, action: PayloadAction<{ player: 1 | 2; name: string }>) => {
      if (action.payload.player === 1) {
        state.player1Name = action.payload.name;
      } else {
        state.player2Name = action.payload.name;
      }
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
    },
    toggleTimeOdds: (state, action: PayloadAction<boolean>) => {
      state.timeOdds.enabled = action.payload;
    },
    setTimeOdds: (state, action: PayloadAction<{
      player: 1 | 2;
      time: { minutes: number; seconds: number; increment: number };
    }>) => {
      const target = action.payload.player === 1 ? state.timeOdds.player1 : state.timeOdds.player2;
      target.minutes = action.payload.time.minutes;
      target.seconds = action.payload.time.seconds;
      target.increment = action.payload.time.increment;
    },
    toggleSocialSetting: (state, action: PayloadAction<{
      setting: keyof SocialFeatures;
      value: boolean;
    }>) => {
      state.socialFeatures[action.payload.setting] = action.payload.value;
    },
    updateStats: (state, action: PayloadAction<Partial<PlayerStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    unlockAchievement: (state, action: PayloadAction<Achievement>) => {
      const achievement = state.achievements.find(a => a.id === action.payload.id);
      if (achievement) {
        achievement.unlockedAt = new Date();
      } else {
        state.achievements.push({ ...action.payload, unlockedAt: new Date() });
      }
    },
  },
});

export const {
  setPlayerName,
  setTheme,
  setAccentColor,
  toggleTimeOdds,
  setTimeOdds,
  toggleSocialSetting,
  updateStats,
  unlockAchievement,
} = playerSlice.actions;

export default playerSlice.reducer; 