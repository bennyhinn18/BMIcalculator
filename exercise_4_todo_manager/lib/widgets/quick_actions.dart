import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/task_provider.dart';
import '../models/task.dart';

class QuickActions extends StatelessWidget {
  const QuickActions({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<TaskProvider>(
      builder: (context, taskProvider, child) {
        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _buildQuickActionCard(
              'Today',
              taskProvider.todayTasks.length.toString(),
              Icons.today,
              Colors.blue,
              () => _showTodayTasks(context, taskProvider),
            ),
            _buildQuickActionCard(
              'Overdue',
              taskProvider.overdueTasks.length.toString(),
              Icons.warning,
              Colors.red,
              () => _showOverdueTasks(context, taskProvider),
            ),
            _buildQuickActionCard(
              'High Priority',
              taskProvider.tasks.where((t) => t.priority.value == 3 && !t.completed).length.toString(),
              Icons.priority_high,
              Colors.orange,
              () => _showHighPriorityTasks(context, taskProvider),
            ),
          ],
        );
      },
    );
  }

  Widget _buildQuickActionCard(
    String label,
    String count,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: Colors.white.withOpacity(0.3),
              ),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  icon,
                  color: Colors.white,
                  size: 24,
                ),
                const SizedBox(height: 4),
                Text(
                  count,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.white70,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showTodayTasks(BuildContext context, TaskProvider taskProvider) {
    _showTaskBottomSheet(
      context,
      'Today\'s Tasks',
      taskProvider.todayTasks,
      Icons.today,
    );
  }

  void _showOverdueTasks(BuildContext context, TaskProvider taskProvider) {
    _showTaskBottomSheet(
      context,
      'Overdue Tasks',
      taskProvider.overdueTasks,
      Icons.warning,
    );
  }

  void _showHighPriorityTasks(BuildContext context, TaskProvider taskProvider) {
    final highPriorityTasks = taskProvider.tasks
        .where((t) => t.priority.value == 3 && !t.completed)
        .toList();
    
    _showTaskBottomSheet(
      context,
      'High Priority Tasks',
      highPriorityTasks,
      Icons.priority_high,
    );
  }

  void _showTaskBottomSheet(
    BuildContext context,
    String title,
    List tasks,
    IconData icon,
  ) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * 0.6,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Icon(icon),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            if (tasks.isEmpty)
              const Expanded(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.check_circle_outline,
                        size: 48,
                        color: Colors.grey,
                      ),
                      SizedBox(height: 8),
                      Text(
                        'No tasks found',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
              )
            else
              Expanded(
                child: ListView.builder(
                  itemCount: tasks.length,
                  itemBuilder: (context, index) {
                    final task = tasks[index];
                    return ListTile(
                      leading: Checkbox(
                        value: task.completed,
                        onChanged: (value) {
                          Provider.of<TaskProvider>(context, listen: false)
                              .toggleTaskCompletion(task.id);
                          Navigator.pop(context);
                        },
                      ),
                      title: Text(task.title),
                      subtitle: task.description.isNotEmpty 
                          ? Text(task.description) 
                          : null,
                      trailing: Text(
                        '${task.priority.emoji} ${task.priority.displayName}',
                        style: const TextStyle(fontSize: 12),
                      ),
                    );
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }
}