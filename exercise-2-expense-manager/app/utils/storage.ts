import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Category, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from './types';
import { format, startOfWeek, endOfWeek, parseISO } from 'date-fns';

// Storage keys
const TRANSACTIONS_STORAGE_KEY = 'expense_manager_transactions';
const CATEGORIES_STORAGE_KEY = 'expense_manager_categories';

// Save transactions to AsyncStorage
export const saveTransactions = async (transactions: Transaction[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions', error);
    throw error;
  }
};

// Get all transactions from AsyncStorage
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const data = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting transactions', error);
    return [];
  }
};

// Add a new transaction
export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  try {
    const transactions = await getTransactions();
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    await saveTransactions([...transactions, newTransaction]);
    return newTransaction;
  } catch (error) {
    console.error('Error adding transaction', error);
    throw error;
  }
};

// Delete a transaction
export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const transactions = await getTransactions();
    const updatedTransactions = transactions.filter(t => t.id !== id);
    await saveTransactions(updatedTransactions);
  } catch (error) {
    console.error('Error deleting transaction', error);
    throw error;
  }
};

// Update a transaction
export const updateTransaction = async (updatedTransaction: Transaction): Promise<Transaction> => {
  try {
    const transactions = await getTransactions();
    const updatedTransactions = transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    await saveTransactions(updatedTransactions);
    return updatedTransaction;
  } catch (error) {
    console.error('Error updating transaction', error);
    throw error;
  }
};

// Get transactions for a specific date range
export const getTransactionsByDateRange = async (startDate: Date, endDate: Date): Promise<Transaction[]> => {
  try {
    const transactions = await getTransactions();
    return transactions.filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  } catch (error) {
    console.error('Error getting transactions by date range', error);
    return [];
  }
};

// Get current week's transactions
export const getCurrentWeekTransactions = async (): Promise<Transaction[]> => {
  const today = new Date();
  const start = startOfWeek(today);
  const end = endOfWeek(today);
  return getTransactionsByDateRange(start, end);
};

// Calculate total income for a list of transactions
export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

// Calculate total expenses for a list of transactions
export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

// Calculate balance (income - expenses)
export const calculateBalance = (transactions: Transaction[]): number => {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
};

// Get summary by category
export const getCategorySummary = (transactions: Transaction[]): Record<string, number> => {
  return transactions.reduce((summary: Record<string, number>, transaction) => {
    const { category, amount, type } = transaction;
    if (!summary[category]) {
      summary[category] = 0;
    }
    summary[category] += type === 'expense' ? amount : 0;
    return summary;
  }, {});
};

// Save categories to AsyncStorage
export const saveCategories = async (categories: Category[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories', error);
    throw error;
  }
};

// Get all categories from AsyncStorage, or return default categories if none exist
export const getCategories = async (): Promise<Category[]> => {
  try {
    const data = await AsyncStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    } else {
      // Initialize with default categories
      const defaultCategories = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];
      await saveCategories(defaultCategories);
      return defaultCategories;
    }
  } catch (error) {
    console.error('Error getting categories', error);
    return [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];
  }
};

// Add a new category
export const addCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  try {
    const categories = await getCategories();
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    };
    
    await saveCategories([...categories, newCategory]);
    return newCategory;
  } catch (error) {
    console.error('Error adding category', error);
    throw error;
  }
};

// Format date string to display format
export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy');
};

// Get categories by type (expense or income)
export const getCategoriesByType = async (type: 'expense' | 'income'): Promise<Category[]> => {
  const categories = await getCategories();
  return categories.filter(category => category.type === type);
};
