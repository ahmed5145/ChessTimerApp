import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const COLORS = [
  '#007AFF', // iOS Blue
  '#34C759', // iOS Green
  '#FF9500', // iOS Orange
  '#FF2D55', // iOS Pink
  '#5856D6', // iOS Purple
  '#FF3B30', // iOS Red
];

const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange }) => {
  return (
    <View style={styles.container}>
      {COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorButton,
            { backgroundColor: color },
            selectedColor === color && styles.selectedColor,
          ]}
          onPress={() => onColorChange(color)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#fff',
  },
});

export default ColorPicker; 