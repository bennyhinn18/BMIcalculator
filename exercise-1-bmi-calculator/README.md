# Exercise 1: BMI Calculator

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

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. **Create a new Expo project** (if starting from scratch):
   ```bash
   npx create-expo-app@latest BMICalculator --template tabs
   cd BMICalculator
   ```

2. **Install required dependencies**:
   ```bash
   npm install react-native-paper
   # or
   yarn add react-native-paper
   ```

3. **Replace the default index.tsx**:
   - Navigate to `app/(tabs)/`
   - Replace the content of `index.tsx` with the provided BMI calculator code

4. **Update app.json** (if needed):
   ```json
   {
     "expo": {
       "name": "BMI Calculator",
       "slug": "bmi-calculator",
       "version": "1.0.0",
       "orientation": "portrait",
       "platforms": ["ios", "android", "web"]
     }
   }
   ```

### Running the Application

1. **Start the development server**:
   ```bash
   npx expo start
   ```

2. **Test on device**:
   - Scan the QR code with Expo Go app (Android) or Camera app (iOS)
   - Or use an emulator/simulator

3. **Test on web** (optional):
   ```bash
   npx expo start --web
   ```

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

### Issue: Module not found errors
**Solution**: Ensure all dependencies are installed:
```bash
npm install react-native-paper
npx expo install --fix
```

### Issue: UI components not styled properly
**Solution**: Wrap the app with PaperProvider:
```typescript
<PaperProvider>
  {/* Your app components */}
</PaperProvider>
```

### Issue: Keyboard covering input fields
**Solution**: Use KeyboardAvoidingView (already implemented)

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
