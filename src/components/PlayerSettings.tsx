import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  setPlayer1Name,
  setPlayer2Name,
  setTheme,
  setAccentColor,
  resetNames,
} from '../store/playerSlice';
import ColorPicker from '../components/ColorPicker';

const PlayerSettings = () => {
  const dispatch = useDispatch();
  const { player1Name, player2Name, theme, accentColor } = useSelector(
    (state: RootState) => state.player
  );

  const handleThemeToggle = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  const handleColorChange = (color: string) => {
    dispatch(setAccentColor(color));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player Settings</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Player 1 Name</Text>
        <TextInput
          style={styles.input}
          value={player1Name}
          onChangeText={(text) => dispatch(setPlayer1Name(text))}
          placeholder="Enter Player 1 name"
          placeholderTextColor="#666"
          maxLength={20}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Player 2 Name</Text>
        <TextInput
          style={styles.input}
          value={player2Name}
          onChangeText={(text) => dispatch(setPlayer2Name(text))}
          placeholder="Enter Player 2 name"
          placeholderTextColor="#666"
          maxLength={20}
        />
      </View>

      <View style={styles.themeContainer}>
        <Text style={styles.label}>Theme</Text>
        <TouchableOpacity
          style={[styles.themeButton, theme === 'dark' && styles.activeTheme]}
          onPress={handleThemeToggle}
        >
          <Text style={styles.buttonText}>{theme === 'dark' ? 'Dark' : 'Light'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.colorContainer}>
        <Text style={styles.label}>Accent Color</Text>
        <ColorPicker
          selectedColor={accentColor}
          onColorChange={handleColorChange}
        />
      </View>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => dispatch(resetNames())}
      >
        <Text style={styles.resetButtonText}>Reset Names</Text>
      </TouchableOpacity>
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
  themeContainer: {
    marginBottom: 16,
  },
  themeButton: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTheme: {
    backgroundColor: '#007AFF',
  },
  colorContainer: {
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#4a1a1a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlayerSettings; 