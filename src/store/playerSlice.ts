import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageSourcePropType } from 'react-native';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: string;
  unlockedAt?: Date;
  progress: number;
  requiredProgress: number;
}

export const ACHIEVEMENTS = {
  FIRST_WIN: {
    id: 'first_win',
    title: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
    reward: 'Gold Theme Unlocked',
    requiredProgress: 1
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Win 5 bullet games',
    icon: '⚡',
    reward: 'Lightning Animation Effect',
    requiredProgress: 5
  },
  TIME_MASTER: {
    id: 'time_master',
    title: 'Time Master',
    description: 'Win with less than 5 seconds remaining',
    icon: '⏰',
    reward: 'Special Clock Icon',
    requiredProgress: 1
  },
  WINNING_STREAK: {
    id: 'winning_streak',
    title: 'Winning Streak',
    description: 'Win 3 games in a row',
    icon: '🔥',
    reward: 'Fire Animation Effect',
    requiredProgress: 3
  },
  ODDS_MASTER: {
    id: 'odds_master',
    title: 'Odds Master',
    description: 'Win a game with time odds against you',
    icon: '⚖️',
    reward: 'Special Profile Badge',
    requiredProgress: 1
  }
};

export interface PlayerState {
  player1Name: string;
  player2Name: string;
  theme: 'light' | 'dark' | 'gold';
  accentColor: string;
  player1Avatar: string | null;
  player2Avatar: string | null;
  soundEnabled: boolean;
  moveSound: string;
  lowTimeSound: string;
  victorySound: string;
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
  socialFeatures: {
    shareStats: boolean;
    publicProfile: boolean;
    showRating: boolean;
  };
  achievements: Achievement[];
  stats: {
    winRate: number;
    gamesPlayed: number;
    avgTimePerMove: number;
    highestWinStreak: number;
    currentWinStreak: number;
    bulletGamesWon: number;
  };
}

const initialState: PlayerState = {
  player1Name: 'Player 1',
  player2Name: 'Player 2',
  theme: 'light',
  accentColor: '#007AFF',
  player1Avatar: null,
  player2Avatar: null,
  soundEnabled: true,
  moveSound: 'default',
  lowTimeSound: 'default',
  victorySound: 'default',
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
  achievements: Object.values(ACHIEVEMENTS).map(achievement => ({
    ...achievement,
    progress: 0,
    unlockedAt: undefined
  })),
  stats: {
    winRate: 0,
    gamesPlayed: 0,
    avgTimePerMove: 0,
    highestWinStreak: 0,
    currentWinStreak: 0,
    bulletGamesWon: 0,
  },
};

const saveState = async (state: PlayerState) => {
  try {
    await AsyncStorage.setItem('@chess_timer_state', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state:', error);
  }
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
      saveState(state);
    },
    setTheme: (state, action: PayloadAction<PlayerState['theme']>) => {
      state.theme = action.payload;
      saveState(state);
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
      saveState(state);
    },
    setAvatar: (state, action: PayloadAction<{ player: 1 | 2; avatar: string }>) => {
      if (action.payload.player === 1) {
        state.player1Avatar = action.payload.avatar;
      } else {
        state.player2Avatar = action.payload.avatar;
      }
      saveState(state);
    },
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
      saveState(state);
    },
    setSound: (state, action: PayloadAction<{ type: 'move' | 'lowTime' | 'victory'; sound: string }>) => {
      switch (action.payload.type) {
        case 'move':
          state.moveSound = action.payload.sound;
          break;
        case 'lowTime':
          state.lowTimeSound = action.payload.sound;
          break;
        case 'victory':
          state.victorySound = action.payload.sound;
          break;
      }
      saveState(state);
    },
    updateAchievementProgress: (state, action: PayloadAction<{ achievementId: string; progress: number }>) => {
      const achievement = state.achievements.find(a => a.id === action.payload.achievementId);
      if (achievement) {
        achievement.progress = action.payload.progress;
        if (achievement.progress >= achievement.requiredProgress && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date();
          // Handle achievement rewards here
          if (achievement.id === 'first_win') {
            state.theme = 'gold';
          }
        }
        saveState(state);
      }
    },
    updateStats: (state, action: PayloadAction<{
      isWin: boolean;
      isBullet: boolean;
      avgMoveTime: number;
    }>) => {
      const { isWin, isBullet, avgMoveTime } = action.payload;
      state.stats.gamesPlayed++;
      
      if (isWin) {
        state.stats.currentWinStreak++;
        state.stats.highestWinStreak = Math.max(state.stats.highestWinStreak, state.stats.currentWinStreak);
        if (isBullet) {
          state.stats.bulletGamesWon++;
        }
      } else {
        state.stats.currentWinStreak = 0;
      }

      state.stats.winRate = (state.stats.bulletGamesWon / state.stats.gamesPlayed) * 100;
      state.stats.avgTimePerMove = avgMoveTime;
      
      // Check achievements
      if (isWin) {
        if (state.stats.gamesPlayed === 1) {
          const achievement = state.achievements.find(a => a.id === 'first_win');
          if (achievement) {
            achievement.progress = 1;
            if (!achievement.unlockedAt) {
              achievement.unlockedAt = new Date();
              state.theme = 'gold';
            }
          }
        }
        if (state.stats.currentWinStreak >= 3) {
          const achievement = state.achievements.find(a => a.id === 'winning_streak');
          if (achievement) {
            achievement.progress = state.stats.currentWinStreak;
            if (achievement.progress >= achievement.requiredProgress && !achievement.unlockedAt) {
              achievement.unlockedAt = new Date();
            }
          }
        }
        if (state.stats.bulletGamesWon >= 5) {
          const achievement = state.achievements.find(a => a.id === 'speed_demon');
          if (achievement) {
            achievement.progress = state.stats.bulletGamesWon;
            if (achievement.progress >= achievement.requiredProgress && !achievement.unlockedAt) {
              achievement.unlockedAt = new Date();
            }
          }
        }
      }
      
      saveState(state);
    },
  },
});

export const {
  setPlayerName,
  setTheme,
  setAccentColor,
  setAvatar,
  setSoundEnabled,
  setSound,
  updateAchievementProgress,
  updateStats,
} = playerSlice.actions;

export default playerSlice.reducer; 