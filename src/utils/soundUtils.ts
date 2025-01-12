import { Audio } from 'expo-av';

class SoundManager {
  private sounds: { [key: string]: Audio.Sound } = {};
  private volume: number = 0.7;
  private isMuted: boolean = false;
  private lastWarningTime: number = 0;
  private warningInterval: number = 1000;
  private isInitialized: boolean = false;

  async loadSound(name: string): Promise<void> {
    try {
      const soundObject = new Audio.Sound();
      let soundModule;
      
      // Use simpler sounds as fallbacks
      switch (name) {
        case 'click':
          soundModule = require('../../assets/click.mp3');
          break;
        case 'warning':
          try {
            soundModule = require('../../assets/warning.mp3');
          } catch {
            // Fallback to click sound if warning sound fails
            soundModule = require('../../assets/click.mp3');
          }
          break;
        case 'timeup':
          try {
            soundModule = require('../../assets/timeup.mp3');
          } catch {
            // Fallback to double click if timeup sound fails
            soundModule = require('../../assets/click.mp3');
          }
          break;
      }

      await soundObject.loadAsync(soundModule);
      await soundObject.setVolumeAsync(this.volume);
      this.sounds[name] = soundObject;
      console.log(`Successfully loaded ${name} sound`);
    } catch (error) {
      console.log(`Error loading ${name} sound:`, error);
    }
  }

  async initializeSounds() {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Load sounds sequentially
      await this.loadSound('click');
      await this.loadSound('warning');
      await this.loadSound('timeup');

      this.isInitialized = true;
    } catch (error) {
      console.log('Error initializing sounds:', error);
    }
  }

  async playTimeUp() {
    if (this.isMuted) return;
    
    try {
      const sound = this.sounds['click'];
      if (!sound) return;

      // Play double click for timeup if timeup sound isn't available
      await sound.setVolumeAsync(this.volume);
      await sound.playAsync();
      await new Promise(resolve => setTimeout(resolve, 200));
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.log('Error playing timeup sound:', error);
    }
  }

  async play(soundName: 'click' | 'warning' | 'timeup', force: boolean = false) {
    if (this.isMuted) return;
    
    try {
      if (soundName === 'timeup') {
        await this.playTimeUp();
        return;
      }

      const sound = this.sounds[soundName];
      if (!sound) {
        await this.loadSound(soundName);
        return;
      }

      if (soundName === 'warning' && !force) {
        const now = Date.now();
        if (now - this.lastWarningTime < this.warningInterval) {
          return;
        }
        this.lastWarningTime = now;
      }

      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.stopAsync();
        }
        await sound.setPositionAsync(0);
        await sound.playAsync();
      }
    } catch (error) {
      console.log(`Error playing ${soundName} sound:`, error);
    }
  }

  cleanup() {
    Object.values(this.sounds).forEach(sound => {
      try {
        sound.unloadAsync();
      } catch (error) {
        console.log('Error cleaning up sound:', error);
      }
    });
    this.isInitialized = false;
  }

  setVolume(volume: number) {
    this.volume = volume;
    Object.values(this.sounds).forEach(sound => {
      try {
        sound.setVolumeAsync(volume);
      } catch (error) {
        console.log('Error setting volume:', error);
      }
    });
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    const volume = muted ? 0 : this.volume;
    Object.values(this.sounds).forEach(sound => {
      try {
        sound.setVolumeAsync(volume);
      } catch (error) {
        console.log('Error setting mute state:', error);
      }
    });
  }

  setWarningInterval(interval: number) {
    this.warningInterval = interval;
  }
}

export const soundManager = new SoundManager(); 