import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

interface SoundPickerProps {
  currentSound: string;
  onSoundSelect: (sound: string) => void;
  label: string;
}

const SOUND_OPTIONS = [
  { id: 'default', name: 'Default' },
  { id: 'click', name: 'Click' },
  { id: 'beep', name: 'Beep' },
  { id: 'tick', name: 'Tick' },
  { id: 'bell', name: 'Bell' },
];

const SoundPicker: React.FC<SoundPickerProps> = ({
  currentSound,
  onSoundSelect,
  label,
}) => {
  const playSound = async (soundId: string) => {
    try {
      const soundFile = require(`../../assets/${soundId}.mp3`);
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      // Unload sound after playing
      sound.unloadAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsContainer}>
        {SOUND_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              currentSound === option.id && styles.selectedOption,
            ]}
            onPress={() => {
              onSoundSelect(option.id);
              playSound(option.id);
            }}
          >
            <Text
              style={[
                styles.optionText,
                currentSound === option.id && styles.selectedOptionText,
              ]}
            >
              {option.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    backgroundColor: '#1a1a1a',
    padding: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
});

export default SoundPicker; 