import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { setPlayerName, resetNames } from '../store/timerSlice';

const PlayerSettings = () => {
  const dispatch = useAppDispatch();
  const playerNames = useAppSelector((state) => state.timer.playerNames);
  const [name1, setName1] = useState(playerNames.player1);
  const [name2, setName2] = useState(playerNames.player2);

  const handleSave = () => {
    dispatch(setPlayerName({ player: 'player1', name: name1 || 'Player 1' }));
    dispatch(setPlayerName({ player: 'player2', name: name2 || 'Player 2' }));
  };

  const handleReset = () => {
    dispatch(resetNames());
    setName1('Player 1');
    setName2('Player 2');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player Names</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Player 1</Text>
        <TextInput
          style={styles.input}
          value={name1}
          onChangeText={setName1}
          placeholder="Enter name"
          placeholderTextColor="#666"
          maxLength={20}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Player 2</Text>
        <TextInput
          style={styles.input}
          value={name2}
          onChangeText={setName2}
          placeholder="Enter name"
          placeholderTextColor="#666"
          maxLength={20}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Names</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={handleReset}
        >
          <Text style={[styles.buttonText, styles.resetButtonText]}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#4a1a1a',
  },
  resetButtonText: {
    color: '#ff4444',
  },
});

export default PlayerSettings; 