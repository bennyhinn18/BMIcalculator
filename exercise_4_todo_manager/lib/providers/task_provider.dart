import 'package:flutter/material.dart';
import '../models/task.dart';
import '../services/database_service.dart';

class TaskProvider with ChangeNotifier {
  final DatabaseService _databaseService = DatabaseService.instance;
  
  List<Task> _tasks = [];
  List<TaskCategory> _categories = [];
  Map<String, int> _statistics = {};
  bool _isLoading = false;
  String _searchQuery = '';
  Priority? _filterPriority;
  String? _filterCategoryId;
  bool? _filterCompleted;
  String _sortBy = 'created_at DESC';

  // Getters
  List<Task> get tasks => _tasks;
  List<TaskCategory> get categories => _categories;
  Map<String, int> get statistics => _statistics;
  bool get isLoading => _isLoading;
  String get searchQuery => _searchQuery;
  Priority? get filterPriority => _filterPriority;
  String? get filterCategoryId => _filterCategoryId;
  bool? get filterCompleted => _filterCompleted;

  List<Task> get completedTasks => _tasks.where((task) => task.completed).toList();
  List<Task> get pendingTasks => _tasks.where((task) => !task.completed).toList();
  List<Task> get overdueTasks => _tasks.where((task) => task.isOverdue).toList();
  List<Task> get todayTasks => _tasks.where((task) => task.isDueToday).toList();

  // Initialize data
  Future<void> initialize() async {
    _isLoading = true;
    notifyListeners();

    try {
      await loadCategories();
      await loadTasks();
      await loadStatistics();
    } catch (e) {
      debugPrint('Error initializing TaskProvider: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Categories operations
  Future<void> loadCategories() async {
    try {
      _categories = await _databaseService.getCategories();
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading categories: $e');
    }
  }

  TaskCategory? getCategoryById(String id) {
    try {
      return _categories.firstWhere((category) => category.id == id);
    } catch (e) {
      return null;
    }
  }

  Future<void> addCategory(TaskCategory category) async {
    try {
      await _databaseService.insertCategory(category);
      await loadCategories();
    } catch (e) {
      debugPrint('Error adding category: $e');
    }
  }

  Future<void> updateCategory(TaskCategory category) async {
    try {
      await _databaseService.updateCategory(category);
      await loadCategories();
    } catch (e) {
      debugPrint('Error updating category: $e');
    }
  }

  Future<void> deleteCategory(String id) async {
    try {
      await _databaseService.deleteCategory(id);
      await loadCategories();
      await loadTasks(); // Reload tasks as category relationships might change
    } catch (e) {
      debugPrint('Error deleting category: $e');
    }
  }

  // Tasks operations
  Future<void> loadTasks() async {
    try {
      _tasks = await _databaseService.getTasks(
        completed: _filterCompleted,
        categoryId: _filterCategoryId,
        priority: _filterPriority,
        searchQuery: _searchQuery.isEmpty ? null : _searchQuery,
        orderBy: _sortBy,
      );
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading tasks: $e');
    }
  }

  Future<void> addTask(Task task) async {
    try {
      await _databaseService.insertTask(task);
      await loadTasks();
      await loadStatistics();
    } catch (e) {
      debugPrint('Error adding task: $e');
    }
  }

  Future<void> updateTask(Task task) async {
    try {
      final updatedTask = task.copyWith(updatedAt: DateTime.now());
      await _databaseService.updateTask(updatedTask);
      await loadTasks();
      await loadStatistics();
    } catch (e) {
      debugPrint('Error updating task: $e');
    }
  }

  Future<void> deleteTask(String id) async {
    try {
      await _databaseService.deleteTask(id);
      await loadTasks();
      await loadStatistics();
    } catch (e) {
      debugPrint('Error deleting task: $e');
    }
  }

  Future<void> toggleTaskCompletion(String id) async {
    try {
      await _databaseService.toggleTaskCompletion(id);
      await loadTasks();
      await loadStatistics();
    } catch (e) {
      debugPrint('Error toggling task completion: $e');
    }
  }

  // Search and filter operations
  void setSearchQuery(String query) {
    _searchQuery = query;
    loadTasks();
  }

  void clearSearch() {
    _searchQuery = '';
    loadTasks();
  }

  void setFilterPriority(Priority? priority) {
    _filterPriority = priority;
    loadTasks();
  }

  void setFilterCategory(String? categoryId) {
    _filterCategoryId = categoryId;
    loadTasks();
  }

  void setFilterCompleted(bool? completed) {
    _filterCompleted = completed;
    loadTasks();
  }

  void setSortBy(String sortBy) {
    _sortBy = sortBy;
    loadTasks();
  }

  void clearAllFilters() {
    _searchQuery = '';
    _filterPriority = null;
    _filterCategoryId = null;
    _filterCompleted = null;
    _sortBy = 'created_at DESC';
    loadTasks();
  }

  // Statistics
  Future<void> loadStatistics() async {
    try {
      _statistics = await _databaseService.getTaskStatistics();
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading statistics: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getTasksByCategory() async {
    try {
      return await _databaseService.getTasksByCategory();
    } catch (e) {
      debugPrint('Error loading tasks by category: $e');
      return [];
    }
  }

  // Quick access methods
  Future<List<Task>> getTodayTasks() async {
    try {
      return await _databaseService.getTasksDueToday();
    } catch (e) {
      debugPrint('Error loading today tasks: $e');
      return [];
    }
  }

  Future<List<Task>> getOverdueTasks() async {
    try {
      return await _databaseService.getOverdueTasks();
    } catch (e) {
      debugPrint('Error loading overdue tasks: $e');
      return [];
    }
  }

  // Utility methods
  Task? getTaskById(String id) {
    try {
      return _tasks.firstWhere((task) => task.id == id);
    } catch (e) {
      return null;
    }
  }

  int get totalTasks => _statistics['total'] ?? 0;
  int get completedTasksCount => _statistics['completed'] ?? 0;
  int get pendingTasksCount => _statistics['pending'] ?? 0;
  int get overdueTasksCount => _statistics['overdue'] ?? 0;

  double get completionPercentage {
    if (totalTasks == 0) return 0.0;
    return (completedTasksCount / totalTasks) * 100;
  }
}