# ⏱️ Chess Timer Mobile App

[![React Native](https://img.shields.io/badge/React_Native-0.72-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_49-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0.1-purple.svg)](https://redux-toolkit.js.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A professional-grade chess timer mobile application built with React Native and Expo. Features an intuitive interface optimized for mobile devices, precise timing, and customizable settings for serious chess players.

## ✨ Features

### 🎮 Game Controls
- Tap controls for switching active player
- Portrait and landscape orientation support
- Haptic feedback for actions
- Pause and reset functionality

### ⚡ Professional Grade Timing
- Precise timing with 0.1-second accuracy
- Multiple preset time controls
- Custom time control configuration
- Time increment support

### 🎨 Customization
- Configurable player names
- Low time warning thresholds
- Sound effects toggle
- Vibration feedback settings

### 🔔 Notifications
- Low time warnings with visual and haptic feedback
- Game end notifications
- Move confirmation feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development)
- Android Studio & Android SDK (for Android development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ahmed5145/ChessTimerApp.git
cd ChessTimerApp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your device:
- Scan the QR code with Expo Go app (Android/iOS)
- Press 'i' for iOS simulator
- Press 'a' for Android emulator

## 🛠️ Built With

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Native Reanimated** - Animations
- **Expo AV** - Sound effects
- **Expo Haptics** - Haptic feedback

## 📱 Mobile Features

- **Orientation Support**
  - Automatic layout adjustment
  - Optimized for both portrait and landscape

- **Touch Controls**
  - Large tap areas for easy interaction
  - Gesture support for common actions
  - Haptic feedback for confirmations

- **Display**
  - High contrast for outdoor visibility
  - Dynamic text sizing
  - Battery-efficient dark theme

## 🎯 Usage

1. **Setting Up a Game**
   - Select time control from presets
   - Enter player names (optional)
   - Configure sound and vibration settings

2. **During the Game**
   - Tap player's timer area to switch active player
   - Active player's time counts down
   - Increment automatically added after moves
   - Visual and haptic warnings for low time

3. **Game Controls**
   - Start: Begin new game
   - Pause: Temporarily halt game
   - Reset: Start over with same settings
   - Settings: Adjust game parameters

## ⚙️ Configuration

- **Time Controls**: Multiple presets and custom options
- **Increment**: 0-60 seconds per move
- **Warnings**: Customizable time thresholds
- **Sound**: Toggle on/off
- **Vibration**: Intensity settings
- **Player Names**: Customizable

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by professional chess clocks
- Sound effects from [OpenGameArt.org](https://opengameart.org/)
- Icons from [Material Design Icons](https://materialdesignicons.com/) 