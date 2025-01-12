import AsyncStorage from '@react-native-async-storage/async-storage';

interface GameStats {
  date: string;
  duration: number;
  winner: 'player1' | 'player2';
  endReason: 'timeout' | 'checkmate' | 'resignation';
  timeControl: {
    minutes: number;
    seconds: number;
    increment: number;
  };
  timeRemaining: {
    winner: number;
    loser: number;
  };
  moves: {
    total: number;
    player1: number;
    player2: number;
    avgTimePerMove: {
      player1: number;
      player2: number;
    };
  };
}

class StatsManager {
  private readonly STATS_KEY = '@chess_timer_stats';
  private readonly MAX_STORED_GAMES = 50;

  async saveGameStats(stats: GameStats) {
    try {
      const existingStatsString = await AsyncStorage.getItem(this.STATS_KEY);
      const existingStats: GameStats[] = existingStatsString ? JSON.parse(existingStatsString) : [];

      // Add new game stats at the beginning
      existingStats.unshift(stats);

      // Keep only the latest MAX_STORED_GAMES games
      const trimmedStats = existingStats.slice(0, this.MAX_STORED_GAMES);

      await AsyncStorage.setItem(this.STATS_KEY, JSON.stringify(trimmedStats));
      console.log('Game stats saved successfully');
    } catch (error) {
      console.error('Error saving game stats:', error);
    }
  }

  async getGameStats(): Promise<GameStats[]> {
    try {
      const statsString = await AsyncStorage.getItem(this.STATS_KEY);
      return statsString ? JSON.parse(statsString) : [];
    } catch (error) {
      console.error('Error retrieving game stats:', error);
      return [];
    }
  }

  async getWinRate(): Promise<{ player1: number; player2: number }> {
    const stats = await this.getGameStats();
    const totalGames = stats.length;
    if (totalGames === 0) return { player1: 0, player2: 0 };

    const player1Wins = stats.filter(game => game.winner === 'player1').length;
    return {
      player1: (player1Wins / totalGames) * 100,
      player2: ((totalGames - player1Wins) / totalGames) * 100
    };
  }

  async getAverageGameDuration(): Promise<number> {
    const stats = await this.getGameStats();
    if (stats.length === 0) return 0;

    const totalDuration = stats.reduce((sum, game) => sum + game.duration, 0);
    return totalDuration / stats.length;
  }

  async getAverageMovesPerGame(): Promise<{ total: number; player1: number; player2: number }> {
    const stats = await this.getGameStats();
    if (stats.length === 0) return { total: 0, player1: 0, player2: 0 };

    const totals = stats.reduce((acc, game) => ({
      total: acc.total + game.moves.total,
      player1: acc.player1 + game.moves.player1,
      player2: acc.player2 + game.moves.player2
    }), { total: 0, player1: 0, player2: 0 });

    return {
      total: totals.total / stats.length,
      player1: totals.player1 / stats.length,
      player2: totals.player2 / stats.length
    };
  }

  async getAverageTimePerMove(): Promise<{ player1: number; player2: number }> {
    const stats = await this.getGameStats();
    if (stats.length === 0) return { player1: 0, player2: 0 };

    const totals = stats.reduce((acc, game) => ({
      player1: acc.player1 + game.moves.avgTimePerMove.player1,
      player2: acc.player2 + game.moves.avgTimePerMove.player2
    }), { player1: 0, player2: 0 });

    return {
      player1: totals.player1 / stats.length,
      player2: totals.player2 / stats.length
    };
  }

  async clearStats() {
    try {
      await AsyncStorage.removeItem(this.STATS_KEY);
      console.log('Game stats cleared successfully');
    } catch (error) {
      console.error('Error clearing game stats:', error);
    }
  }
}

export const statsManager = new StatsManager(); 