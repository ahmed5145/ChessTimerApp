import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export interface TimeControlPickerProps {
  initialMinutes: number;
  initialSeconds: number;
  initialIncrement: number;
  onTimeChange: (time: { minutes: number; seconds: number; increment: number }) => void;
  disabled?: boolean;
}

const TimeControlPicker: React.FC<TimeControlPickerProps> = ({
  initialMinutes,
  initialSeconds,
  initialIncrement,
  onTimeChange,
  disabled = false,
}) => {
  const [minutes, setMinutes] = useState(initialMinutes.toString());
  const [seconds, setSeconds] = useState(initialSeconds.toString());
  const [increment, setIncrement] = useState(initialIncrement.toString());

  useEffect(() => {
    const validMinutes = Math.max(0, Math.min(180, parseInt(minutes) || 0));
    const validSeconds = Math.max(0, Math.min(59, parseInt(seconds) || 0));
    const validIncrement = Math.max(0, Math.min(60, parseInt(increment) || 0));

    onTimeChange({
      minutes: validMinutes,
      seconds: validSeconds,
      increment: validIncrement,
    });
  }, [minutes, seconds, increment, onTimeChange]);

  const handleAdjust = (field: 'minutes' | 'seconds' | 'increment', amount: number) => {
    if (disabled) return;

    const setValue = field === 'minutes' ? setMinutes : field === 'seconds' ? setSeconds : setIncrement;
    const currentValue = parseInt(field === 'minutes' ? minutes : field === 'seconds' ? seconds : increment) || 0;
    const maxValue = field === 'minutes' ? 180 : field === 'seconds' ? 59 : 60;
    const newValue = Math.max(0, Math.min(maxValue, currentValue + amount));
    setValue(newValue.toString());
  };

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <View style={styles.timeSection}>
        <Text style={styles.label}>Minutes</Text>
        <View style={styles.inputGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAdjust('minutes', -1)}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={minutes}
            onChangeText={setMinutes}
            keyboardType="numeric"
            maxLength={3}
            editable={!disabled}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAdjust('minutes', 1)}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.timeSection}>
        <Text style={styles.label}>Seconds</Text>
        <View style={styles.inputGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAdjust('seconds', -1)}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={seconds}
            onChangeText={setSeconds}
            keyboardType="numeric"
            maxLength={2}
            editable={!disabled}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAdjust('seconds', 1)}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.timeSection}>
        <Text style={styles.label}>Increment</Text>
        <View style={styles.inputGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAdjust('increment', -1)}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={increment}
            onChangeText={setIncrement}
            keyboardType="numeric"
            maxLength={2}
            editable={!disabled}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAdjust('increment', 1)}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  timeSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  button: {
    width: 36,
    height: 36,
    backgroundColor: '#007AFF',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TimeControlPicker; 