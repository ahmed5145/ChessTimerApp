import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setPlayerName, setTheme, setAccentColor } from '../store/playerSlice';
import ColorPicker from './ColorPicker';

const PlayerSettings = () => {
  const dispatch = useDispatch();
  const {
    player1Name,
    player2Name,
    theme,
    accentColor,
  } = useSelector((state: RootState) => state.player);

  const handleNameChange = (player: 1 | 2, name: string) => {
    dispatch(setPlayerName({ player, name }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Player Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Player 1</Text>
        <TextInput
          style={styles.input}
          value={player1Name}
          onChangeText={(text) => handleNameChange(1, text)}
          placeholder="Enter Player 1 name"
          placeholderTextColor="#666"
          maxLength={20}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Player 2</Text>
        <TextInput
          style={styles.input}
          value={player2Name}
          onChangeText={(text) => handleNameChange(2, text)}
          placeholder="Enter Player 2 name"
          placeholderTextColor="#666"
          maxLength={20}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.themeContainer}>
          <Text style={styles.label}>Theme</Text>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={() => dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))}
          >
            <Text style={styles.buttonText}>{theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.colorContainer}>
          <Text style={styles.label}>Accent Color</Text>
          <ColorPicker
            selectedColor={accentColor}
            onColorChange={(color) => dispatch(setAccentColor(color))}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  themeContainer: {
    marginBottom: 16,
  },
  colorContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  themeButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlayerSettings; 