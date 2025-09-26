# BMI Calculator Setup Guide

This guide provides detailed instructions for setting up the BMI Calculator React Native application.

## Development Environment Setup

### Prerequisites

1. Install Node.js and npm:
   - Download and install from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. Install Expo CLI globally:
   ```bash
   npm install -g @expo/cli
   ```

### Project Setup

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd exercise-1-bmi-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

## Troubleshooting Common Issues

### PowerShell Execution Policy Error

If you encounter a PowerShell execution policy error when running npm commands, try the following:

#### Option 1: Change Execution Policy for Current User
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Option 2: Use Command Prompt Instead
Open Command Prompt and navigate to your project directory to run npm commands.

### Module Resolution Issues

If you encounter module resolution issues:

1. Verify that all dependencies are installed:
   ```bash
   npm install
   ```

2. Clear the cache and restart:
   ```bash
   npx expo start --clear
   ```

### Metro Bundler Issues

If Metro Bundler fails to start or hangs:

1. Clear the cache:
   ```bash
   npx expo start --clear
   ```

2. Reset the cache completely:
   ```bash
   npx expo start -c
   ```

## Running on Different Platforms

### Android
- Connect an Android device or start an emulator
- Press 'a' in the Expo terminal or scan the QR code with Expo Go app

### iOS
- Connect an iOS device or start a simulator
- Press 'i' in the Expo terminal or scan the QR code with Expo Go app

### Web
- Press 'w' in the Expo terminal to open in a web browser

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)
