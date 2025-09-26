# Exercise 2: Expense Manager

## Objective
Build a cross-platform application for expense management that allows entering expenses and income on each day and displays category-wise weekly income and expense reports.

## Description
This exercise builds on React Native fundamentals and introduces more advanced concepts including:
- Data persistence with AsyncStorage
- Multiple-screen navigation
- Data visualization with charts
- Form handling with validation
- Complex state management

## Features
- ✅ Daily expense and income entry
- ✅ Category-wise expense tracking
- ✅ Weekly income and expense reports
- ✅ Data visualization with charts
- ✅ Local data persistence with AsyncStorage
- ✅ Multiple screen navigation

## Technology Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **UI Library**: React Native Paper
- **Navigation**: Expo Router
- **Storage**: AsyncStorage
- **Charts**: React Native Chart Kit
- **Date Handling**: date-fns

## 🚨 Important for Windows Users
If you encounter script execution errors in PowerShell, run this command first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then proceed with the setup instructions below.

## Project Structure
```
expense-manager/
├── README.md (This file)
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx (Tab navigation)
│   │   ├── index.tsx (Dashboard)
│   │   ├── add-transaction.tsx (Add transaction form)
│   │   ├── reports.tsx (Weekly reports with charts)
│   │   └── settings.tsx (App settings)
│   ├── components/
│   │   ├── TransactionCard.tsx (Transaction display component)
│   │   └── SummaryCard.tsx (Summary display component)
│   └── utils/
│       ├── storage.ts (AsyncStorage functions)
│       └── types.ts (TypeScript interfaces)
├── assets/ (Images and icons)
├── package.json (Dependencies and scripts)
├── app.json (Expo configuration)
└── tsconfig.json (TypeScript configuration)
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

**⚠️ Important for Windows Users**: If you get a script execution error, see the PowerShell script execution issue warning at the top of this README.

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
npx create-expo-app@latest ExpenseManager --template tabs
cd ExpenseManager
```

**Option B: Use this exercise folder**
```bash
# Navigate to exercise folder
cd exercise-2-expense-manager

# Install dependencies
npm install
```

### Step 5: Install Required Dependencies

```bash
npm install react-native-paper @react-native-async-storage/async-storage date-fns react-native-chart-kit react-native-svg @react-native-community/datetimepicker
```

**For yarn users:**
```bash
yarn add react-native-paper @react-native-async-storage/async-storage date-fns react-native-chart-kit react-native-svg @react-native-community/datetimepicker
```

### Step 6: Replace/Add Files

Copy all files from this exercise directory into your project, maintaining the same folder structure.

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

### Step 9: Test the App Features

1. **Dashboard**: View your weekly summary and recent transactions
2. **Add Transaction**: Add income or expense entries with categories
3. **Reports**: View weekly charts and category breakdowns
4. **Settings**: Manage app data and settings

## Key Features Implementation

### 1. Data Persistence with AsyncStorage
```typescript
// Save transactions
export const saveTransactions = async (transactions: Transaction[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions', error);
    throw error;
  }
};

// Get transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const data = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting transactions', error);
    return [];
  }
};
```

### 2. Navigation with Expo Router
```typescript
<Tabs
  screenOptions={{
    tabBarActiveTintColor: theme.colors.primary,
    headerShown: true,
  }}>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Dashboard',
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="home" size={size} color={color} />
      ),
    }}
  />
  {/* More tabs... */}
</Tabs>
```

### 3. Charts and Data Visualization
```typescript
<LineChart
  data={chartData}
  width={screenWidth - 40}
  height={220}
  chartConfig={chartConfig}
  bezier
  style={styles.chart}
/>

<PieChart
  data={pieChartData}
  width={screenWidth - 40}
  height={200}
  chartConfig={chartConfig}
  accessor="amount"
  backgroundColor="transparent"
  paddingLeft="10"
  absolute
/>
```

### 4. Form Validation
```typescript
const validateForm = (): boolean => {
  const newErrors = {
    amount: '',
    description: '',
    category: ''
  };
  
  let isValid = true;
  
  // Validate amount
  if (!amount) {
    newErrors.amount = 'Amount is required';
    isValid = false;
  } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
    newErrors.amount = 'Amount must be a positive number';
    isValid = false;
  }
  
  // More validation...
  
  setErrors(newErrors);
  return isValid;
};
```

## Common Issues & Solutions

### Setup Issues

#### Issue: PowerShell script execution is disabled
**Error Message**: 
```
npx : File C:\Users\...\npm\npx.ps1 cannot be loaded because running scripts is disabled on this system.
```

**Solution**: Enable PowerShell script execution
```powershell
# Run as Administrator and enable for current user
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Issue: Missing dependencies
**Solution**: Ensure all dependencies are installed:
```bash
npm install react-native-paper @react-native-async-storage/async-storage date-fns react-native-chart-kit react-native-svg @react-native-community/datetimepicker
```

### Runtime Issues

#### Issue: AsyncStorage not working
**Solution**: Ensure you're handling promises properly
```typescript
// Incorrect:
const data = AsyncStorage.getItem('key');

// Correct:
const data = await AsyncStorage.getItem('key');
```

#### Issue: Charts not rendering
**Solution**: Check your data format and ensure you have react-native-svg installed

```bash
npm install react-native-svg
```

## Learning Outcomes
After completing this exercise, students will understand:
1. Managing complex app state across multiple screens
2. Persisting data locally with AsyncStorage
3. Visualizing data with charts and graphs
4. Form validation techniques in React Native
5. Working with dates and calculations
6. Tab-based navigation with Expo Router
7. CRUD operations in a mobile app context

## Assessment Criteria
- **Functionality (40%)**: All features work correctly (transactions, reports, persistence)
- **Data Management (25%)**: Proper data handling, storage, and retrieval
- **UI/UX (15%)**: Professional appearance and ease of use
- **Code Structure (10%)**: Organization, readability, and modularity
- **Error Handling (10%)**: Validation, user feedback, and edge cases

## Resources
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- [Date-fns](https://date-fns.org/docs/Getting-Started)

## Next Steps
After completing this exercise, proceed to **Exercise 3: Unit Converter** to learn about:
- Dynamic unit conversions
- Mathematical calculations
- Bidirectional data flow
- User preferences storage
