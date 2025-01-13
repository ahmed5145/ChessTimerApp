import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setPlayerName, setTheme, setAccentColor, setAvatar, setSoundEnabled, setSound } from '../store/playerSlice';
import ColorPicker from './ColorPicker';
import * as ImagePicker from 'expo-image-picker';
import type { Achievement } from '../store/playerSlice';

const PlayerSettings = () => {
  const dispatch = useDispatch();
  const {
    player1Name,
    player2Name,
    theme,
    accentColor,
    player1Avatar,
    player2Avatar,
    soundEnabled,
    moveSound,
    lowTimeSound,
    victorySound,
    achievements,
  } = useSelector((state: RootState) => state.player);

  const handleNameChange = (player: 1 | 2, name: string) => {
    dispatch(setPlayerName({ player, name }));
  };

  const handleAvatarPick = async (player: 1 | 2) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].uri) {
      dispatch(setAvatar({ player, avatar: result.assets[0].uri }));
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#000' }]}>Player Settings</Text>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>Player 1</Text>
        {player1Avatar && (
          <Image 
            source={{ uri: player1Avatar }} 
            style={styles.avatar}
          />
        )}
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
              color: theme === 'dark' ? '#fff' : '#000'
            }
          ]}
          value={player1Name}
          onChangeText={(text) => handleNameChange(1, text)}
          placeholder="Enter Player 1 name"
          placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
          maxLength={20}
        />
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={() => handleAvatarPick(1)}
        >
          <Text style={[styles.buttonText, { color: theme === 'dark' ? '#fff' : '#000' }]}>
            {player1Avatar ? 'Change Avatar' : 'Add Avatar'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>Player 2</Text>
        {player2Avatar && (
          <Image 
            source={{ uri: player2Avatar }} 
            style={styles.avatar}
          />
        )}
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
              color: theme === 'dark' ? '#fff' : '#000'
            }
          ]}
          value={player2Name}
          onChangeText={(text) => handleNameChange(2, text)}
          placeholder="Enter Player 2 name"
          placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
          maxLength={20}
        />
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={() => handleAvatarPick(2)}
        >
          <Text style={[styles.buttonText, { color: theme === 'dark' ? '#fff' : '#000' }]}>
            {player2Avatar ? 'Change Avatar' : 'Add Avatar'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>Appearance</Text>
        <View style={styles.themeContainer}>
          <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Theme</Text>
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: accentColor }]}
            onPress={() => dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))}
          >
            <Text style={styles.themeButtonText}>
              {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.colorContainer}>
          <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Accent Color</Text>
          <ColorPicker
            selectedColor={accentColor}
            onColorChange={(color) => dispatch(setAccentColor(color))}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>Sound Settings</Text>
        <View style={styles.soundOption}>
          <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Enable Sounds</Text>
          <Switch
            value={soundEnabled}
            onValueChange={(value) => {
              dispatch(setSoundEnabled(value));
            }}
            trackColor={{ false: '#767577', true: accentColor }}
            thumbColor={soundEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
        {soundEnabled && (
          <>
            <TouchableOpacity
              style={styles.soundButton}
              onPress={() => dispatch(setSound({ type: 'move', sound: moveSound === 'default' ? 'click' : 'default' }))}
            >
              <Text style={[styles.buttonText, { color: theme === 'dark' ? '#fff' : '#000' }]}>
                Move Sound: {moveSound}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.soundButton}
              onPress={() => dispatch(setSound({ type: 'lowTime', sound: lowTimeSound === 'default' ? 'beep' : 'default' }))}
            >
              <Text style={[styles.buttonText, { color: theme === 'dark' ? '#fff' : '#000' }]}>
                Low Time Sound: {lowTimeSound}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.soundButton}
              onPress={() => dispatch(setSound({ type: 'victory', sound: victorySound === 'default' ? 'fanfare' : 'default' }))}
            >
              <Text style={[styles.buttonText, { color: theme === 'dark' ? '#fff' : '#000' }]}>
                Victory Sound: {victorySound}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>Achievements</Text>
        <View style={styles.achievementsContainer}>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={[
              styles.achievementItem,
              { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5' }
            ]}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text style={[styles.achievementTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>
                  {achievement.title}
                </Text>
                <Text style={[styles.achievementDesc, { color: theme === 'dark' ? '#999' : '#666' }]}>
                  {achievement.description}
                </Text>
                <View style={styles.progressBar}>
                  <View style={[
                    styles.progressFill,
                    { 
                      backgroundColor: accentColor,
                      width: `${Math.min((achievement.progress / achievement.requiredProgress) * 100, 100)}%`
                    }
                  ]} />
                </View>
              </View>
              {achievement.unlockedAt && (
                <Text style={styles.achievementUnlocked}>🏆</Text>
              )}
            </View>
          ))}
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
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  themeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  avatarButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  soundOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  soundButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    alignSelf: 'center',
  },
  achievementsContainer: {
    marginTop: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  achievementUnlocked: {
    fontSize: 20,
    marginLeft: 8,
  },
});

export default PlayerSettings; 