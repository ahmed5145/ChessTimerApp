import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { setTimeControl } from '../store/timerSlice';
import { DEFAULT_TIME_CONTROLS } from '../utils/timeUtils';
import type { TimeFormat } from '../types/timer';

const TimeControl = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const selectedTimeControl = useAppSelector((state) => state.timer.selectedTimeControl);
  
  const [customMinutes, setCustomMinutes] = useState('5');
  const [customSeconds, setCustomSeconds] = useState('0');
  const [customIncrement, setCustomIncrement] = useState('0');

  const handlePresetSelect = (timeControl: TimeFormat) => {
    dispatch(setTimeControl(timeControl));
    navigation.goBack();
  };

  const handleCustomTimeControl = () => {
    const minutes = Math.min(Math.max(parseInt(customMinutes) || 0, 0), 180);
    const seconds = Math.min(Math.max(parseInt(customSeconds) || 0, 0), 59);
    const increment = Math.min(Math.max(parseInt(customIncrement) || 0, 0), 60);

    const customTimeControl: TimeFormat = {
      id: 'custom',
      name: `Custom ${minutes}:${seconds.toString().padStart(2, '0')} +${increment}`,
      minutes,
      seconds,
      increment,
    };

    dispatch(setTimeControl(customTimeControl));
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.presetContainer} horizontal showsHorizontalScrollIndicator={false}>
        {DEFAULT_TIME_CONTROLS.map((timeControl) => (
          <TouchableOpacity
            key={timeControl.id}
            style={[
              styles.presetButton,
              selectedTimeControl.id === timeControl.id && styles.selectedPreset,
            ]}
            onPress={() => handlePresetSelect(timeControl)}
          >
            <Text style={[
              styles.presetText,
              selectedTimeControl.id === timeControl.id && styles.selectedPresetText,
            ]}>
              {timeControl.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.customContainer}>
        <Text style={styles.sectionTitle}>Custom Time Control</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Minutes</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={customMinutes}
              onChangeText={setCustomMinutes}
              maxLength={3}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Seconds</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={customSeconds}
              onChangeText={(text) => {
                const seconds = parseInt(text) || 0;
                if (seconds <= 59) {
                  setCustomSeconds(text);
                }
              }}
              maxLength={2}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Increment</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={customIncrement}
              onChangeText={setCustomIncrement}
              maxLength={2}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleCustomTimeControl}
        >
          <Text style={styles.applyButtonText}>Apply Custom Time</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  presetContainer: {
    padding: 10,
  },
  presetButton: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  selectedPreset: {
    backgroundColor: '#007AFF',
  },
  presetText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedPresetText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  customContainer: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TimeControl; 