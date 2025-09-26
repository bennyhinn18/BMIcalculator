enum Priority {
  low,
  medium,
  high;

  static Priority fromValue(int value) {
    switch (value) {
      case 1:
        return Priority.low;
      case 2:
        return Priority.medium;
      case 3:
        return Priority.high;
      default:
        return Priority.medium;
    }
  }
}

extension PriorityExtension on Priority {
  String get displayName {
    switch (this) {
      case Priority.low:
        return 'Low';
      case Priority.medium:
        return 'Medium';
      case Priority.high:
        return 'High';
    }
  }

  String get emoji {
    switch (this) {
      case Priority.low:
        return '🟢';
      case Priority.medium:
        return '🟡';
      case Priority.high:
        return '🔴';
    }
  }

  int get value {
    switch (this) {
      case Priority.low:
        return 1;
      case Priority.medium:
        return 2;
      case Priority.high:
        return 3;
    }
  }
  static Priority fromValue(int value) {
    switch (value) {
      case 1:
        return Priority.low;
      case 2:
        return Priority.medium;
      case 3:
        return Priority.high;
      default:
        return Priority.medium;
    }
  }
}

class TaskCategory {
  final String id;
  final String name;
  final String emoji;
  final String color;

  TaskCategory({
    required this.id,
    required this.name,
    required this.emoji,
    required this.color,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'emoji': emoji,
      'color': color,
    };
  }

  factory TaskCategory.fromMap(Map<String, dynamic> map) {
    return TaskCategory(
      id: map['id'] ?? '',
      name: map['name'] ?? '',
      emoji: map['emoji'] ?? '📝',
      color: map['color'] ?? '#2196F3',
    );
  }

  static List<TaskCategory> getDefaultCategories() {
    return [
      TaskCategory(id: '1', name: 'Personal', emoji: '👤', color: '#2196F3'),
      TaskCategory(id: '2', name: 'Work', emoji: '💼', color: '#FF9800'),
      TaskCategory(id: '3', name: 'Shopping', emoji: '🛒', color: '#4CAF50'),
      TaskCategory(id: '4', name: 'Health', emoji: '🏥', color: '#F44336'),
      TaskCategory(id: '5', name: 'Study', emoji: '📚', color: '#9C27B0'),
      TaskCategory(id: '6', name: 'Finance', emoji: '💰', color: '#00BCD4'),
    ];
  }
}

class Task {
  final String id;
  final String title;
  final String description;
  final Priority priority;
  final DateTime? dueDate;
  final String categoryId;
  final bool completed;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<String> tags;

  Task({
    required this.id,
    required this.title,
    this.description = '',
    this.priority = Priority.medium,
    this.dueDate,
    required this.categoryId,
    this.completed = false,
    required this.createdAt,
    required this.updatedAt,
    this.tags = const [],
  });

  Task copyWith({
    String? id,
    String? title,
    String? description,
    Priority? priority,
    DateTime? dueDate,
    String? categoryId,
    bool? completed,
    DateTime? createdAt,
    DateTime? updatedAt,
    List<String>? tags,
  }) {
    return Task(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      priority: priority ?? this.priority,
      dueDate: dueDate ?? this.dueDate,
      categoryId: categoryId ?? this.categoryId,
      completed: completed ?? this.completed,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      tags: tags ?? this.tags,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'priority': priority.value,
      'due_date': dueDate?.millisecondsSinceEpoch,
      'category_id': categoryId,
      'completed': completed ? 1 : 0,
      'created_at': createdAt.millisecondsSinceEpoch,
      'updated_at': updatedAt.millisecondsSinceEpoch,
      'tags': tags.join(','),
    };
  }

  factory Task.fromMap(Map<String, dynamic> map) {
    return Task(
      id: map['id'] ?? '',
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      priority: Priority.fromValue(map['priority'] ?? 2),
      dueDate: map['due_date'] != null 
          ? DateTime.fromMillisecondsSinceEpoch(map['due_date'])
          : null,
      categoryId: map['category_id'] ?? '1',
      completed: (map['completed'] ?? 0) == 1,
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(map['updated_at']),
      tags: map['tags'] != null && map['tags'].isNotEmpty 
          ? map['tags'].split(',') 
          : [],
    );
  }

  bool get isOverdue {
    if (dueDate == null || completed) return false;
    return DateTime.now().isAfter(dueDate!);
  }

  bool get isDueToday {
    if (dueDate == null) return false;
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final taskDate = DateTime(dueDate!.year, dueDate!.month, dueDate!.day);
    return today == taskDate;
  }

  bool get isDueTomorrow {
    if (dueDate == null) return false;
    final now = DateTime.now();
    final tomorrow = DateTime(now.year, now.month, now.day + 1);
    final taskDate = DateTime(dueDate!.year, dueDate!.month, dueDate!.day);
    return tomorrow == taskDate;
  }
}