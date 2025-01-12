import * as Haptics from 'expo-haptics';

type HapticPattern = () => Promise<void>;

interface HapticPatterns {
  start: HapticPattern;
  switch: HapticPattern;
  lowTime: HapticPattern;
  timeUp: HapticPattern;
  reset: HapticPattern;
}

export const hapticPatterns: HapticPatterns = {
  start: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise(resolve => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  switch: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  lowTime: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
  timeUp: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    await new Promise(resolve => setTimeout(resolve, 200));
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
  reset: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise(resolve => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}; 