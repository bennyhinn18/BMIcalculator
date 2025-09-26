import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/conversion_models.dart';
import '../utils/conversion_engine.dart';
import '../utils/storage_service.dart';

class ConversionScreen extends StatefulWidget {
  final ConversionCategory category;

  const ConversionScreen({
    super.key,
    required this.category,
  });

  @override
  State<ConversionScreen> createState() => _ConversionScreenState();
}

class _ConversionScreenState extends State<ConversionScreen> {
  final TextEditingController _inputController = TextEditingController();
  final TextEditingController _outputController = TextEditingController();
  
  late List<Unit> _units;
  Unit? _fromUnit;
  Unit? _toUnit;
  bool _isSwapped = false;

  @override
  void initState() {
    super.initState();
    _units = ConversionEngine.getUnitsForCategory(widget.category);
    if (_units.isNotEmpty) {
      _fromUnit = _units.first;
      _toUnit = _units.length > 1 ? _units[1] : _units.first;
    }
    _inputController.addListener(_onInputChanged);
  }

  @override
  void dispose() {
    _inputController.dispose();
    _outputController.dispose();
    super.dispose();
  }

  void _onInputChanged() {
    final input = _inputController.text;
    if (input.isEmpty) {
      _outputController.text = '';
      return;
    }

    final value = double.tryParse(input);
    if (value == null || _fromUnit == null || _toUnit == null) {
      _outputController.text = 'Invalid input';
      return;
    }

    final result = ConversionEngine.convert(
      value,
      _fromUnit!,
      _toUnit!,
      widget.category,
    );

    if (result != null) {
      final formatted = ConversionEngine.formatResult(result);
      _outputController.text = formatted;
      
      // Save to history if conversion is successful
      if (value > 0) {
        final conversionResult = ConversionResult(
          inputValue: value,
          outputValue: result,
          fromUnit: _fromUnit!,
          toUnit: _toUnit!,
          category: widget.category,
        );
        StorageService.saveConversion(conversionResult);
      }
    } else {
      _outputController.text = 'Conversion not available';
    }
  }

  void _swapUnits() {
    setState(() {
      final temp = _fromUnit;
      _fromUnit = _toUnit;
      _toUnit = temp;
      _isSwapped = !_isSwapped;
    });
    _onInputChanged();
  }

  void _clearInputs() {
    _inputController.clear();
    _outputController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.category.displayName} Converter'),
        actions: [
          IconButton(
            icon: const Icon(Icons.clear),
            onPressed: _clearInputs,
            tooltip: 'Clear',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    // From Unit Section
                    Row(
                      children: [
                        Text(
                          '${widget.category.icon} From:',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const Spacer(),
                        DropdownButton<Unit>(
                          value: _fromUnit,
                          onChanged: (Unit? newValue) {
                            setState(() {
                              _fromUnit = newValue;
                            });
                            _onInputChanged();
                          },
                          items: _units.map<DropdownMenuItem<Unit>>((Unit unit) {
                            return DropdownMenuItem<Unit>(
                              value: unit,
                              child: Text('${unit.name} (${unit.symbol})'),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _inputController,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      inputFormatters: [
                        FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d*')),
                      ],
                      decoration: InputDecoration(
                        hintText: 'Enter value to convert',
                        suffixText: _fromUnit?.symbol,
                      ),
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Swap Button
                    Center(
                      child: IconButton(
                        onPressed: _swapUnits,
                        icon: const Icon(Icons.swap_vert),
                        iconSize: 32,
                        color: Colors.blue,
                        tooltip: 'Swap units',
                      ),
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // To Unit Section
                    Row(
                      children: [
                        const Text(
                          '📏 To:',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const Spacer(),
                        DropdownButton<Unit>(
                          value: _toUnit,
                          onChanged: (Unit? newValue) {
                            setState(() {
                              _toUnit = newValue;
                            });
                            _onInputChanged();
                          },
                          items: _units.map<DropdownMenuItem<Unit>>((Unit unit) {
                            return DropdownMenuItem<Unit>(
                              value: unit,
                              child: Text('${unit.name} (${unit.symbol})'),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: _outputController,
                      readOnly: true,
                      decoration: InputDecoration(
                        hintText: 'Conversion result',
                        suffixText: _toUnit?.symbol,
                        filled: true,
                        fillColor: Colors.grey[100],
                      ),
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Colors.blue,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Quick Conversions
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Quick Conversions',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8.0,
                      runSpacing: 8.0,
                      children: _getQuickConversions(),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _getQuickConversions() {
    final quickValues = [1, 5, 10, 25, 50, 100];
    
    return quickValues.map((value) {
      return ElevatedButton(
        onPressed: () {
          _inputController.text = value.toString();
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.grey[200],
          foregroundColor: Colors.black87,
          elevation: 1,
        ),
        child: Text(value.toString()),
      );
    }).toList();
  }
}