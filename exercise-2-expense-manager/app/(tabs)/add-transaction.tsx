import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  useTheme, 
  SegmentedButtons,
  Card,
  HelperText,
  Divider
} from 'react-native-paper';
import { addTransaction } from '../utils/storage';
import { Category } from '../utils/types';
import { getCategoriesByType } from '../utils/storage';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

export default function AddTransaction() {
  const theme = useTheme();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({
    amount: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    loadCategories();
  }, [type]);

  const loadCategories = async () => {
    try {
      const fetchedCategories = await getCategoriesByType(type);
      setCategories(fetchedCategories);
      // Set default category if available
      if (fetchedCategories.length > 0 && !category) {
        setCategory(fetchedCategories[0].name);
      } else if (fetchedCategories.length > 0) {
        // Check if current category exists in new type
        const categoryExists = fetchedCategories.some(c => c.name === category);
        if (!categoryExists) {
          setCategory(fetchedCategories[0].name);
        }
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      amount: '',
      description: '',
      category: ''
    };
    
    let isValid = true;
    
    // Validate amount
    if (!amount) {
      newErrors.amount = 'Amount is required';
      isValid = false;
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
      isValid = false;
    }
    
    // Validate description
    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    
    // Validate category
    if (!category) {
      newErrors.category = 'Category is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      await addTransaction({
        amount: Number(amount),
        description,
        category,
        date: date.toISOString(),
        type
      });
      
      // Navigate back
      router.back();
    } catch (error) {
      console.error("Failed to add transaction", error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Add New Transaction
        </Text>
        
        <SegmentedButtons
          value={type}
          onValueChange={(value) => setType(value as 'income' | 'expense')}
          buttons={[
            { value: 'expense', label: 'Expense' },
            { value: 'income', label: 'Income' },
          ]}
          style={styles.segmentedButtons}
        />
        
        <TextInput
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          mode="outlined"
          left={<TextInput.Icon icon="currency-usd" />}
          style={styles.input}
          error={!!errors.amount}
        />
        {!!errors.amount && (
          <HelperText type="error">{errors.amount}</HelperText>
        )}
        
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          left={<TextInput.Icon icon="text" />}
          style={styles.input}
          error={!!errors.description}
        />
        {!!errors.description && (
          <HelperText type="error">{errors.description}</HelperText>
        )}
        
        <View style={styles.dateContainer}>
          <Text variant="bodyLarge">Date:</Text>
          <Button 
            mode="outlined" 
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            {format(date, 'MMM d, yyyy')}
          </Button>
        </View>
        
        {showDatePicker && Platform.OS === 'web' ? (
          // Web fallback: use native HTML date input which works in browsers
          <View style={{ marginTop: 8 }}>
            <input
              type="date"
              value={format(date, 'yyyy-MM-dd')}
              onChange={(e: any) => {
                // close picker and set date from input (assume local date)
                setShowDatePicker(false);
                const selected = e?.target?.value
                  ? new Date(e.target.value + 'T00:00:00')
                  : date;
                setDate(selected);
              }}
              style={{
                padding: 8,
                fontSize: 16,
                borderRadius: 4,
                borderColor: '#ccc',
                borderWidth: 1,
                width: '100%'
              }}
            />
          </View>
        ) : (
          showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )
        )}
        
        <Text variant="bodyLarge" style={styles.categoryLabel}>Category:</Text>
        {!!errors.category && (
          <HelperText type="error">{errors.category}</HelperText>
        )}
        
        <View style={styles.categoriesContainer}>
          {categories.map((cat) => (
            <Card
              key={cat.id}
              style={[
                styles.categoryCard,
                category === cat.name && { 
                  backgroundColor: theme.colors.primaryContainer,
                  borderColor: theme.colors.primary,
                  borderWidth: 2
                }
              ]}
              onPress={() => setCategory(cat.name)}
            >
              <Card.Content style={styles.categoryContent}>
                <Text variant="bodyLarge">{cat.name}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.buttonsContainer}>
          <Button 
            mode="outlined" 
            onPress={handleCancel} 
            style={[styles.button, styles.cancelButton]}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSubmit} 
            style={styles.button}
          >
            Save
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dateButton: {
    marginLeft: 16,
    flex: 1,
  },
  categoryLabel: {
    marginVertical: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryCard: {
    margin: 4,
    minWidth: 100,
  },
  categoryContent: {
    padding: 8,
  },
  divider: {
    marginVertical: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  button: {
    flex: 1,
    margin: 8,
  },
  cancelButton: {
    borderColor: 'grey',
  },
});
