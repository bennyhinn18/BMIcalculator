enum ConversionCategory {
  length,
  weight,
  temperature,
  volume,
  area,
}

extension ConversionCategoryExtension on ConversionCategory {
  String get displayName {
    switch (this) {
      case ConversionCategory.length:
        return 'Length';
      case ConversionCategory.weight:
        return 'Weight';
      case ConversionCategory.temperature:
        return 'Temperature';
      case ConversionCategory.volume:
        return 'Volume';
      case ConversionCategory.area:
        return 'Area';
    }
  }

  String get icon {
    switch (this) {
      case ConversionCategory.length:
        return '📏';
      case ConversionCategory.weight:
        return '⚖️';
      case ConversionCategory.temperature:
        return '🌡️';
      case ConversionCategory.volume:
        return '🥤';
      case ConversionCategory.area:
        return '📐';
    }
  }
}

class Unit {
  final String name;
  final String symbol;
  final String fullName;

  const Unit({
    required this.name,
    required this.symbol,
    required this.fullName,
  });
}

class ConversionPair {
  final Unit fromUnit;
  final Unit toUnit;
  final double Function(double) convert;
  final double Function(double) reverseConvert;

  const ConversionPair({
    required this.fromUnit,
    required this.toUnit,
    required this.convert,
    required this.reverseConvert,
  });
}

class ConversionResult {
  final double inputValue;
  final double outputValue;
  final Unit fromUnit;
  final Unit toUnit;
  final DateTime timestamp;
  final ConversionCategory category;

  ConversionResult({
    required this.inputValue,
    required this.outputValue,
    required this.fromUnit,
    required this.toUnit,
    required this.category,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();

  Map<String, dynamic> toJson() {
    return {
      'inputValue': inputValue,
      'outputValue': outputValue,
      'fromUnit': fromUnit.name,
      'fromUnitSymbol': fromUnit.symbol,
      'toUnit': toUnit.name,
      'toUnitSymbol': toUnit.symbol,
      'timestamp': timestamp.millisecondsSinceEpoch,
      'category': category.name,
    };
  }

  factory ConversionResult.fromJson(Map<String, dynamic> json) {
    return ConversionResult(
      inputValue: json['inputValue'].toDouble(),
      outputValue: json['outputValue'].toDouble(),
      fromUnit: Unit(
        name: json['fromUnit'],
        symbol: json['fromUnitSymbol'],
        fullName: json['fromUnit'],
      ),
      toUnit: Unit(
        name: json['toUnit'],
        symbol: json['toUnitSymbol'],
        fullName: json['toUnit'],
      ),
      category: ConversionCategory.values.firstWhere(
        (e) => e.name == json['category'],
      ),
      timestamp: DateTime.fromMillisecondsSinceEpoch(json['timestamp']),
    );
  }
}