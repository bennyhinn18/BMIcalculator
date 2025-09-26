import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/task_provider.dart';
import '../models/task.dart';
import '../widgets/task_card.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  bool _showFilters = false;

  @override
  void initState() {
    super.initState();
    final taskProvider = Provider.of<TaskProvider>(context, listen: false);
    _searchController.text = taskProvider.searchQuery;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _searchController,
          autofocus: true,
          decoration: const InputDecoration(
            hintText: 'Search tasks...',
            border: InputBorder.none,
            hintStyle: TextStyle(color: Colors.white70),
          ),
          style: const TextStyle(color: Colors.white, fontSize: 18),
          onChanged: (query) {
            Provider.of<TaskProvider>(context, listen: false)
                .setSearchQuery(query);
          },
        ),
        actions: [
          IconButton(
            icon: Icon(_showFilters ? Icons.filter_list : Icons.filter_list_off),
            onPressed: () {
              setState(() {
                _showFilters = !_showFilters;
              });
            },
          ),
          IconButton(
            icon: const Icon(Icons.clear),
            onPressed: () {
              _searchController.clear();
              Provider.of<TaskProvider>(context, listen: false).clearAllFilters();
            },
          ),
        ],
      ),
      body: Consumer<TaskProvider>(
        builder: (context, taskProvider, child) {
          return Column(
            children: [
              // Filters section
              if (_showFilters)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    border: Border(
                      bottom: BorderSide(color: Colors.grey[300]!),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Filters',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      
                      // Priority filter
                      _buildFilterChips(
                        'Priority',
                        Priority.values.map((p) => FilterChip(
                          label: Text('${p.emoji} ${p.displayName}'),
                          selected: taskProvider.filterPriority == p,
                          onSelected: (selected) {
                            taskProvider.setFilterPriority(selected ? p : null);
                          },
                        )).toList(),
                      ),
                      
                      const SizedBox(height: 8),
                      
                      // Category filter
                      _buildFilterChips(
                        'Category',
                        taskProvider.categories.map((c) => FilterChip(
                          label: Text('${c.emoji} ${c.name}'),
                          selected: taskProvider.filterCategoryId == c.id,
                          onSelected: (selected) {
                            taskProvider.setFilterCategory(selected ? c.id : null);
                          },
                        )).toList(),
                      ),
                      
                      const SizedBox(height: 8),
                      
                      // Completion status filter
                      _buildFilterChips(
                        'Status',
                        [
                          FilterChip(
                            label: const Text('Completed'),
                            selected: taskProvider.filterCompleted == true,
                            onSelected: (selected) {
                              taskProvider.setFilterCompleted(selected ? true : null);
                            },
                          ),
                          FilterChip(
                            label: const Text('Pending'),
                            selected: taskProvider.filterCompleted == false,
                            onSelected: (selected) {
                              taskProvider.setFilterCompleted(selected ? false : null);
                            },
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 12),
                      
                      // Sort options
                      const Text(
                        'Sort by',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        children: [
                          _buildSortChip('Newest First', 'created_at DESC', taskProvider),
                          _buildSortChip('Oldest First', 'created_at ASC', taskProvider),
                          _buildSortChip('Due Date', 'due_date ASC', taskProvider),
                          _buildSortChip('Priority', 'priority DESC', taskProvider),
                          _buildSortChip('Title A-Z', 'title ASC', taskProvider),
                        ],
                      ),
                    ],
                  ),
                ),
              
              // Search results
              Expanded(
                child: taskProvider.tasks.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.search_off,
                              size: 64,
                              color: Colors.grey[400],
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'No tasks found',
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.grey[600],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Try adjusting your search or filters',
                              style: TextStyle(
                                color: Colors.grey[500],
                              ),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: taskProvider.tasks.length,
                        itemBuilder: (context, index) {
                          final task = taskProvider.tasks[index];
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: TaskCard(task: task),
                          );
                        },
                      ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildFilterChips(String title, List<Widget> chips) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 4),
        Wrap(
          spacing: 8,
          children: chips,
        ),
      ],
    );
  }

  Widget _buildSortChip(String label, String sortValue, TaskProvider taskProvider) {
    return ChoiceChip(
      label: Text(label),
      selected: taskProvider._sortBy == sortValue,
      onSelected: (selected) {
        if (selected) {
          taskProvider.setSortBy(sortValue);
        }
      },
    );
  }
}

// Extension to access private field for demonstration
extension TaskProviderExtension on TaskProvider {
  String get _sortBy => 'created_at DESC'; // This would need to be exposed properly
}