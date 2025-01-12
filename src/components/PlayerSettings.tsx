import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
  setPlayer1Name,
  setPlayer2Name,
  setTheme,
  setAccentColor,
  setPlayerAvatar,
  setPreferredSide,
  setCustomSound,
  setAnimationSpeed,
  setHapticIntensity,
  loadSettings,
  resetSettings,
} from '../store/playerSlice';
import ColorPicker from './ColorPicker';
import AvatarPicker from './AvatarPicker';
import SoundPicker from './SoundPicker';
import ThemePicker from './ThemePicker';
import SettingsSlider from './SettingsSlider';

const PlayerSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    player1Name,
    player2Name,
    theme,
    accentColor,
    player1Avatar,
    player2Avatar,
    customSoundEffects,
    animationSpeed,
    hapticIntensity,
    preferredSide1,
    preferredSide2,
  } = useSelector((state: RootState) => state.player);

  useEffect(() => {
    dispatch(loadSettings());
  }, [dispatch]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Player Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Player 1</Text>
        <TextInput
          style={styles.input}
          value={player1Name}
          onChangeText={(text) => dispatch(setPlayer1Name(text))}
          placeholder="Enter Player 1 name"
          placeholderTextColor="#666"
          maxLength={20}
        />
        <AvatarPicker
          currentAvatar={player1Avatar}
          onAvatarSelect={(uri) => dispatch(setPlayerAvatar({ playerId: 1, avatar: uri }))}
          label="Player 1 Avatar"
        />
        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => dispatch(setPreferredSide({ playerId: 1, side: preferredSide1 === 'top' ? 'bottom' : 'top' }))}
        >
          <Text style={styles.buttonText}>Preferred Side: {preferredSide1}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Player 2</Text>
        <TextInput
          style={styles.input}
          value={player2Name}
          onChangeText={(text) => dispatch(setPlayer2Name(text))}
          placeholder="Enter Player 2 name"
          placeholderTextColor="#666"
          maxLength={20}
        />
        <AvatarPicker
          currentAvatar={player2Avatar}
          onAvatarSelect={(uri) => dispatch(setPlayerAvatar({ playerId: 2, avatar: uri }))}
          label="Player 2 Avatar"
        />
        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => dispatch(setPreferredSide({ playerId: 2, side: preferredSide2 === 'top' ? 'bottom' : 'top' }))}
        >
          <Text style={styles.buttonText}>Preferred Side: {preferredSide2}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <ThemePicker
          currentTheme={theme}
          onThemeSelect={(newTheme) => dispatch(setTheme(newTheme))}
        />
        <ColorPicker
          selectedColor={accentColor}
          onColorChange={(color) => dispatch(setAccentColor(color))}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sound Effects</Text>
        <SoundPicker
          currentSound={customSoundEffects.player1Move}
          onSoundSelect={(sound) => dispatch(setCustomSound({ type: 'player1Move', sound }))}
          label="Player 1 Move Sound"
        />
        <SoundPicker
          currentSound={customSoundEffects.player2Move}
          onSoundSelect={(sound) => dispatch(setCustomSound({ type: 'player2Move', sound }))}
          label="Player 2 Move Sound"
        />
        <SoundPicker
          currentSound={customSoundEffects.lowTime}
          onSoundSelect={(sound) => dispatch(setCustomSound({ type: 'lowTime', sound }))}
          label="Low Time Warning"
        />
        <SoundPicker
          currentSound={customSoundEffects.gameEnd}
          onSoundSelect={(sound) => dispatch(setCustomSound({ type: 'gameEnd', sound }))}
          label="Game End Sound"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Animation & Feedback</Text>
        <SettingsSlider
          label="Animation Speed"
          value={animationSpeed}
          options={['slow', 'normal', 'fast']}
          onValueChange={(value) => dispatch(setAnimationSpeed(value as any))}
        />
        <SettingsSlider
          label="Haptic Feedback"
          value={hapticIntensity}
          options={['off', 'light', 'medium', 'heavy']}
          onValueChange={(value) => dispatch(setHapticIntensity(value as any))}
        />
      </View>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => dispatch(resetSettings())}
      >
        <Text style={styles.resetButtonText}>Reset All Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  sideButton: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#4a1a1a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  resetButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlayerSettings; 