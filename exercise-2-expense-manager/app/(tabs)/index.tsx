import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Button, useTheme, Card, IconButton } from 'react-native-paper';
import { SummaryCard } from '../components/SummaryCard';
import { TransactionCard } from '../components/TransactionCard';
import { useEffect, useState } from 'react';
import { Transaction } from '../utils/types';
import { 
  getCurrentWeekTransactions, 
  deleteTransaction 
} from '../utils/storage';
import { router } from 'expo-router';

export default function Dashboard() {
  const theme = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const weeklyTransactions = await getCurrentWeekTransactions();
      // Sort by date, newest first
      weeklyTransactions.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions(weeklyTransactions);
    } catch (error) {
      console.error("Failed to load transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      // Refresh transactions after delete
      loadTransactions();
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  const handleAddTransaction = () => {
    router.push('/add-transaction');
  };

  const handleRefresh = () => {
    loadTransactions();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SummaryCard transactions={transactions} />
      
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          Recent Transactions
        </Text>
        <IconButton
          icon="refresh"
          size={20}
          onPress={handleRefresh}
          iconColor={theme.colors.primary}
        />
      </View>
      
      <ScrollView style={styles.transactionsList}>
        {transactions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No transactions this week
              </Text>
              <Button 
                mode="contained" 
                onPress={handleAddTransaction}
                style={styles.addButton}
              >
                Add Transaction
              </Button>
            </Card.Content>
          </Card>
        ) : (
          transactions.map(transaction => (
            <TransactionCard 
              key={transaction.id} 
              transaction={transaction}
              onDelete={handleDelete} 
            />
          ))
        )}
      </ScrollView>
      
      {transactions.length > 0 && (
        <Button 
          mode="contained" 
          onPress={handleAddTransaction}
          style={styles.floatingButton}
          icon="plus"
        >
          Add Transaction
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  transactionsList: {
    flex: 1,
    marginBottom: 70,
  },
  emptyCard: {
    marginVertical: 20,
    elevation: 2,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    marginBottom: 16,
    opacity: 0.6,
  },
  addButton: {
    marginTop: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    left: 16,
  },
});
