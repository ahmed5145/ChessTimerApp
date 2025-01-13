import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setTimeOdds, toggleTimeOdds } from '../store/playerSlice';
import TimeControlPicker from './TimeControlPicker';
import { TimeSettings } from '../types';

const TimeOdds = () => {
  const dispatch = useDispatch();
  const { timeOdds, player1Name, player2Name } = useSelector((state: RootState) => state.player);

  const handleTimeChange = (player: 1 | 2, time: TimeSettings) => {
    dispatch(setTimeOdds({ player, time }));
  };

  const handleToggleTimeOdds = (value: boolean) => {
    dispatch(toggleTimeOdds(value));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Time Odds</Text>
        <Switch
          value={timeOdds.enabled}
          onValueChange={handleToggleTimeOdds}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={timeOdds.enabled ? '#007AFF' : '#f4f3f4'}
        />
      </View>

      <View style={styles.playerSection}>
        <Text style={styles.playerTitle}>{player1Name}</Text>
        <TimeControlPicker
          initialMinutes={timeOdds.player1.minutes}
          initialSeconds={timeOdds.player1.seconds}
          initialIncrement={timeOdds.player1.increment}
          onTimeChange={(time: TimeSettings) => handleTimeChange(1, time)}
          disabled={!timeOdds.enabled}
        />
      </View>

      <View style={styles.playerSection}>
        <Text style={styles.playerTitle}>{player2Name}</Text>
        <TimeControlPicker
          initialMinutes={timeOdds.player2.minutes}
          initialSeconds={timeOdds.player2.seconds}
          initialIncrement={timeOdds.player2.increment}
          onTimeChange={(time: TimeSettings) => handleTimeChange(2, time)}
          disabled={!timeOdds.enabled}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  playerSection: {
    marginBottom: 24,
  },
  playerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});

export default TimeOdds; 