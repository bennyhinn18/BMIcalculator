import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { Transaction } from '../utils/types';
import { 
  calculateTotalIncome, 
  calculateTotalExpenses, 
  calculateBalance 
} from '../utils/storage';

interface SummaryCardProps {
  transactions: Transaction[];
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ transactions }) => {
  const theme = useTheme();
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const balance = calculateBalance(transactions);
  
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" style={styles.title}>Weekly Summary</Text>
        
        <Card style={[styles.miniCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content>
            <Text variant="labelMedium" style={styles.label}>Income</Text>
            <Text variant="titleLarge" style={styles.income}>
              ${totalIncome.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>
        
        <Card style={[styles.miniCard, { backgroundColor: theme.colors.errorContainer }]}>
          <Card.Content>
            <Text variant="labelMedium" style={styles.label}>Expenses</Text>
            <Text variant="titleLarge" style={styles.expense}>
              ${totalExpenses.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>
        
        <Card style={[styles.miniCard, { backgroundColor: theme.colors.secondaryContainer }]}>
          <Card.Content>
            <Text variant="labelMedium" style={styles.label}>Balance</Text>
            <Text variant="titleLarge" style={{
              color: balance >= 0 ? '#28a745' : '#dc3545',
              fontWeight: 'bold',
            }}>
              ${balance.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    elevation: 4,
  },
  content: {
    paddingVertical: 10,
  },
  title: {
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  miniCard: {
    marginBottom: 10,
    elevation: 2,
  },
  label: {
    marginBottom: 5,
    opacity: 0.7,
  },
  income: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  expense: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
});
