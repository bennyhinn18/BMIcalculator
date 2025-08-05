# BMI Calculator - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites Check
```bash
# Check if Node.js is installed
node --version
npm --version
```

If not installed, run:
```bash
winget install OpenJS.NodeJS
```

### 1. Install Expo CLI
```bash
npm install -g @expo/cli
```

**⚠️ PowerShell Error?** Run this first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Create Project
```bash
npx create-expo-app@latest BMICalculator --template tabs
cd BMICalculator
```

### 3. Install Dependencies
```bash
npm install react-native-paper
```

### 4. Replace Code
- Go to `app/(tabs)/index.tsx`
- Copy the BMI calculator code from this exercise folder

### 5. Run App
```bash
npx expo start
```

### 6. Test on Phone
- Install Expo Go app
- Scan QR code from terminal

## ✅ Verification
Test with: Height=170cm, Weight=65kg
Expected: BMI=22.5, Status="Normal weight"

## 📱 Download Expo Go
- **Android**: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

## 🆘 Need Help?
- Check the main README.md for detailed instructions
- Common issues section has solutions
- Ask instructor for assistance
