import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/task.dart';

class DatabaseService {
  static Database? _database;
  static const String _databaseName = 'todo_manager.db';
  static const int _databaseVersion = 1;

  // Table names
  static const String _tasksTable = 'tasks';
  static const String _categoriesTable = 'categories';

  // Singleton pattern
  DatabaseService._privateConstructor();
  static final DatabaseService instance = DatabaseService._privateConstructor();

  Future<Database> get database async {
    _database ??= await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    String path = join(await getDatabasesPath(), _databaseName);
    return await openDatabase(
      path,
      version: _databaseVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  Future _onCreate(Database db, int version) async {
    // Create categories table
    await db.execute('''
      CREATE TABLE $_categoriesTable (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        emoji TEXT NOT NULL,
        color TEXT NOT NULL
      )
    ''');

    // Create tasks table
    await db.execute('''
      CREATE TABLE $_tasksTable (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        priority INTEGER NOT NULL DEFAULT 2,
        due_date INTEGER,
        category_id TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        tags TEXT,
        FOREIGN KEY (category_id) REFERENCES $_categoriesTable (id)
      )
    ''');

    // Insert default categories
    final defaultCategories = TaskCategory.getDefaultCategories();
    for (final category in defaultCategories) {
      await db.insert(_categoriesTable, category.toMap());
    }
  }

  Future _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Handle database upgrades here
    if (oldVersion < newVersion) {
      // Add upgrade logic if needed
    }
  }

  // Category CRUD operations
  Future<List<TaskCategory>> getCategories() async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(_categoriesTable);
    return List.generate(maps.length, (i) => TaskCategory.fromMap(maps[i]));
  }

  Future<TaskCategory?> getCategoryById(String id) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      _categoriesTable,
      where: 'id = ?',
      whereArgs: [id],
    );
    return maps.isNotEmpty ? TaskCategory.fromMap(maps.first) : null;
  }

  Future<int> insertCategory(TaskCategory category) async {
    final db = await database;
    return await db.insert(_categoriesTable, category.toMap());
  }

  Future<int> updateCategory(TaskCategory category) async {
    final db = await database;
    return await db.update(
      _categoriesTable,
      category.toMap(),
      where: 'id = ?',
      whereArgs: [category.id],
    );
  }

  Future<int> deleteCategory(String id) async {
    final db = await database;
    return await db.delete(
      _categoriesTable,
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // Task CRUD operations
  Future<List<Task>> getTasks({
    bool? completed,
    String? categoryId,
    Priority? priority,
    String? searchQuery,
    String orderBy = 'created_at DESC',
  }) async {
    final db = await database;
    
    List<String> whereConditions = [];
    List<dynamic> whereArgs = [];

    if (completed != null) {
      whereConditions.add('completed = ?');
      whereArgs.add(completed ? 1 : 0);
    }

    if (categoryId != null) {
      whereConditions.add('category_id = ?');
      whereArgs.add(categoryId);
    }

    if (priority != null) {
      whereConditions.add('priority = ?');
      whereArgs.add(priority.value);
    }

    if (searchQuery != null && searchQuery.isNotEmpty) {
      whereConditions.add('(title LIKE ? OR description LIKE ? OR tags LIKE ?)');
      final query = '%$searchQuery%';
      whereArgs.addAll([query, query, query]);
    }

    final String? whereClause = whereConditions.isNotEmpty 
        ? whereConditions.join(' AND ') 
        : null;

    final List<Map<String, dynamic>> maps = await db.query(
      _tasksTable,
      where: whereClause,
      whereArgs: whereArgs.isNotEmpty ? whereArgs : null,
      orderBy: orderBy,
    );

    return List.generate(maps.length, (i) => Task.fromMap(maps[i]));
  }

  Future<Task?> getTaskById(String id) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      _tasksTable,
      where: 'id = ?',
      whereArgs: [id],
    );
    return maps.isNotEmpty ? Task.fromMap(maps.first) : null;
  }

  Future<int> insertTask(Task task) async {
    final db = await database;
    return await db.insert(_tasksTable, task.toMap());
  }

  Future<int> updateTask(Task task) async {
    final db = await database;
    return await db.update(
      _tasksTable,
      task.toMap(),
      where: 'id = ?',
      whereArgs: [task.id],
    );
  }

  Future<int> deleteTask(String id) async {
    final db = await database;
    return await db.delete(
      _tasksTable,
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<int> toggleTaskCompletion(String id) async {
    final task = await getTaskById(id);
    if (task == null) return 0;

    final updatedTask = task.copyWith(
      completed: !task.completed,
      updatedAt: DateTime.now(),
    );

    return await updateTask(updatedTask);
  }

  // Statistics queries
  Future<Map<String, int>> getTaskStatistics() async {
    final db = await database;
    
    final totalResult = await db.rawQuery('SELECT COUNT(*) as total FROM $_tasksTable');
    final completedResult = await db.rawQuery('SELECT COUNT(*) as completed FROM $_tasksTable WHERE completed = 1');
    final pendingResult = await db.rawQuery('SELECT COUNT(*) as pending FROM $_tasksTable WHERE completed = 0');
    final overdueResult = await db.rawQuery('''
      SELECT COUNT(*) as overdue FROM $_tasksTable 
      WHERE completed = 0 AND due_date IS NOT NULL AND due_date < ?
    ''', [DateTime.now().millisecondsSinceEpoch]);

    return {
      'total': totalResult.first['total'] as int,
      'completed': completedResult.first['completed'] as int,
      'pending': pendingResult.first['pending'] as int,
      'overdue': overdueResult.first['overdue'] as int,
    };
  }

  Future<List<Map<String, dynamic>>> getTasksByCategory() async {
    final db = await database;
    final result = await db.rawQuery('''
      SELECT 
        c.name as category_name,
        c.emoji as category_emoji,
        COUNT(t.id) as task_count,
        SUM(CASE WHEN t.completed = 1 THEN 1 ELSE 0 END) as completed_count
      FROM $_categoriesTable c
      LEFT JOIN $_tasksTable t ON c.id = t.category_id
      GROUP BY c.id, c.name, c.emoji
      ORDER BY task_count DESC
    ''');
    
    return result;
  }

  Future<List<Task>> getTasksDueToday() async {
    final now = DateTime.now();
    final startOfDay = DateTime(now.year, now.month, now.day).millisecondsSinceEpoch;
    final endOfDay = DateTime(now.year, now.month, now.day, 23, 59, 59).millisecondsSinceEpoch;

    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      _tasksTable,
      where: 'completed = 0 AND due_date >= ? AND due_date <= ?',
      whereArgs: [startOfDay, endOfDay],
      orderBy: 'due_date ASC',
    );

    return List.generate(maps.length, (i) => Task.fromMap(maps[i]));
  }

  Future<List<Task>> getOverdueTasks() async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      _tasksTable,
      where: 'completed = 0 AND due_date IS NOT NULL AND due_date < ?',
      whereArgs: [DateTime.now().millisecondsSinceEpoch],
      orderBy: 'due_date ASC',
    );

    return List.generate(maps.length, (i) => Task.fromMap(maps[i]));
  }

  // Clean up
  Future<void> close() async {
    final db = await database;
    await db.close();
  }

  Future<void> deleteDatabase() async {
    String path = join(await getDatabasesPath(), _databaseName);
    await databaseFactory.deleteDatabase(path);
    _database = null;
  }
}