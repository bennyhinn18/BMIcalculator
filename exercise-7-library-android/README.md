# Exercise 7: Library Management System (Android)

## Objective
Write programs using Java to create Android application having databases for a simple library application, displaying books available, books lent, book reservation. Assume that student information is available in a database stored in a database server.

## Features (To be implemented)
- [ ] Display available books
- [ ] Track lent books with due dates
- [ ] Book reservation system
- [ ] Student information management
- [ ] Search and filter books
- [ ] Fine calculation for overdue books
- [ ] Admin and student user roles

## Database Schema
```sql
-- Students Table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    department TEXT
);

-- Books Table
CREATE TABLE books (
    book_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT,
    isbn TEXT UNIQUE,
    category TEXT,
    total_copies INTEGER,
    available_copies INTEGER
);

-- Transactions Table
CREATE TABLE transactions (
    transaction_id INTEGER PRIMARY KEY,
    student_id INTEGER,
    book_id INTEGER,
    issue_date DATE,
    due_date DATE,
    return_date DATE,
    status TEXT, -- 'issued', 'returned', 'overdue'
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

-- Reservations Table
CREATE TABLE reservations (
    reservation_id INTEGER PRIMARY KEY,
    student_id INTEGER,
    book_id INTEGER,
    reservation_date DATE,
    status TEXT, -- 'active', 'fulfilled', 'cancelled'
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);
```

## Technology Stack
- Android SDK (Java/Kotlin)
- SQLite database with Room ORM
- RecyclerView for list displays
- Material Design components
- REST API integration (optional)

## App Modules
1. **Authentication Module**
   - Student login
   - Admin login
   
2. **Book Management**
   - Browse books
   - Search functionality
   - Book details view
   
3. **Transaction Management**
   - Issue books
   - Return books
   - View transaction history
   
4. **Reservation System**
   - Reserve books
   - View reservations
   - Cancel reservations

## Setup Instructions
**Coming Soon** - This exercise will be implemented in the next phase of the laboratory.

### Prerequisites
- Android Studio
- Java Development Kit (JDK 8+)
- Android SDK
- SQLite knowledge

## Learning Outcomes
- Android app development with Java
- SQLite database operations
- RecyclerView implementation
- Material Design principles
- CRUD operations
- Database relationships and constraints
- User authentication
- Role-based access control
