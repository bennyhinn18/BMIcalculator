import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/conversion_models.dart';

class StorageService {
  static const String _historyKey = 'conversion_history';
  static const int _maxHistoryItems = 100;

  static Future<void> saveConversion(ConversionResult result) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final history = await getConversionHistory();
      
      // Add new conversion to the beginning
      history.insert(0, result);
      
      // Limit history size
      if (history.length > _maxHistoryItems) {
        history.removeRange(_maxHistoryItems, history.length);
      }
      
      // Convert to JSON and save
      final jsonHistory = history.map((e) => e.toJson()).toList();
      final jsonString = jsonEncode(jsonHistory);
      
      await prefs.setString(_historyKey, jsonString);
    } catch (e) {
      print('Error saving conversion: $e');
    }
  }

  static Future<List<ConversionResult>> getConversionHistory() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_historyKey);
      
      if (jsonString == null) return [];
      
      final jsonList = jsonDecode(jsonString) as List;
      return jsonList
          .map((json) => ConversionResult.fromJson(json as Map<String, dynamic>))
          .toList();
    } catch (e) {
      print('Error loading conversion history: $e');
      return [];
    }
  }

  static Future<void> clearHistory() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_historyKey);
    } catch (e) {
      print('Error clearing history: $e');
    }
  }

  static Future<List<ConversionResult>> getHistoryByCategory(
    ConversionCategory category,
  ) async {
    final history = await getConversionHistory();
    return history.where((result) => result.category == category).toList();
  }

  static Future<List<ConversionResult>> getRecentConversions({int limit = 10}) async {
    final history = await getConversionHistory();
    return history.take(limit).toList();
  }
}