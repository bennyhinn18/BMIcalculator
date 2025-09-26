import '../models/conversion_models.dart';

class ConversionEngine {
  // Length Units
  static const Unit kilometers = Unit(name: 'Kilometers', symbol: 'km', fullName: 'Kilometers');
  static const Unit miles = Unit(name: 'Miles', symbol: 'mi', fullName: 'Miles');
  static const Unit meters = Unit(name: 'Meters', symbol: 'm', fullName: 'Meters');
  static const Unit feet = Unit(name: 'Feet', symbol: 'ft', fullName: 'Feet');
  static const Unit centimeters = Unit(name: 'Centimeters', symbol: 'cm', fullName: 'Centimeters');
  static const Unit inches = Unit(name: 'Inches', symbol: 'in', fullName: 'Inches');

  // Weight Units
  static const Unit kilograms = Unit(name: 'Kilograms', symbol: 'kg', fullName: 'Kilograms');
  static const Unit pounds = Unit(name: 'Pounds', symbol: 'lbs', fullName: 'Pounds');
  static const Unit grams = Unit(name: 'Grams', symbol: 'g', fullName: 'Grams');
  static const Unit ounces = Unit(name: 'Ounces', symbol: 'oz', fullName: 'Ounces');

  // Temperature Units
  static const Unit celsius = Unit(name: 'Celsius', symbol: '°C', fullName: 'Celsius');
  static const Unit fahrenheit = Unit(name: 'Fahrenheit', symbol: '°F', fullName: 'Fahrenheit');
  static const Unit kelvin = Unit(name: 'Kelvin', symbol: 'K', fullName: 'Kelvin');

  // Volume Units
  static const Unit liters = Unit(name: 'Liters', symbol: 'L', fullName: 'Liters');
  static const Unit gallons = Unit(name: 'Gallons', symbol: 'gal', fullName: 'Gallons');
  static const Unit milliliters = Unit(name: 'Milliliters', symbol: 'mL', fullName: 'Milliliters');
  static const Unit fluidOunces = Unit(name: 'Fluid Ounces', symbol: 'fl oz', fullName: 'Fluid Ounces');

  // Area Units
  static const Unit squareMeters = Unit(name: 'Square Meters', symbol: 'm²', fullName: 'Square Meters');
  static const Unit squareFeet = Unit(name: 'Square Feet', symbol: 'ft²', fullName: 'Square Feet');
  static const Unit hectares = Unit(name: 'Hectares', symbol: 'ha', fullName: 'Hectares');
  static const Unit acres = Unit(name: 'Acres', symbol: 'ac', fullName: 'Acres');

  static Map<ConversionCategory, List<ConversionPair>> get conversions {
    return {
      ConversionCategory.length: [
        ConversionPair(
          fromUnit: kilometers,
          toUnit: miles,
          convert: (km) => km * 0.621371,
          reverseConvert: (miles) => miles / 0.621371,
        ),
        ConversionPair(
          fromUnit: meters,
          toUnit: feet,
          convert: (m) => m * 3.28084,
          reverseConvert: (ft) => ft / 3.28084,
        ),
        ConversionPair(
          fromUnit: centimeters,
          toUnit: inches,
          convert: (cm) => cm * 0.393701,
          reverseConvert: (inches) => inches / 0.393701,
        ),
      ],
      ConversionCategory.weight: [
        ConversionPair(
          fromUnit: kilograms,
          toUnit: pounds,
          convert: (kg) => kg * 2.20462,
          reverseConvert: (lbs) => lbs / 2.20462,
        ),
        ConversionPair(
          fromUnit: grams,
          toUnit: ounces,
          convert: (g) => g * 0.035274,
          reverseConvert: (oz) => oz / 0.035274,
        ),
      ],
      ConversionCategory.temperature: [
        ConversionPair(
          fromUnit: celsius,
          toUnit: fahrenheit,
          convert: (c) => (c * 9/5) + 32,
          reverseConvert: (f) => (f - 32) * 5/9,
        ),
        ConversionPair(
          fromUnit: celsius,
          toUnit: kelvin,
          convert: (c) => c + 273.15,
          reverseConvert: (k) => k - 273.15,
        ),
        ConversionPair(
          fromUnit: fahrenheit,
          toUnit: kelvin,
          convert: (f) => (f - 32) * 5/9 + 273.15,
          reverseConvert: (k) => (k - 273.15) * 9/5 + 32,
        ),
      ],
      ConversionCategory.volume: [
        ConversionPair(
          fromUnit: liters,
          toUnit: gallons,
          convert: (l) => l * 0.264172,
          reverseConvert: (gal) => gal / 0.264172,
        ),
        ConversionPair(
          fromUnit: milliliters,
          toUnit: fluidOunces,
          convert: (ml) => ml * 0.033814,
          reverseConvert: (flOz) => flOz / 0.033814,
        ),
      ],
      ConversionCategory.area: [
        ConversionPair(
          fromUnit: squareMeters,
          toUnit: squareFeet,
          convert: (sqm) => sqm * 10.7639,
          reverseConvert: (sqft) => sqft / 10.7639,
        ),
        ConversionPair(
          fromUnit: hectares,
          toUnit: acres,
          convert: (ha) => ha * 2.47105,
          reverseConvert: (ac) => ac / 2.47105,
        ),
      ],
    };
  }

  static List<Unit> getUnitsForCategory(ConversionCategory category) {
    final pairs = conversions[category] ?? [];
    final units = <Unit>{};
    
    for (final pair in pairs) {
      units.add(pair.fromUnit);
      units.add(pair.toUnit);
    }
    
    return units.toList();
  }

  static double? convert(
    double value,
    Unit fromUnit,
    Unit toUnit,
    ConversionCategory category,
  ) {
    if (fromUnit.name == toUnit.name) return value;
    
    final pairs = conversions[category] ?? [];
    
    // Direct conversion
    for (final pair in pairs) {
      if (pair.fromUnit.name == fromUnit.name && pair.toUnit.name == toUnit.name) {
        return pair.convert(value);
      }
      if (pair.fromUnit.name == toUnit.name && pair.toUnit.name == fromUnit.name) {
        return pair.reverseConvert(value);
      }
    }
    
    return null;
  }

  static String formatResult(double value, {int precision = 4}) {
    if (value == value.roundToDouble() && value < 1000000) {
      return value.toInt().toString();
    }
    
    String formatted = value.toStringAsFixed(precision);
    formatted = formatted.replaceAll(RegExp(r'0*$'), '');
    formatted = formatted.replaceAll(RegExp(r'\.$'), '');
    
    return formatted;
  }
}