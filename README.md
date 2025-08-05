# App Development Laboratory (CCS332)

## Course Information
- **Course Code**: CCS332
- **Course Title**: APP DEVELOPMENT
- **Credits**: L-T-P-C: 2-0-2-3
- **Department**: AI & Data Science
- **Year**: 3rd Year

## Course Objectives
- To learn development of native applications with basic GUI Components
- To develop cross-platform applications with event handling
- To develop applications with location and data storage capabilities
- To develop web applications with database access

## Course Outcomes
- **CO1**: Develop Native applications with GUI Components
- **CO2**: Develop hybrid applications with basic event handling
- **CO3**: Implement cross-platform applications with location and data storage capabilities
- **CO4**: Implement cross platform applications with basic GUI and event handling
- **CO5**: Develop web applications with cloud database access

## Syllabus Overview

### Unit I: Fundamentals of Mobile & Web Application Development (6 hrs)
- Basics of Web and Mobile application development
- Native App, Hybrid App, Cross-platform App
- Progressive Web App, Responsive Web design

### Unit II: Native App Development using Java (6 hrs)
- Native Web App benefits and scenarios
- Tools for creating Native App
- Java & Kotlin for Android, Swift & Objective-C for iOS
- Basics of React Native, Native Components, JSX, State, Props

### Unit III: Hybrid App Development (6 hrs)
- Hybrid Web App benefits and criteria
- Tools: Ionic, Apache Cordova
- Popular Hybrid App Development Frameworks

### Unit IV: Cross-Platform App Development using React-Native (6 hrs)
- Cross-platform App benefits and criteria
- Frameworks: Flutter, Xamarin, React-Native
- React Native components and concepts

### Unit V: Non-Functional Characteristics of App Frameworks (6 hrs)
- Comparison of different App frameworks
- Build Performance, App Performance, Debugging capabilities
- Time to Market, Maintainability, Ease of Development, UI/UX, Reusability

## Practical Exercises (30 Hours)

