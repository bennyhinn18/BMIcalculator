# Expense Manager - Quick Start Guide

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
npx create-expo-app@latest ExpenseManager --template tabs
cd ExpenseManager
```

### 3. Install Dependencies
```bash
npm install react-native-paper @react-native-async-storage/async-storage date-fns react-native-chart-kit react-native-svg @react-native-community/datetimepicker
```

### 4. Replace Files
Copy all files from this exercise folder to your project, maintaining the folder structure.

### 5. Run App
```bash
npx expo start
```

### 6. Test on Phone
- Install Expo Go app
- Scan QR code from terminal

## ✅ App Features
- Dashboard with transaction summary
- Add income and expenses
- Weekly reports with charts
- Settings for data management

## 📱 Download Expo Go
- **Android**: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

## 🆘 Need Help?
- Check the main README.md for detailed instructions
- Common issues section has solutions
- Ask instructor for assistance
