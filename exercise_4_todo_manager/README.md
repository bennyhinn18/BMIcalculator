# Exercise 4: Todo Task Manager

## Objective
Design and develop a cross-platform application for day-to-day task (to-do) management with advanced features and beautiful Material Design UI.

## Features (Implemented)
- [x] Add, edit, delete tasks with rich form inputs
- [x] Mark tasks as complete/incomplete with swipe actions
- [x] Priority levels (High, Medium, Low) with visual indicators
- [x] Due date and time selection with date/time pickers
- [x] Task categories with default presets and custom options
- [x] Task tags for better organization
- [x] Advanced search and filter functionality
- [x] Comprehensive task statistics and progress tracking
- [x] Quick actions for today's tasks, overdue, and high priority
- [x] Beautiful animations and smooth user experience
- [x] Detailed task view with bottom sheet modal
- [x] Productivity insights and recommendations

## Technology Stack
- **Flutter** - Cross-platform UI framework
- **SQLite (sqflite)** - Local database for persistent storage
- **Provider** - State management solution
- **Material Design 3** - Modern UI components and theming
- **Staggered Animations** - Smooth list animations
- **Slidable** - Swipe actions for task cards
- **Date/Time Pickers** - Native date and time selection
- **UUID** - Unique identifier generation

## Database Schema
```sql
Categories Table:
- id (Primary Key)
- name
- emoji
- color

Tasks Table:
- id (Primary Key)
- title
- description
- priority (1=Low, 2=Medium, 3=High)
- due_date (timestamp)
- category_id (Foreign Key)
- completed (0/1)
- created_at (timestamp)
- updated_at (timestamp)
- tags (comma-separated)
```

## Setup Instructions

### Prerequisites
- Flutter SDK (>= 3.9.2)
- Dart SDK (>= 3.0.0)
- Android Studio or VS Code with Flutter extension
- Android/iOS device or emulator

### Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd exercise_4_todo_manager
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
├── main.dart                           # App entry point with provider setup
├── models/
│   └── task.dart                      # Task, Priority, Category models
├── providers/
│   └── task_provider.dart             # State management and business logic
├── services/
│   └── database_service.dart          # SQLite database operations
├── screens/
│   ├── home_screen.dart              # Main dashboard with tabs
│   ├── add_edit_task_screen.dart     # Task creation/editing form
│   ├── search_screen.dart            # Advanced search and filtering
│   └── statistics_screen.dart        # Analytics and insights
└── widgets/
    ├── task_card.dart                # Task display with swipe actions
    ├── statistics_card.dart          # Overview statistics widget
    └── quick_actions.dart            # Quick access buttons
```

## Usage Guide

### Managing Tasks
1. **Add New Task**: Tap the floating action button (+) on the home screen
2. **Edit Task**: Swipe left on any task card and tap "Edit"
3. **Complete Task**: Tap the checkbox or swipe and use quick actions
4. **Delete Task**: Swipe left and tap "Delete", or use task details menu
5. **View Details**: Tap on any task card to see full details

### Categories and Priorities
- **6 Default Categories**: Personal, Work, Shopping, Health, Study, Finance
- **3 Priority Levels**: Low (🟢), Medium (🟡), High (🔴)
- **Visual Indicators**: Color-coded cards and priority badges

### Advanced Features
- **Quick Actions**: Access today's tasks, overdue items, and high priority
- **Search & Filter**: Find tasks by text, category, priority, or status
- **Statistics**: View completion rates, category breakdowns, and insights
- **Due Dates**: Set specific dates and times with visual overdue indicators
- **Tags**: Add multiple tags for better organization

### Search and Filtering
1. Tap the search icon in the home screen
2. Enter text to search in titles, descriptions, and tags
3. Use filter chips to narrow by priority, category, or status
4. Sort results by date, priority, or alphabetically

### Statistics Dashboard
- **Overall Stats**: Completion rate, total/completed/pending/overdue counts
- **Category Breakdown**: Task distribution and completion rates per category
- **Priority Analysis**: Distribution of tasks by priority level
- **Productivity Insights**: AI-powered recommendations and tips

## Key Features Explained

### Database Integration
- **Persistent Storage**: All data stored locally using SQLite
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Foreign Key Relations**: Categories linked to tasks with referential integrity
- **Data Migration**: Automatic database schema updates

### State Management
- **Provider Pattern**: Reactive state management with ChangeNotifier
- **Efficient Updates**: Only affected UI components refresh
- **Error Handling**: Graceful error handling with user feedback
- **Loading States**: Progress indicators during database operations

### User Experience
- **Material Design 3**: Latest design system with dynamic theming
- **Smooth Animations**: Staggered list animations and transitions
- **Swipe Gestures**: Intuitive swipe-to-edit and swipe-to-delete
- **Quick Actions**: One-tap access to important task lists
- **Smart Defaults**: Intelligent form pre-filling and suggestions

## Learning Outcomes
- **Flutter Development**: Building complex, multi-screen applications
- **SQLite Database**: Local database design, queries, and relationships
- **State Management**: Provider pattern and reactive programming
- **Date/Time Handling**: Working with dates, times, and duration calculations
- **Complex UI Components**: Custom widgets, animations, and gestures
- **Search Algorithms**: Text search, filtering, and sorting implementations
- **Data Visualization**: Statistics, progress indicators, and charts
- **User Experience Design**: Intuitive navigation and interaction patterns
- **Error Handling**: Robust error management and user feedback
- **Performance Optimization**: Efficient list rendering and database queries

## Future Enhancements
- [ ] Push notifications for due dates and reminders
- [ ] Data export/import functionality (JSON, CSV)
- [ ] Task templates for recurring activities
- [ ] Collaboration features (shared task lists)
- [ ] Dark theme support
- [ ] Voice input for task creation
- [ ] Attachment support (images, documents)
- [ ] Calendar integration
- [ ] Task time tracking and analytics
- [ ] Backup and sync with cloud services

## Troubleshooting

### Common Issues
1. **Database errors**: Delete app data and restart to reset database
2. **Performance issues**: Check for large number of tasks, consider pagination
3. **Date/time display**: Ensure device locale settings are correct

### Debug Commands
```bash
# Clear Flutter cache
flutter clean

# Rebuild dependencies
flutter pub get

# Run with debug output
flutter run --verbose
```
