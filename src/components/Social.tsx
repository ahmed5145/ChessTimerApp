import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Share, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { toggleSocialSetting, Achievement } from '../store/playerSlice';

const Social = () => {
  const dispatch = useDispatch();
  const { socialFeatures, achievements, stats, player1Name } = useSelector((state: RootState) => state.player);

  const handleShare = async () => {
    try {
      const message = `Check out my chess stats!\n\nWin Rate: ${stats.winRate}%\nGames Played: ${stats.gamesPlayed}\nAverage Time per Move: ${stats.avgTimePerMove}s\nHighest Win Streak: ${stats.highestWinStreak}`;
      await Share.share({ message });
    } catch (error) {
      console.error('Error sharing stats:', error);
    }
  };

  const handleToggleSetting = (setting: keyof typeof socialFeatures) => (value: boolean) => {
    dispatch(toggleSocialSetting({ setting, value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Social Settings</Text>
        <View style={styles.setting}>
          <Text style={styles.settingText}>Share Stats</Text>
          <Switch
            value={socialFeatures.shareStats}
            onValueChange={handleToggleSetting('shareStats')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={socialFeatures.shareStats ? '#007AFF' : '#f4f3f4'}
          />
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingText}>Public Profile</Text>
          <Switch
            value={socialFeatures.publicProfile}
            onValueChange={handleToggleSetting('publicProfile')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={socialFeatures.publicProfile ? '#007AFF' : '#f4f3f4'}
          />
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingText}>Show Rating</Text>
          <Switch
            value={socialFeatures.showRating}
            onValueChange={handleToggleSetting('showRating')}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={socialFeatures.showRating ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Achievements</Text>
        {achievements.map((achievement: Achievement) => (
          <View key={achievement.id} style={styles.achievement}>
            <Image source={achievement.icon} style={styles.achievementIcon} />
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingText: {
    fontSize: 16,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  achievementIcon: {
    width: 40,
    height: 40,
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
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default Social; 