import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface ThemePickerProps {
  currentTheme: string;
  onThemeSelect: (theme: 'dark' | 'light' | 'minimalist' | 'colorblind' | 'classic') => void;
}

const THEMES = [
  { id: 'dark', name: 'Dark', color: '#1a1a1a' },
  { id: 'light', name: 'Light', color: '#ffffff' },
  { id: 'minimalist', name: 'Minimalist', color: '#2c3e50' },
  { id: 'colorblind', name: 'Colorblind', color: '#006699' },
  { id: 'classic', name: 'Classic', color: '#8b4513' },
];

const ThemePicker: React.FC<ThemePickerProps> = ({ currentTheme, onThemeSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Theme</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.themesContainer}>
          {THEMES.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeOption,
                { backgroundColor: theme.color },
                currentTheme === theme.id && styles.selectedTheme,
              ]}
              onPress={() => onThemeSelect(theme.id as any)}
            >
              <View style={styles.themePreview}>
                <Text
                  style={[
                    styles.themeName,
                    { color: theme.id === 'light' ? '#000' : '#fff' },
                  ]}
                >
                  {theme.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  themesContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  themeOption: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  selectedTheme: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  themePreview: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    width: '100%',
  },
  themeName: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ThemePicker; 