import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { statsManager } from '../utils/statsUtils';
import { formatTime } from '../utils/timeUtils';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface GameStats {
  date: string;
  duration: number;
  winner: 'player1' | 'player2';
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
  endReason: string;
}

const Stats = () => {
  const [stats, setStats] = useState<GameStats[]>([]);
  const { player1Name, player2Name } = useSelector((state: RootState) => state.player);
  const [winRate, setWinRate] = useState({ player1: 0, player2: 0 });
  const [avgDuration, setAvgDuration] = useState(0);
  const [avgMoves, setAvgMoves] = useState({ total: 0, player1: 0, player2: 0 });
  const [avgTimePerMove, setAvgTimePerMove] = useState({ player1: 0, player2: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const gameStats = await statsManager.getGameStats();
    const winRateStats = await statsManager.getWinRate();
    const averageDuration = await statsManager.getAverageGameDuration();
    const averageMoves = await statsManager.getAverageMovesPerGame();
    const averageTimePerMove = await statsManager.getAverageTimePerMove();

    setStats(gameStats);
    setWinRate(winRateStats);
    setAvgDuration(averageDuration);
    setAvgMoves(averageMoves);
    setAvgTimePerMove(averageTimePerMove);
  };

  const handleClearStats = async () => {
    await statsManager.clearStats();
    await loadStats();
  };

  const formatTimeControl = (tc: GameStats['timeControl']) => {
    return `${tc.minutes}:${tc.seconds.toString().padStart(2, '0')} + ${tc.increment}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <View style={styles.winRateContainer}>
          <Text style={styles.title}>Win Rate</Text>
          <View style={styles.winRateBar}>
            <View style={[styles.winRatePlayer1, { flex: winRate.player1 }]} />
            <View style={[styles.winRatePlayer2, { flex: winRate.player2 }]} />
          </View>
          <View style={styles.winRateLabels}>
            <Text style={styles.label}>{player1Name}: {winRate.player1.toFixed(1)}%</Text>
            <Text style={styles.label}>{player2Name}: {winRate.player2.toFixed(1)}%</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Avg. Game Duration</Text>
            <Text style={styles.statsValue}>{formatTime(avgDuration)}</Text>
          </View>
          
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Avg. Moves per Game</Text>
            <Text style={styles.statsValue}>{avgMoves.total.toFixed(1)}</Text>
            <View style={styles.statsDetails}>
              <Text style={styles.detailText}>{player1Name}: {avgMoves.player1.toFixed(1)}</Text>
              <Text style={styles.detailText}>{player2Name}: {avgMoves.player2.toFixed(1)}</Text>
            </View>
          </View>

          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Avg. Time per Move</Text>
            <View style={styles.statsDetails}>
              <Text style={styles.detailText}>{player1Name}: {formatTime(avgTimePerMove.player1)}</Text>
              <Text style={styles.detailText}>{player2Name}: {formatTime(avgTimePerMove.player2)}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.title}>Recent Games</Text>
      <ScrollView style={styles.gamesList}>
        {stats.map((game, index) => (
          <View key={index} style={styles.gameItem}>
            <View style={styles.gameHeader}>
              <Text style={styles.date}>{new Date(game.date).toLocaleDateString()}</Text>
              <Text style={[
                styles.winner,
                game.winner === 'player1' ? styles.player1Text : styles.player2Text
              ]}>
                {game.winner === 'player1' ? player1Name : player2Name} won
                ({game.endReason})
              </Text>
            </View>
            <View style={styles.gameDetails}>
              <Text style={styles.detail}>Time Control: {formatTimeControl(game.timeControl)}</Text>
              <Text style={styles.detail}>Duration: {formatTime(game.duration)}</Text>
              <Text style={styles.detail}>
                Moves: {game.moves.total} ({player1Name}: {game.moves.player1}, {player2Name}: {game.moves.player2})
              </Text>
              <Text style={styles.detail}>
                Avg. Move Time: {player1Name}: {formatTime(game.moves.avgTimePerMove.player1)},
                {player2Name}: {formatTime(game.moves.avgTimePerMove.player2)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.clearButton} onPress={handleClearStats}>
        <Text style={styles.clearButtonText}>Clear History</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  summary: {
    marginBottom: 24,
  },
  winRateContainer: {
    marginBottom: 16,
  },
  winRateBar: {
    height: 20,
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 8,
  },
  winRatePlayer1: {
    backgroundColor: '#007AFF',
  },
  winRatePlayer2: {
    backgroundColor: '#4eff4e',
  },
  winRateLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avgDurationContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  label: {
    color: '#fff',
    fontSize: 14,
  },
  gamesList: {
    flex: 1,
  },
  gameItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  date: {
    color: '#888',
  },
  winner: {
    fontWeight: 'bold',
  },
  player1Text: {
    color: '#007AFF',
  },
  player2Text: {
    color: '#4eff4e',
  },
  gameDetails: {
    gap: 4,
  },
  detail: {
    color: '#fff',
  },
  clearButton: {
    backgroundColor: '#4a1a1a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  clearButtonText: {
    color: '#ff4444',
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statsItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    width: '48%',
  },
  statsLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  statsValue: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsDetails: {
    marginTop: 4,
  },
  detailText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default Stats; 