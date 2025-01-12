import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Switch } from 'react-native';
import { soundManager } from '../utils/soundUtils';
import PlayerSettings from './PlayerSettings';

const Settings = () => {
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [volume, setVolume] = React.useState(0.7);
  const [hapticEnabled, setHapticEnabled] = React.useState(true);
  const [lowTimeWarning, setLowTimeWarning] = React.useState(true);

  useEffect(() => {
    soundManager.setMuted(!soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    soundManager.setVolume(volume);
    if (soundEnabled) {
      soundManager.play('click');
    }
  }, [volume]);

  const handleVolumeChange = (value: number) => {
    setVolume(value);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sound Settings</Text>
        <View style={styles.setting}>
          <Text style={styles.label}>Sound Effects</Text>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={soundEnabled ? '#007AFF' : '#f4f3f4'}
          />
        </View>
        
        {soundEnabled && (
          <View style={styles.setting}>
            <Text style={styles.label}>Volume</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#767577"
            />
          </View>
        )}

        <View style={styles.setting}>
          <Text style={styles.label}>Haptic Feedback</Text>
          <Switch
            value={hapticEnabled}
            onValueChange={setHapticEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={hapticEnabled ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.setting}>
          <Text style={styles.label}>Low Time Warning</Text>
          <Switch
            value={lowTimeWarning}
            onValueChange={setLowTimeWarning}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={lowTimeWarning ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <PlayerSettings />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    fontSize: 16,
  },
  slider: {
    flex: 1,
    marginLeft: 16,
  },
});

export default Settings; 