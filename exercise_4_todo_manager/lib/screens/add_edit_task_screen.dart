import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';
import '../providers/task_provider.dart';
import '../models/task.dart';

class AddEditTaskScreen extends StatefulWidget {
  final Task? task;

  const AddEditTaskScreen({super.key, this.task});

  @override
  State<AddEditTaskScreen> createState() => _AddEditTaskScreenState();
}

class _AddEditTaskScreenState extends State<AddEditTaskScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _tagsController = TextEditingController();

  Priority _selectedPriority = Priority.medium;
  TaskCategory? _selectedCategory;
  DateTime? _selectedDueDate;
  TimeOfDay? _selectedDueTime;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _initializeFields();
  }

  void _initializeFields() {
    final taskProvider = Provider.of<TaskProvider>(context, listen: false);
    
    if (widget.task != null) {
      _titleController.text = widget.task!.title;
      _descriptionController.text = widget.task!.description;
      _tagsController.text = widget.task!.tags.join(', ');
      _selectedPriority = widget.task!.priority;
      _selectedCategory = taskProvider.getCategoryById(widget.task!.categoryId);
      
      if (widget.task!.dueDate != null) {
        _selectedDueDate = DateTime(
          widget.task!.dueDate!.year,
          widget.task!.dueDate!.month,
          widget.task!.dueDate!.day,
        );
        _selectedDueTime = TimeOfDay.fromDateTime(widget.task!.dueDate!);
      }
    } else {
      _selectedCategory = taskProvider.categories.isNotEmpty 
          ? taskProvider.categories.first 
          : null;
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _tagsController.dispose();
    super.dispose();
  }

  Future<void> _selectDueDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _selectedDueDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365 * 2)),
    );

    if (date != null) {
      setState(() {
        _selectedDueDate = date;
      });
    }
  }

  Future<void> _selectDueTime() async {
    final time = await showTimePicker(
      context: context,
      initialTime: _selectedDueTime ?? TimeOfDay.now(),
    );

    if (time != null) {
      setState(() {
        _selectedDueTime = time;
      });
    }
  }

  DateTime? _getCombinedDateTime() {
    if (_selectedDueDate == null) return null;
    
    final time = _selectedDueTime ?? const TimeOfDay(hour: 23, minute: 59);
    return DateTime(
      _selectedDueDate!.year,
      _selectedDueDate!.month,
      _selectedDueDate!.day,
      time.hour,
      time.minute,
    );
  }

  List<String> _parseTags(String tagsText) {
    return tagsText
        .split(',')
        .map((tag) => tag.trim())
        .where((tag) => tag.isNotEmpty)
        .toList();
  }

  Future<void> _saveTask() async {
    if (!_formKey.currentState!.validate() || _selectedCategory == null) {
      if (_selectedCategory == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please select a category')),
        );
      }
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final taskProvider = Provider.of<TaskProvider>(context, listen: false);
      final now = DateTime.now();

      final task = Task(
        id: widget.task?.id ?? const Uuid().v4(),
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        priority: _selectedPriority,
        dueDate: _getCombinedDateTime(),
        categoryId: _selectedCategory!.id,
        completed: widget.task?.completed ?? false,
        createdAt: widget.task?.createdAt ?? now,
        updatedAt: now,
        tags: _parseTags(_tagsController.text),
      );

      if (widget.task != null) {
        await taskProvider.updateTask(task);
      } else {
        await taskProvider.addTask(task);
      }

      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(widget.task != null 
                ? 'Task updated successfully' 
                : 'Task created successfully'),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error saving task: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.task != null ? 'Edit Task' : 'Add Task'),
        actions: [
          if (_isLoading)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
              ),
            )
          else
            TextButton(
              onPressed: _saveTask,
              child: const Text('Save'),
            ),
        ],
      ),
      body: Consumer<TaskProvider>(
        builder: (context, taskProvider, child) {
          return Form(
            key: _formKey,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Title field
                TextFormField(
                  controller: _titleController,
                  decoration: const InputDecoration(
                    labelText: 'Task Title',
                    hintText: 'Enter task title',
                    prefixIcon: Icon(Icons.title),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter a task title';
                    }
                    return null;
                  },
                  textCapitalization: TextCapitalization.sentences,
                ),
                
                const SizedBox(height: 16),
                
                // Description field
                TextFormField(
                  controller: _descriptionController,
                  decoration: const InputDecoration(
                    labelText: 'Description (Optional)',
                    hintText: 'Enter task description',
                    prefixIcon: Icon(Icons.description),
                  ),
                  maxLines: 3,
                  textCapitalization: TextCapitalization.sentences,
                ),
                
                const SizedBox(height: 16),
                
                // Priority selection
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Priority',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: Priority.values.map((priority) {
                            return Expanded(
                              child: RadioListTile<Priority>(
                                value: priority,
                                groupValue: _selectedPriority,
                                onChanged: (Priority? value) {
                                  setState(() {
                                    _selectedPriority = value!;
                                  });
                                },
                                title: Text(
                                  '${priority.emoji} ${priority.displayName}',
                                  style: const TextStyle(fontSize: 14),
                                ),
                                dense: true,
                                contentPadding: EdgeInsets.zero,
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // Category selection
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Category',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 12),
                        DropdownButtonFormField<TaskCategory>(
                          value: _selectedCategory,
                          decoration: const InputDecoration(
                            hintText: 'Select a category',
                            prefixIcon: Icon(Icons.category),
                          ),
                          items: taskProvider.categories.map((category) {
                            return DropdownMenuItem<TaskCategory>(
                              value: category,
                              child: Text('${category.emoji} ${category.name}'),
                            );
                          }).toList(),
                          onChanged: (TaskCategory? value) {
                            setState(() {
                              _selectedCategory = value;
                            });
                          },
                          validator: (value) {
                            if (value == null) {
                              return 'Please select a category';
                            }
                            return null;
                          },
                        ),
                      ],
                    ),
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // Due date and time
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Due Date & Time (Optional)',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: ListTile(
                                leading: const Icon(Icons.calendar_today),
                                title: Text(_selectedDueDate != null
                                    ? '${_selectedDueDate!.day}/${_selectedDueDate!.month}/${_selectedDueDate!.year}'
                                    : 'Select Date'),
                                onTap: _selectDueDate,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                  side: BorderSide(color: Colors.grey.shade300),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: ListTile(
                                leading: const Icon(Icons.access_time),
                                title: Text(_selectedDueTime != null
                                    ? _selectedDueTime!.format(context)
                                    : 'Select Time'),
                                onTap: _selectDueTime,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                  side: BorderSide(color: Colors.grey.shade300),
                                ),
                              ),
                            ),
                          ],
                        ),
                        if (_selectedDueDate != null)
                          Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                TextButton(
                                  onPressed: () {
                                    setState(() {
                                      _selectedDueDate = null;
                                      _selectedDueTime = null;
                                    });
                                  },
                                  child: const Text('Clear'),
                                ),
                              ],
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // Tags field
                TextFormField(
                  controller: _tagsController,
                  decoration: const InputDecoration(
                    labelText: 'Tags (Optional)',
                    hintText: 'Enter tags separated by commas',
                    prefixIcon: Icon(Icons.tag),
                    helperText: 'e.g., urgent, work, meeting',
                  ),
                  textCapitalization: TextCapitalization.words,
                ),
                
                const SizedBox(height: 32),
              ],
            ),
          );
        },
      ),
    );
  }
}