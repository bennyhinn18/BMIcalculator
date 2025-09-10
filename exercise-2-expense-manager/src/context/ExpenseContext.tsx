import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Category = 'food' | 'transportation' | 'entertainment' | 'utilities' | 'health' | 'education' | 'other' | 'income';

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
  isExpense: boolean;
}

interface ExpenseContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getWeeklyData: () => { labels: string[], expenses: number[], income: number[] };
  getCategoryData: () => { categoryLabels: string[], categoryAmounts: number[] };
  getTotalBalance: () => number;
  getTotalIncome: () => number;
  getTotalExpense: () => number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from AsyncStorage on mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@expense_manager_transactions');
        if (jsonValue != null) {
          setTransactions(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error('Failed to load transactions', e);
      }
    };

    loadTransactions();
  }, []);

  // Save transactions to AsyncStorage whenever they change
  useEffect(() => {
    const saveTransactions = async () => {
      try {
        const jsonValue = JSON.stringify(transactions);
        await AsyncStorage.setItem('@expense_manager_transactions', jsonValue);
      } catch (e) {
        console.error('Failed to save transactions', e);
      }
    };

    if (transactions.length > 0) {
      saveTransactions();
    }
  }, [transactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const deleteTransaction = async (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const getTotalBalance = () => {
    return transactions.reduce((acc, transaction) => {
      return transaction.isExpense 
        ? acc - transaction.amount 
        : acc + transaction.amount;
    }, 0);
  };

  const getTotalIncome = () => {
    return transactions
      .filter(transaction => !transaction.isExpense)
      .reduce((acc, transaction) => acc + transaction.amount, 0);
  };

  const getTotalExpense = () => {
    return transactions
      .filter(transaction => transaction.isExpense)
      .reduce((acc, transaction) => acc + transaction.amount, 0);
  };

  const getWeeklyData = () => {
    // Get dates for last 7 days
    const dates = [];
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
      
      // Format as short day name (Mon, Tue, etc.)
      const shortDay = date.toLocaleDateString('en-US', { weekday: 'short' });
      labels.push(shortDay);
    }

    // Calculate expenses and income for each day
    const expenses = dates.map(date => {
      return transactions
        .filter(t => t.isExpense && t.date.startsWith(date))
        .reduce((sum, t) => sum + t.amount, 0);
    });

    const income = dates.map(date => {
      return transactions
        .filter(t => !t.isExpense && t.date.startsWith(date))
        .reduce((sum, t) => sum + t.amount, 0);
    });

    return { labels, expenses, income };
  };

  const getCategoryData = () => {
    // Get expense totals by category
    const categories: Category[] = ['food', 'transportation', 'entertainment', 'utilities', 'health', 'education', 'other'];
    
    const categoryLabels = categories.map(cat => 
      cat.charAt(0).toUpperCase() + cat.slice(1)
    );
    
    const categoryAmounts = categories.map(category => {
      return transactions
        .filter(t => t.isExpense && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
    });

    return { categoryLabels, categoryAmounts };
  };

  return (
    <ExpenseContext.Provider 
      value={{ 
        transactions, 
        addTransaction, 
        deleteTransaction,
        getWeeklyData,
        getCategoryData,
        getTotalBalance,
        getTotalIncome,
        getTotalExpense
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};