| Exercise | Title | Technology | Folder | Status |
|----------|-------|------------|--------|--------|
| 1 | [BMI Calculator](exercise-1-bmi-calculator) | React Native (Expo) | `exercise-1-bmi-calculator/` | ✅ Complete |
| 2 | [Expense Manager](#exercise-2-expense-manager) | React Native (Expo) | `exercise-2-expense-manager/` | 🚧 Pending |
| 3 | [Unit Converter](#exercise-3-unit-converter) | React Native (Expo) | `exercise-3-unit-converter/` | 🚧 Pending |
| 4 | [Todo Task Manager](#exercise-4-todo-manager) | React Native (Expo) | `exercise-4-todo-manager/` | 🚧 Pending |
| 5 | [User Login Screen](#exercise-5-login-cordova) | Apache Cordova | `exercise-5-login-cordova/` | 🚧 Pending |
| 6 | [Location Finder](#exercise-6-location-cordova) | Apache Cordova | `exercise-6-location-cordova/` | 🚧 Pending |
| 7 | [Library Management System](#exercise-7-library-android) | Android (Java) | `exercise-7-library-android/` | 🚧 Pending |

---

## Exercise Details

### Exercise 1: BMI Calculator
**Objective**: Build a cross-platform application for BMI calculation using React Native

**Features**:
- Input fields for height (cm) and weight (kg)
- Calculate BMI with proper validation
- Display BMI value and category (Underweight, Normal, Overweight, Obese)
- Responsive design with error handling

**Technology Stack**:
- React Native with Expo
- React Native Paper (UI Components)
- TypeScript

**Files to Replace**:
- `app/(tabs)/index.tsx` - Main BMI calculator component

**Setup Instructions**:
1. Navigate to `exercise-1-bmi-calculator/` folder
2. Follow the setup instructions in the exercise README
3. Replace the specified files with provided implementations

---

### Exercise 2: Expense Manager
**Objective**: Build a cross-platform application for expense management

**Features**:
- Enter daily expenses and income
- Category-wise expense tracking
- Weekly income and expense reports
- Data visualization

**Technology Stack**:
- React Native with Expo
- AsyncStorage for local data persistence
- Charts library for visualization

---

### Exercise 3: Unit Converter
**Objective**: Develop a cross-platform application to convert units between imperial and metric systems

**Features**:
- Convert km to miles, kg to pounds, etc.
- Multiple unit categories
- Real-time conversion
- History of conversions

**Technology Stack**:
- React Native with Expo
- Custom conversion algorithms

---

### Exercise 4: Todo Task Manager
**Objective**: Design and develop a cross-platform application for daily task management

**Features**:
- Add, edit, delete tasks
- Mark tasks as complete
- Priority levels
- Due date reminders
- Categories and filtering

**Technology Stack**:
- React Native with Expo
- SQLite for local database
- Push notifications

---

### Exercise 5: User Login Screen (Cordova)
**Objective**: Design an Android application using Cordova for user authentication

**Features**:
- Username and password fields
- Reset and submit buttons
- Header image and labels
- Layout managers implementation

**Technology Stack**:
- Apache Cordova
- HTML, CSS, JavaScript
- Android platform

---

### Exercise 6: Location Finder (Cordova)
**Objective**: Develop an Android application using Apache Cordova to find and display user's current location

**Features**:
- GPS location detection
- Display coordinates
- Map integration
- Location permissions handling

**Technology Stack**:
- Apache Cordova
- Geolocation plugin
- Google Maps integration

---

### Exercise 7: Library Management System (Android)
**Objective**: Create Android application with database operations for library management

**Features**:
- Display available books
- Track lent books
- Book reservation system
- Student information management
- Database server integration

**Technology Stack**:
- Android (Java/Kotlin)
- SQLite/Room database
- REST API integration

---

## Project Structure
```
├── README.md (This file)
├── exercise-1-bmi-calculator/
│   ├── README.md
│   ├── app/
│   │   └── (tabs)/
│   │       └── index.tsx
│   └── assets/
├── exercise-2-expense-manager/
│   ├── README.md
│   └── src/
├── exercise-3-unit-converter/
│   ├── README.md
│   └── src/
├── exercise-4-todo-manager/
│   ├── README.md
│   └── src/
├── exercise-5-login-cordova/
│   ├── README.md
│   └── www/
├── exercise-6-location-cordova/
│   ├── README.md
│   └── www/
└── exercise-7-library-android/
    ├── README.md
    └── app/
```

## Prerequisites

### For React Native Exercises (1-4):
- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### For Cordova Exercises (5-6):
- Node.js
- Apache Cordova CLI
- Android SDK
- Java Development Kit (JDK)

### For Android Exercise (7):
- Android Studio
- Java Development Kit (JDK)
- Android SDK

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd app-development-lab
   ```

2. **Choose an exercise**:
   Navigate to the specific exercise folder and follow the README instructions.

3. **Setup development environment**:
   Install required tools based on the exercise technology stack.

4. **Follow exercise-specific instructions**:
   Each exercise folder contains detailed setup and implementation guides.

## Assessment Criteria

- **Functionality**: Does the application work as expected?
- **Code Quality**: Clean, readable, and well-documented code
- **UI/UX Design**: User-friendly interface and experience
- **Error Handling**: Proper validation and error management
- **Documentation**: Clear README and code comments

## Submission Guidelines

1. Complete the assigned exercise
2. Test the application thoroughly
3. Document any issues or additional features
4. Submit the code with proper documentation
5. Include screenshots or demo videos if applicable

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Apache Cordova Documentation](https://cordova.apache.org/docs/en/latest/)
- [Android Developer Guide](https://developer.android.com/guide)

## Support

For technical support or clarifications:
- Create an issue in the repository
- Contact the lab instructor
- Refer to official documentation

---

**Note**: This repository is designed for educational purposes as part of the App Development Laboratory course. Each exercise builds upon previous concepts and introduces new technologies and frameworks.
