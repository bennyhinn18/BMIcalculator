import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Text, FAB, Avatar, useTheme, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useExpense } from '../context/ExpenseContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { transactions } = useExpense();
  const theme = useTheme();

  // Calculate balance, income and expenses
  const calculateFinancials = () => {
    let totalBalance = 0;
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(transaction => {
      if (transaction.isExpense) {
        totalExpenses += transaction.amount;
        totalBalance -= transaction.amount;
      } else {
        totalIncome += transaction.amount;
        totalBalance += transaction.amount;
      }
    });

    return { totalBalance, totalIncome, totalExpenses };
  };

  const { totalBalance, totalIncome, totalExpenses } = calculateFinancials();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

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

  // Get color for category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food': return '#FF6B6B';
      case 'transportation': return '#48CFAD';
      case 'entertainment': return '#AC92EB';
      case 'utilities': return '#4FC1E8';
      case 'health': return '#EC87C0';
      case 'education': return '#5D9CEC';
      case 'income': return '#A0D568';
      default: return '#FFCE54';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Balance Overview */}
        <Card style={styles.balanceCard}>
          <Card.Content>
            <Text style={styles.balanceTitle}>Current Balance</Text>
            <Title style={[
              styles.balanceAmount,
              { color: totalBalance >= 0 ? '#2E7D32' : '#C62828' }
            ]}>
              {formatCurrency(totalBalance)}
            </Title>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Income</Text>
                <Text style={[styles.summaryAmount, { color: '#2E7D32' }]}>  
                  {formatCurrency(totalIncome)}
                </Text>
              </View>
              <View style={styles.divider}></View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Expenses</Text>
                <Text style={[styles.summaryAmount, { color: '#C62828' }]}>  
                  {formatCurrency(totalExpenses)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => navigation.navigate('AddExpense' as never)}
              >
                <Avatar.Icon 
                  size={50} 
                  icon="cash-minus" 
                  style={{ backgroundColor: '#C62828' }} 
                />
                <Text style={styles.actionText}>Add Expense</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => navigation.navigate('AddExpense' as never, { isIncome: true } as never)}
              >
                <Avatar.Icon 
                  size={50} 
                  icon="cash-plus" 
                  style={{ backgroundColor: '#2E7D32' }} 
                />
                <Text style={styles.actionText}>Add Income</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => navigation.navigate('Reports' as never)}
              >
                <Avatar.Icon 
                  size={50} 
                  icon="chart-box" 
                  style={{ backgroundColor: '#1976D2' }} 
                />
                <Text style={styles.actionText}>View Reports</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Transactions */}
        <Card style={styles.transactionsCard}>
          <Card.Content>
            <View style={styles.transactionsHeader}>
              <Title style={styles.sectionTitle}>Recent Transactions</Title>
              <TouchableOpacity onPress={() => navigation.navigate('Transactions' as never)}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {recentTransactions.length === 0 ? (
              <Paragraph style={styles.emptyState}>
                No transactions yet. Add your first transaction by clicking the + button below.
              </Paragraph>
            ) : (
              recentTransactions.map((transaction, index) => (
                <React.Fragment key={transaction.id}>
                  <TouchableOpacity 
                    style={styles.transaction}
                  >
                    <Avatar.Icon 
                      size={40} 
                      icon={getCategoryIcon(transaction.category)}
                      style={{ backgroundColor: getCategoryColor(transaction.category) }}
                    />
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionTitle}>{transaction.description}</Text>
                      <Text style={styles.transactionCategory}>
                        {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)} • {formatDate(transaction.date)}
                      </Text>
                    </View>
                    <Text style={[
                      styles.transactionAmount,
                      { color: transaction.isExpense ? '#C62828' : '#2E7D32' }
                    ]}>
                      {transaction.isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </Text>
                  </TouchableOpacity>
                  {index < recentTransactions.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('AddExpense' as never)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  balanceCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 4,
  },
  balanceTitle: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  actionsCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
  },
  transactionsCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    elevation: 4,
    marginBottom: 80, // Add extra margin at the bottom for FAB
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewAll: {
    color: '#6200EE',
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 16,
  },
  transactionTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#757575',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center',
    marginVertical: 24,
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
