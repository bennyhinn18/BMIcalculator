# Development Environment Setup Guide

## 🚨 IMPORTANT: Windows PowerShell Setup

**Before starting any installation, Windows users must enable script execution:**

```powershell
# Run PowerShell as Administrator and execute:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Verify the change:
Get-ExecutionPolicy -List
```

**Common Error Without This Setup:**
```
npx : File C:\Users\...\npm\npx.ps1 cannot be loaded because running scripts is disabled on this system.
```

## Prerequisites for All Exercises

### Common Requirements
- **Operating System**: Windows 10/11, macOS, or Linux
- **Node.js**: Version 16.0 or later
- **Git**: For version control
- **Code Editor**: Visual Studio Code (recommended)

## React Native + Expo Setup (Exercises 1-4)

### 1. Install Node.js
Download and install from [nodejs.org](https://nodejs.org/)

### 2. Install Expo CLI
```bash
npm install -g @expo/cli
```

### 3. Install Expo Go App
- **Android**: Download from Google Play Store
- **iOS**: Download from App Store

### 4. Verify Installation
```bash
expo --version
node --version
npm --version
```

### 5. Optional: Android Studio (for Android development)
- Download from [developer.android.com](https://developer.android.com/studio)
- Install Android SDK and emulator

### 6. Optional: Xcode (for iOS development - macOS only)
- Install from Mac App Store
- Install iOS Simulator

## Apache Cordova Setup (Exercises 5-6)

### 1. Install Cordova CLI
```bash
npm install -g cordova
```

### 2. Install Java Development Kit (JDK)
- Download JDK 8 or 11 from Oracle or OpenJDK
- Set JAVA_HOME environment variable

### 3. Install Android SDK
- Install Android Studio or standalone SDK tools
- Set ANDROID_HOME environment variable
- Add SDK tools to PATH

### 4. Verify Installation
```bash
cordova --version
java -version
```

## Android Development Setup (Exercise 7)

### 1. Install Android Studio
- Download from [developer.android.com](https://developer.android.com/studio)
- Complete setup wizard

### 2. Install Android SDK
- Install latest Android SDK
- Install build tools and platform tools

### 3. Create Android Virtual Device (AVD)
- Open AVD Manager in Android Studio
- Create a virtual device for testing

## Environment Variables Setup

### Windows (PowerShell)
```powershell
# Add to PowerShell profile
$env:ANDROID_HOME = "C:\Users\YourUsername\AppData\Local\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Java\jdk-11.0.x"
$env:PATH += ";$env:ANDROID_HOME\tools;$env:ANDROID_HOME\platform-tools"
```

### macOS/Linux (Bash/Zsh)
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.0.x.jdk/Contents/Home
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

## Testing Your Setup

### React Native + Expo
```bash
npx create-expo-app@latest TestApp --template blank
cd TestApp
npx expo start
```

### Cordova
```bash
cordova create TestCordova
cd TestCordova
cordova platform add android
cordova build android
```

### Android
- Open Android Studio
- Create new project
- Run on emulator or device

## Troubleshooting

### Common Issues

#### Expo/React Native
- **Metro bundler issues**: Clear cache with `npx expo start --clear`
- **Module not found**: Run `npm install` or `yarn install`
- **Port conflicts**: Use `npx expo start --port 19001`

#### Cordova
- **Build failures**: Check JAVA_HOME and ANDROID_HOME paths
- **Plugin issues**: Remove and re-add platforms
- **Permission errors**: Run as administrator/sudo

#### Android Studio
- **SDK not found**: Verify ANDROID_HOME path
- **Gradle issues**: Update Gradle wrapper
- **Emulator slow**: Allocate more RAM to AVD

### Getting Help
- Check official documentation
- Search Stack Overflow
- Ask in course discussion forums
- Contact lab instructor

## Recommended VS Code Extensions
- React Native Tools
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

## Additional Tools
- **Debugging**: React Native Debugger, Flipper
- **Testing**: Jest, Detox
- **State Management**: Redux, Context API
- **Navigation**: React Navigation
- **UI Libraries**: React Native Paper, NativeBase
