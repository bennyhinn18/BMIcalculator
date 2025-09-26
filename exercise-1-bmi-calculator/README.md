# Exercise 1: BMI Calculator

## 🚨 Important for Windows Users
If you encounter script execution errors in PowerShell, run this command first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then proceed with the setup instructions below.

## Objective
Build a cross-platform application for BMI (Body Mass Index) calculation using React Native with Expo.

## Description
This exercise demonstrates the fundamentals of React Native development including:
- State management with React hooks
- Form handling and validation
- Conditional rendering
- Styling with StyleSheet
- Using UI component libraries (React Native Paper)

## Features
- ✅ Input fields for height (cm) and weight (kg)
- ✅ Real-time BMI calculation
- ✅ BMI category classification (Underweight, Normal, Overweight, Obese)
- ✅ Input validation and error handling
- ✅ Responsive design
- ✅ Clean Material Design UI

## Technology Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **UI Library**: React Native Paper
- **Platform**: Cross-platform (iOS & Android)

## BMI Categories
| BMI Range | Category |
|-----------|----------|
| < 18.5 | Underweight |
| 18.5 - 24.9 | Normal weight |
| 25.0 - 29.9 | Overweight |
| ≥ 30.0 | Obese |

## Project Structure
```
exercise-1-bmi-calculator/
├── README.md (This file)
├── app/
│   └── (tabs)/
│       └── index.tsx (Main BMI Calculator component)
├── package.json (Dependencies and scripts)
├── app.json (Expo configuration)
├── tsconfig.json (TypeScript configuration)
└── assets/ (Images and icons)
```

## Setup Instructions

### Step 1: Verify Node.js Installation

First, check if Node.js is already installed on your system:

```bash
node --version
npm --version
```

If these commands show version numbers (Node.js v18 or later), you can skip to Step 2.

#### Install Node.js (if not installed):

