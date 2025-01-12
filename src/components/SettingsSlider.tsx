import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

interface SettingsSliderProps {
  label: string;
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
}

const SettingsSlider: React.FC<SettingsSliderProps> = ({
  label,
  value,
  options,
  onValueChange,
}) => {
  const currentIndex = options.indexOf(value);

  const handleSliderChange = (index: number) => {
    onValueChange(options[Math.round(index)]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={options.length - 1}
        step={1}
        value={currentIndex}
        onValueChange={handleSliderChange}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#1a1a1a"
        thumbTintColor="#007AFF"
      />
      <View style={styles.labelsContainer}>
        {options.map((option, index) => (
          <Text
            key={option}
            style={[
              styles.optionLabel,
              currentIndex === index && styles.selectedOptionLabel,
            ]}
          >
            {option}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: '#fff',
    fontSize: 16,
  },
  value: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  optionLabel: {
    color: '#666',
    fontSize: 12,
  },
  selectedOptionLabel: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default SettingsSlider; 