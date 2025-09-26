import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/task_provider.dart';
import '../models/task.dart'; // Import where Priority is defined

class StatisticsScreen extends StatelessWidget {
  const StatisticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Statistics'),
      ),
      body: Consumer<TaskProvider>(
        builder: (context, taskProvider, child) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Overall statistics
                _buildStatisticsCard(taskProvider),
                
                const SizedBox(height: 20),
                
                // Tasks by category
                FutureBuilder<List<Map<String, dynamic>>>(
                  future: taskProvider.getTasksByCategory(),
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const Center(child: CircularProgressIndicator());
                    }
                    
                    if (!snapshot.hasData || snapshot.data!.isEmpty) {
                      return const Card(
                        child: Padding(
                          padding: EdgeInsets.all(16),
                          child: Text('No category data available'),
                        ),
                      );
                    }
                    
                    return _buildCategoryStatistics(snapshot.data!);
                  },
                ),
                
                const SizedBox(height: 20),
                
                // Priority distribution
                _buildPriorityDistribution(taskProvider),
                
                const SizedBox(height: 20),
                
                // Productivity insights
                _buildProductivityInsights(taskProvider),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatisticsCard(TaskProvider taskProvider) {
    final stats = taskProvider.statistics;
    final completionRate = taskProvider.completionPercentage;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Overall Statistics',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            
            // Completion rate
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Completion Rate',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey[600],
                        ),
                      ),
                      Text(
                        '${completionRate.toStringAsFixed(1)}%',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(
                  width: 80,
                  height: 80,
                  child: CircularProgressIndicator(
                    value: completionRate / 100,
                    strokeWidth: 8,
                    backgroundColor: Colors.grey[300],
                    valueColor: const AlwaysStoppedAnimation<Color>(Colors.green),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 20),
            
            // Task counts
            Row(
              children: [
                Expanded(
                  child: _buildStatItem(
                    'Total Tasks',
                    stats['total']?.toString() ?? '0',
                    Icons.task_alt,
                    Colors.blue,
                  ),
                ),
                Expanded(
                  child: _buildStatItem(
                    'Completed',
                    stats['completed']?.toString() ?? '0',
                    Icons.check_circle,
                    Colors.green,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 12),
            
            Row(
              children: [
                Expanded(
                  child: _buildStatItem(
                    'Pending',
                    stats['pending']?.toString() ?? '0',
                    Icons.pending,
                    Colors.orange,
                  ),
                ),
                Expanded(
                  child: _buildStatItem(
                    'Overdue',
                    stats['overdue']?.toString() ?? '0',
                    Icons.warning,
                    Colors.red,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryStatistics(List<Map<String, dynamic>> categoryStats) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Tasks by Category',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            
            ...categoryStats.map((category) {
              final totalTasks = category['task_count'] as int;
              final completedTasks = category['completed_count'] as int;
              final completionRate = totalTasks > 0 
                  ? (completedTasks / totalTasks) * 100 
                  : 0.0;
              
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Text(
                          '${category['category_emoji']} ${category['category_name']}',
                          style: const TextStyle(fontWeight: FontWeight.w600),
                        ),
                        const Spacer(),
                        Text('$completedTasks/$totalTasks'),
                      ],
                    ),
                    const SizedBox(height: 4),
                    LinearProgressIndicator(
                      value: completionRate / 100,
                      backgroundColor: Colors.grey[300],
                      valueColor: AlwaysStoppedAnimation<Color>(
                        completionRate >= 100 
                            ? Colors.green 
                            : completionRate >= 50 
                                ? Colors.orange 
                                : Colors.red,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Text(
                          '${completionRate.toStringAsFixed(0)}%',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            }).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildPriorityDistribution(TaskProvider taskProvider) {
    final tasks = taskProvider.tasks;
    final highPriority = tasks.where((t) => t.priority == Priority.high).length;
    final mediumPriority = tasks.where((t) => t.priority == Priority.medium).length;
    final lowPriority = tasks.where((t) => t.priority == Priority.low).length;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Priority Distribution',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            
            _buildPriorityItem('🔴 High Priority', highPriority, Colors.red),
            const SizedBox(height: 8),
            _buildPriorityItem('🟡 Medium Priority', mediumPriority, Colors.orange),
            const SizedBox(height: 8),
            _buildPriorityItem('🟢 Low Priority', lowPriority, Colors.green),
          ],
        ),
      ),
    );
  }

  Widget _buildPriorityItem(String label, int count, Color color) {
    return Row(
      children: [
        Expanded(
          child: Text(
            label,
            style: const TextStyle(fontWeight: FontWeight.w500),
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: color.withOpacity(0.3)),
          ),
          child: Text(
            count.toString(),
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildProductivityInsights(TaskProvider taskProvider) {
    final stats = taskProvider.statistics;
    final total = stats['total'] ?? 0;
    final completed = stats['completed'] ?? 0;
    final overdue = stats['overdue'] ?? 0;

    List<String> insights = [];
    
    if (total == 0) {
      insights.add("Start by adding your first task!");
    } else {
      final completionRate = (completed / total) * 100;
      
      if (completionRate >= 80) {
        insights.add("🎉 Excellent! You're completing most of your tasks.");
      } else if (completionRate >= 60) {
        insights.add("👍 Good progress! Keep up the momentum.");
      } else if (completionRate >= 40) {
        insights.add("📈 You're making progress. Consider breaking large tasks into smaller ones.");
      } else {
        insights.add("💪 Focus on completing existing tasks before adding new ones.");
      }
      
      if (overdue > 0) {
        insights.add("⚠️ You have $overdue overdue task${overdue > 1 ? 's' : ''}. Consider reviewing your deadlines.");
      }
      
      if (overdue == 0 && completed > 0) {
        insights.add("✅ Great job staying on top of your deadlines!");
      }
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Productivity Insights',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            
            ...insights.map((insight) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(
                    Icons.lightbulb_outline,
                    size: 20,
                    color: Colors.amber,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      insight,
                      style: const TextStyle(fontSize: 14),
                    ),
                  ),
                ],
              ),
            )).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon, Color color) {
    return Column(
      children: [
        Icon(
          icon,
          color: color,
          size: 32,
        ),
        const SizedBox(height: 8),
        Text(
          value,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            color: Colors.grey,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}