**Option 1: Download from Official Website**
- Visit: [https://nodejs.org/](https://nodejs.org/)
- Download the LTS version (Long Term Support)
- Run the installer and follow the setup wizard

**Option 2: Install using Winget (Windows)**
```bash
winget install OpenJS.NodeJS
```

**Option 3: Install using Chocolatey (Windows)**
```bash
choco install nodejs
```

**Verify installation after installing:**
```bash
node --version
npm --version
```

### Step 2: Install Expo CLI

**⚠️ Important for Windows Users**: If you get a script execution error, see the [PowerShell script execution issue](#issue-powershell-script-execution-is-disabled-most-common) in troubleshooting section.

Install Expo CLI globally on your system:

```bash
npm install -g @expo/cli
```

**If you get PowerShell execution policy error:**
```powershell
# Run this first, then retry npm install
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Verify Expo installation:**
```bash
expo --version
```

### Step 3: Install Expo Go App (for mobile testing)

- **Android**: Download from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: Download from [App Store](https://apps.apple.com/app/expo-go/id982107779)

### Step 4: Create New Expo Project

**Option A: Start from scratch**
```bash
npx create-expo-app@latest BMICalculator --template tabs
cd BMICalculator
```

**Option B: Use this exercise folder**
```bash
# Navigate to exercise folder
cd exercise-1-bmi-calculator

# Install dependencies
npm install
```

### Step 5: Install Required Dependencies

```bash
npm install react-native-paper
```

**For yarn users:**
```bash
yarn add react-native-paper
```

### Step 6: Replace Default Code

- Navigate to `app/(tabs)/` folder
- Replace the content of `index.tsx` with the provided BMI calculator code
- Or copy the code from this exercise folder


## Running the Application

### Step 7: Start Development Server

Open terminal in your project directory and run:

```bash
npx expo start
```

**Expected output:**
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

### Step 8: Run on Your Device

**For Android:**
1. Open Expo Go app on your Android device
2. Tap "Scan QR code"
3. Scan the QR code from your terminal
4. App will load automatically

**For iOS:**
1. Open Camera app on your iPhone/iPad
2. Point camera at QR code from terminal
3. Tap the notification that appears
4. App will open in Expo Go

### Step 9: Alternative Running Methods

**Run in Android Emulator:**
```bash
npx expo start --android
```

**Run in iOS Simulator (macOS only):**
```bash
npx expo start --ios
```

**Run in Web Browser:**
```bash
npx expo start --web
```

**Clear cache if needed:**
```bash
npx expo start --clear
```

### Step 10: Verify App is Working

1. App should load with "BMI Calculator" title
2. Try entering height: `170` and weight: `65`
3. Tap "Calculate BMI" button
4. Should display: "Your BMI: 22.5" and "Status: Normal weight"

**If app loads successfully, Exercise 1 is complete! ✅**

## Code Explanation

### Key Components

#### State Management
```typescript
const [height, setHeight] = useState<string>('');
const [weight, setWeight] = useState<string>('');
const [bmi, setBmi] = useState<number | null>(null);
const [category, setCategory] = useState<string>('');
```

#### BMI Calculation Logic
```typescript
const calculateBMI = () => {
  const h = parseFloat(height) / 100; // Convert cm to meters
  const w = parseFloat(weight);
  
  // Validation
  if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
    setBmi(null);
    setCategory('Please enter valid height and weight');
    return;
  }
  
  // BMI Formula: weight(kg) / height(m)²
  const bmiValue = parseFloat((w / (h * h)).toFixed(1));
  setBmi(bmiValue);
  
  // Category classification
  if (bmiValue < 18.5) setCategory('Underweight');
  else if (bmiValue < 24.9) setCategory('Normal weight');
  else if (bmiValue < 29.9) setCategory('Overweight');
  else setCategory('Obese');
};
```

#### UI Components
- **TextInput**: For height and weight input with validation
- **Button**: To trigger BMI calculation
- **Card**: To display results in a styled container
- **Typography**: Title and Text components for content display

## Testing Guidelines

### Manual Testing Checklist
- [ ] App launches without crashes
- [ ] Input fields accept numeric values
- [ ] Validation works for invalid inputs (negative, zero, non-numeric)
- [ ] BMI calculation is accurate
- [ ] Category classification is correct
- [ ] UI is responsive on different screen sizes
- [ ] Error messages display properly

### Test Cases
| Input Height (cm) | Input Weight (kg) | Expected BMI | Expected Category |
|-------------------|-------------------|--------------|-------------------|
| 170 | 65 | 22.5 | Normal weight |
| 160 | 45 | 17.6 | Underweight |
| 175 | 85 | 27.8 | Overweight |
| 180 | 100 | 30.9 | Obese |
| 0 | 70 | - | Error message |
| 170 | 0 | - | Error message |

## Styling Features
- Material Design components
- Consistent color scheme
- Proper spacing and layout
- Keyboard-aware design
- Visual feedback for user interactions

## Learning Outcomes
After completing this exercise, students will understand:
1. React Native project structure with Expo
2. State management using React hooks
3. Form handling and input validation
4. Conditional rendering techniques
5. StyleSheet usage for responsive design
6. Integration of third-party UI libraries
7. TypeScript basics in React Native
8. Cross-platform mobile app development concepts

## Common Issues & Solutions

### Setup Issues

#### Issue: PowerShell script execution is disabled (MOST COMMON)
**Error Message**: 
```
npx : File C:\Users\...\npm\npx.ps1 cannot be loaded because running scripts is disabled on this system.
```

**Solution**: Enable PowerShell script execution
```powershell
# Option 1: Run as Administrator and enable for current user
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Option 2: Temporary bypass (single session)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Option 3: Check current policy
Get-ExecutionPolicy -List
```

**Alternative Solutions**:
```bash
# Use cmd instead of PowerShell
cmd

# Or use npx with --ignore-existing
npx --ignore-existing @expo/cli@latest
```

#### Issue: 'node' is not recognized as internal or external command
**Solution**: Node.js is not installed or not in PATH
```bash
# Check if Node.js is installed
node --version

# If not installed, use winget:
winget install OpenJS.NodeJS

# Or download from: https://nodejs.org/
```

#### Issue: 'npx' is not recognized
**Solution**: Update npm or reinstall Node.js
```bash
npm install -g npm@latest
```

#### Issue: Permission denied when installing Expo CLI
**Solution**: Run PowerShell as Administrator
```bash
# Run as Administrator
npm install -g @expo/cli
```

#### Issue: Expo CLI installation fails
**Solution**: Clear npm cache and retry
```bash
npm cache clean --force
npm install -g @expo/cli
```

### Runtime Issues

#### Issue: Module not found errors
**Solution**: Ensure all dependencies are installed:
```bash
npm install react-native-paper
npx expo install --fix
```

#### Issue: Metro bundler won't start
**Solution**: Clear cache and restart
```bash
npx expo start --clear
```

#### Issue: QR code not scanning
**Solutions**:
- Ensure phone and computer are on same WiFi network
- Try typing the URL manually in Expo Go app
- Use tunnel mode: `npx expo start --tunnel`

#### Issue: UI components not styled properly
**Solution**: Wrap the app with PaperProvider:
```typescript
<PaperProvider>
  {/* Your app components */}
</PaperProvider>
```

#### Issue: App crashes on device but works in browser
**Solutions**:
- Check device compatibility
- Update Expo Go app
- Try on different device/emulator

#### Issue: TypeScript errors
**Solution**: Ensure TypeScript is properly configured:
```bash
# Install TypeScript dependencies
npm install --save-dev typescript @types/react @types/react-native
```

## Extensions & Improvements
Students can enhance the app by adding:
- BMI history tracking
- Metric/Imperial unit conversion
- Health tips based on BMI category
- Progress tracking with charts
- User profiles
- Data persistence with AsyncStorage

## Assessment Criteria
- **Functionality (40%)**: Core features work correctly
- **Code Quality (25%)**: Clean, readable, and well-structured code
- **UI/UX (20%)**: Professional appearance and user experience
- **Error Handling (10%)**: Proper validation and error messages
- **Documentation (5%)**: Code comments and README updates

## Resources
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Next Steps
After completing this exercise, proceed to **Exercise 2: Expense Manager** to learn about:
- Data persistence
- Navigation between screens
- Charts and data visualization
- More complex state management
