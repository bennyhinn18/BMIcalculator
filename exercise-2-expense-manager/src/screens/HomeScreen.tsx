import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Title, Text, Card, DataTable, Divider, useTheme } from 'react-native-paper';
import { useExpense } from '../context/ExpenseContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { transactions, getTotalBalance, getTotalIncome, getTotalExpense } = useExpense();
  const theme = useTheme();

  // Get most recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return 'food';
      case 'transportation': return 'car';
      case 'entertainment': return 'movie';
      case 'utilities': return 'lightbulb';
      case 'health': return 'medical-bag';
      case 'education': return 'school';
      case 'income': return 'cash-plus';
      default: return 'package';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryContainer}>
        <Card style={styles.balanceCard}>
          <Card.Content>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Title style={styles.balanceAmount}>{formatCurrency(getTotalBalance())}</Title>
          </Card.Content>
        </Card>

        <View style={styles.statsRow}>
          <Card style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <Card.Content>
              <View style={styles.statHeader}>
                <MaterialCommunityIcons name="cash-plus" size={20} color="#2E7D32" />
                <Text style={styles.statLabel}>Income</Text>
              </View>
              <Title style={[styles.statAmount, { color: '#2E7D32' }]}>
                {formatCurrency(getTotalIncome())}
              </Title>
            </Card.Content>
          </Card>

          <Card style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}>
            <Card.Content>
              <View style={styles.statHeader}>
                <MaterialCommunityIcons name="cash-minus" size={20} color="#C62828" />
                <Text style={styles.statLabel}>Expenses</Text>
              </View>
              <Title style={[styles.statAmount, { color: '#C62828' }]}> 
                {formatCurrency(getTotalExpense())}
              </Title>
            </Card.Content>
          </Card>
        </View>
      </View>

      <Divider />

      <Card style={styles.recentTransactionsCard}>
        <Card.Title title="Recent Transactions" />
        <Card.Content>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Description</DataTable.Title>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title numeric>Amount</DataTable.Title>
            </DataTable.Header>

            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <DataTable.Row key={transaction.id}>
                  <DataTable.Cell>
                    <View style={styles.categoryRow}>
                      <MaterialCommunityIcons 
                        name={getCategoryIcon(transaction.category)} 
                        size={16} 
                        color={theme.colors.primary} 
                        style={styles.categoryIcon}
                      />
                      <Text>{transaction.description}</Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell>{formatDate(transaction.date)}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={{ 
                      color: transaction.isExpense ? '#C62828' : '#2E7D32'
                    }}>
                      {transaction.isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <DataTable.Row>
                <DataTable.Cell>No transactions yet</DataTable.Cell>
                <DataTable.Cell></DataTable.Cell>
                <DataTable.Cell></DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable>
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
  summaryContainer: {
    padding: 16,
  },
  balanceCard: {
    marginBottom: 16,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#757575',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    marginLeft: 6,
    fontSize: 14,
    color: '#757575',
  },
  statAmount: {
    fontSize: 20,
  },
  recentTransactionsCard: {
    margin: 16,
    elevation: 2,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    marginRight: 6,
  },
});