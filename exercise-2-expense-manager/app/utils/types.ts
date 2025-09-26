// Types for transactions
export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

// Types for categories
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense';
}

// Default categories
export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', color: '#FF6B6B', icon: 'fast-food', type: 'expense' },
  { id: '2', name: 'Transportation', color: '#4ECDC4', icon: 'car', type: 'expense' },
  { id: '3', name: 'Housing', color: '#FFA5A5', icon: 'home', type: 'expense' },
  { id: '4', name: 'Entertainment', color: '#C5A3FF', icon: 'film', type: 'expense' },
  { id: '5', name: 'Shopping', color: '#FFD166', icon: 'cart', type: 'expense' },
  { id: '6', name: 'Utilities', color: '#73D2DE', icon: 'flash', type: 'expense' },
  { id: '7', name: 'Health', color: '#95D5B2', icon: 'medkit', type: 'expense' },
  { id: '8', name: 'Education', color: '#C1B98F', icon: 'school', type: 'expense' },
  { id: '9', name: 'Other', color: '#BDB2FF', icon: 'ellipsis-horizontal', type: 'expense' },
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: '10', name: 'Salary', color: '#52B788', icon: 'cash', type: 'income' },
  { id: '11', name: 'Freelance', color: '#2D6A4F', icon: 'laptop', type: 'income' },
  { id: '12', name: 'Gifts', color: '#B5E48C', icon: 'gift', type: 'income' },
  { id: '13', name: 'Investments', color: '#76C893', icon: 'trending-up', type: 'income' },
  { id: '14', name: 'Other', color: '#99D98C', icon: 'ellipsis-horizontal', type: 'income' },
];
