import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text, Title, Card, HelperText } from 'react-native-paper';
import { useExpense, Category } from '../context/ExpenseContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AddExpenseScreen() {
  const { addTransaction } = useExpense();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [date, setDate] = useState(new Date());
  const [isExpense, setIsExpense] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Validation states
  const [amountError, setAmountError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const categoryOptions = [
    { value: 'food', label: 'Food', icon: 'food' },
    { value: 'transportation', label: 'Transport', icon: 'car' },
    { value: 'entertainment', label: 'Entertainment', icon: 'movie' },
    { value: 'utilities', label: 'Utilities', icon: 'lightbulb' },
    { value: 'health', label: 'Health', icon: 'medical-bag' },
    { value: 'education', label: 'Education', icon: 'school' },
    { value: 'other', label: 'Other', icon: 'package' },
  ];

  const handleAmountChange = (text: string) => {
    // Allow only numbers and decimal point
    const filteredText = text.replace(/[^0-9.]/g, '');
    setAmount(filteredText);
    setAmountError('');
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    setDescriptionError('');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const validateForm = () => {
    let isValid = true;

    if (!amount || parseFloat(amount) <= 0) {
      setAmountError('Please enter a valid amount');
      isValid = false;
    }

    if (!description.trim()) {
      setDescriptionError('Description is required');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const transaction = {
      amount: parseFloat(amount),
      description: description.trim(),
      category: isExpense ? category : 'income',
      date: date.toISOString(),
      isExpense,
    };

    await addTransaction(transaction);
    
    // Reset form
    setAmount('');
    setDescription('');
    setCategory('food');
    setDate(new Date());
    setIsExpense(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>
            {isExpense ? 'Add Expense' : 'Add Income'}
          </Title>

          <SegmentedButtons
            value={isExpense ? 'expense' : 'income'}
            onValueChange={(value) => setIsExpense(value === 'expense')}
            buttons={[
              {
                value: 'expense',
                label: 'Expense',
                icon: 'cash-minus',
                style: isExpense ? styles.activeSegment : styles.inactiveSegment,
              },
              {
                value: 'income',
                label: 'Income',
                icon: 'cash-plus',
                style: !isExpense ? styles.activeSegment : styles.inactiveSegment,
              },
            ]}
            style={styles.segmentedButtons}
          />

          <TextInput
            label="Amount"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="currency-usd" />}
            error={!!amountError}
          />
          {amountError ? <HelperText type="error">{amountError}</HelperText> : null}

          <TextInput
            label="Description"
            value={description}
            onChangeText={handleDescriptionChange}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="note-text" />}
            error={!!descriptionError}
          />
          {descriptionError ? <HelperText type="error">{descriptionError}</HelperText> : null}

          {isExpense && (
            <View style={styles.categorySection}>
              <Text style={styles.sectionLabel}>Category</Text>
              <View style={styles.categoryGrid}>
                {categoryOptions.map(option => (
                  <Button
                    key={option.value}
                    mode={category === option.value ? 'contained' : 'outlined'}
                    onPress={() => setCategory(option.value as Category)}
                    style={styles.categoryButton}
                    icon={option.icon}
                  >
                    {option.label}
                  </Button>
                ))}
              </View>
            </View>
          )}

          <View style={styles.datePickerContainer}>
            <Text style={styles.sectionLabel}>Date</Text>
            <Button 
              mode="outlined" 
              onPress={showDatepicker} 
              icon="calendar" 
              style={styles.dateButton}
            >
              {date.toLocaleDateString()}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <Button 
            mode="contained" 
            onPress={handleSubmit} 
            style={styles.submitButton}
            icon={isExpense ? 'cash-minus' : 'cash-plus'}
          >
            {isExpense ? 'Add Expense' : 'Add Income'}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  activeSegment: {
    backgroundColor: '#6200ee',
  },
  inactiveSegment: {},
  input: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  categorySection: {
    marginVertical: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    marginBottom: 8,
  },
  datePickerContainer: {
    marginVertical: 8,
  },
  dateButton: {
    marginVertical: 8,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});