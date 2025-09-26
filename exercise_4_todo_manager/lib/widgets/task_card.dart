import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/task.dart';
import '../providers/task_provider.dart';
import '../screens/add_edit_task_screen.dart';

class TaskCard extends StatelessWidget {
  final Task task;

  const TaskCard({super.key, required this.task});

  @override
  Widget build(BuildContext context) {
    final taskProvider = Provider.of<TaskProvider>(context, listen: false);
    final category = taskProvider.getCategoryById(task.categoryId);

    return Slidable(
      endActionPane: ActionPane(
        motion: const ScrollMotion(),
        children: [
          SlidableAction(
            onPressed: (context) {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => AddEditTaskScreen(task: task),
                ),
              );
            },
            backgroundColor: Colors.blue,
            foregroundColor: Colors.white,
            icon: Icons.edit,
            label: 'Edit',
          ),
          SlidableAction(
            onPressed: (context) {
              _showDeleteDialog(context, taskProvider);
            },
            backgroundColor: Colors.red,
            foregroundColor: Colors.white,
            icon: Icons.delete,
            label: 'Delete',
          ),
        ],
      ),
      child: Card(
        margin: EdgeInsets.zero,
        child: InkWell(
          onTap: () {
            _showTaskDetails(context);
          },
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    // Completion checkbox
                    Checkbox(
                      value: task.completed,
                      onChanged: (bool? value) {
                        taskProvider.toggleTaskCompletion(task.id);
                      },
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                    
                    // Task title and category
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            task.title,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              decoration: task.completed 
                                  ? TextDecoration.lineThrough 
                                  : null,
                              color: task.completed 
                                  ? Colors.grey 
                                  : null,
                            ),
                          ),
                          if (task.description.isNotEmpty)
                            Padding(
                              padding: const EdgeInsets.only(top: 4),
                              child: Text(
                                task.description,
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[600],
                                  decoration: task.completed 
                                      ? TextDecoration.lineThrough 
                                      : null,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                        ],
                      ),
                    ),
                    
                    // Priority indicator
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: _getPriorityColor(task.priority).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: _getPriorityColor(task.priority).withOpacity(0.3),
                        ),
                      ),
                      child: Text(
                        '${task.priority.emoji} ${task.priority.displayName}',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: _getPriorityColor(task.priority),
                        ),
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 12),
                
                // Bottom row with category, due date, and tags
                Row(
                  children: [
                    // Category
                    if (category != null)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: _hexToColor(category.color).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '${category.emoji} ${category.name}',
                          style: TextStyle(
                            fontSize: 12,
                            color: _hexToColor(category.color),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    
                    const Spacer(),
                    
                    // Due date
                    if (task.dueDate != null)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: _getDueDateColor().withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.schedule,
                              size: 14,
                              color: _getDueDateColor(),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              _formatDueDate(),
                              style: TextStyle(
                                fontSize: 12,
                                color: _getDueDateColor(),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
                
                // Tags
                if (task.tags.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Wrap(
                      spacing: 6,
                      runSpacing: 4,
                      children: task.tags.map((tag) {
                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.grey[200],
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            '#$tag',
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey[700],
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Color _getPriorityColor(Priority priority) {
    switch (priority) {
      case Priority.low:
        return Colors.green;
      case Priority.medium:
        return Colors.orange;
      case Priority.high:
        return Colors.red;
    }
  }

  Color _getDueDateColor() {
    if (task.isOverdue && !task.completed) {
      return Colors.red;
    } else if (task.isDueToday && !task.completed) {
      return Colors.orange;
    }
    return Colors.blue;
  }

  String _formatDueDate() {
    if (task.dueDate == null) return '';
    
    final now = DateTime.now();
    final dueDate = task.dueDate!;
    
    if (task.isDueToday) {
      return 'Today ${DateFormat.Hm().format(dueDate)}';
    } else if (task.isDueTomorrow) {
      return 'Tomorrow ${DateFormat.Hm().format(dueDate)}';
    } else if (task.isOverdue) {
      return 'Overdue ${DateFormat.MMMd().format(dueDate)}';
    } else {
      return DateFormat.MMMd().format(dueDate);
    }
  }

  Color _hexToColor(String hexString) {
    final buffer = StringBuffer();
    if (hexString.length == 6 || hexString.length == 7) buffer.write('ff');
    buffer.write(hexString.replaceFirst('#', ''));
    return Color(int.parse(buffer.toString(), radix: 16));
  }

  void _showTaskDetails(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => TaskDetailsBottomSheet(task: task),
    );
  }

  void _showDeleteDialog(BuildContext context, TaskProvider taskProvider) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Delete Task'),
          content: Text('Are you sure you want to delete "${task.title}"?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                taskProvider.deleteTask(task.id);
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Task deleted')),
                );
              },
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );
  }
}

class TaskDetailsBottomSheet extends StatelessWidget {
  final Task task;

  const TaskDetailsBottomSheet({super.key, required this.task});

  @override
  Widget build(BuildContext context) {
    final taskProvider = Provider.of<TaskProvider>(context, listen: false);
    final category = taskProvider.getCategoryById(task.categoryId);

    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              Expanded(
                child: Text(
                  task.title,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              IconButton(
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => AddEditTaskScreen(task: task),
                    ),
                  );
                },
                icon: const Icon(Icons.edit),
              ),
            ],
          ),
          
          const SizedBox(height: 16),
          
          // Description
          if (task.description.isNotEmpty) ...[
            Text(
              task.description,
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[700],
              ),
            ),
            const SizedBox(height: 16),
          ],
          
          // Details
          _buildDetailRow('Priority', '${task.priority.emoji} ${task.priority.displayName}'),
          if (category != null)
            _buildDetailRow('Category', '${category.emoji} ${category.name}'),
          if (task.dueDate != null)
            _buildDetailRow('Due Date', DateFormat.yMMMd().add_Hm().format(task.dueDate!)),
          _buildDetailRow('Status', task.completed ? 'Completed' : 'Pending'),
          _buildDetailRow('Created', DateFormat.yMMMd().add_Hm().format(task.createdAt)),
          
          // Tags
          if (task.tags.isNotEmpty) ...[
            const SizedBox(height: 16),
            const Text(
              'Tags',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: task.tags.map((tag) {
                return Chip(
                  label: Text('#$tag'),
                  backgroundColor: Colors.grey[200],
                );
              }).toList(),
            ),
          ],
          
          const SizedBox(height: 24),
          
          // Actions
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    taskProvider.toggleTaskCompletion(task.id);
                    Navigator.pop(context);
                  },
                  icon: Icon(task.completed ? Icons.undo : Icons.check),
                  label: Text(task.completed ? 'Mark Incomplete' : 'Mark Complete'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
          Expanded(
            child: Text(value),
          ),
        ],
      ),
    );
  }
}