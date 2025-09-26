# Exercise 3: Unit Converter

## Objective
Develop a cross-platform application to convert units from imperial system to metric system (km to miles, kg to pounds, etc.)

## Features (Implemented)
- [x] Multiple unit conversion categories
- [x] Real-time conversion as user types
- [x] Conversion history with timestamps
- [x] Bi-directional conversion with swap functionality
- [x] Popular conversions quick access
- [x] Precision control and number formatting
- [x] Category-based history filtering
- [x] Clean and intuitive Material Design UI

## Conversion Categories
- **Length**: km ↔ miles, meters ↔ feet, cm ↔ inches
- **Weight**: kg ↔ pounds, grams ↔ ounces
- **Temperature**: Celsius ↔ Fahrenheit ↔ Kelvin
- **Volume**: liters ↔ gallons, ml ↔ fluid ounces
- **Area**: sq meters ↔ sq feet, hectares ↔ acres

## Technology Stack
- **Flutter** - Cross-platform UI framework
- **SharedPreferences** - Local data persistence for conversion history
- **Material Design** - Modern and consistent UI components
- **Custom conversion algorithms** - Precise mathematical calculations
- **State management** - Efficient UI updates and data flow

## Setup Instructions

### Prerequisites
- Flutter SDK (>= 3.10.0)
- Dart SDK (>= 3.0.0)
- Android Studio or VS Code with Flutter extension
- Android/iOS device or emulator

### Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd exercise-3-unit-converter
   ```

2. **Install dependencies:**
   ```bash
   flutter pub get
   ```

3. **Run the application:**
   ```bash
   # For Android
   flutter run

   # For iOS (macOS only)
   flutter run -d ios

   # For web
   flutter run -d web
   ```

### Project Structure
```
lib/
├── main.dart                    # App entry point
├── models/
│   └── conversion_models.dart   # Data models and enums
├── screens/
│   ├── home_screen.dart        # Main category selection screen
│   ├── conversion_screen.dart  # Unit conversion interface
│   └── history_screen.dart     # Conversion history viewer
├── utils/
│   ├── conversion_engine.dart  # Conversion algorithms
│   └── storage_service.dart    # History persistence
└── widgets/
    └── category_card.dart      # Reusable category card component
```

## Usage Guide

### Converting Units
1. Launch the app and select a conversion category
2. Choose your input and output units from the dropdowns
3. Enter a value in the input field
4. See the conversion result in real-time
5. Use the swap button to reverse the conversion direction
6. Try quick conversion buttons for common values

### Viewing History
1. Tap the history icon in the app bar
2. Filter by category or view all conversions
3. See timestamps and conversion details
4. Clear history when needed

## Learning Outcomes
- **Flutter Development**: Building cross-platform mobile applications
- **Mathematical Calculations**: Implementing precise unit conversion algorithms
- **State Management**: Managing app state and UI updates
- **Data Persistence**: Storing and retrieving conversion history
- **Material Design**: Creating beautiful and functional user interfaces
- **User Experience**: Real-time feedback and intuitive navigation
- **Algorithm Implementation**: Custom conversion engine with bi-directional support

## Future Enhancements
- [ ] More unit categories (energy, power, speed, etc.)
- [ ] Custom unit definitions
- [ ] Export conversion history
- [ ] Dark theme support
- [ ] Voice input for values
- [ ] Calculator-style input interface
