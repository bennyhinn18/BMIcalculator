import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, useTheme, Button } from 'react-native-paper';
import { 
  getTransactions, 
  getTransactionsByDateRange, 
  getCategorySummary,
  calculateTotalExpenses,
  calculateTotalIncome,
  getCategories
} from '../utils/storage';
import { Transaction, Category } from '../utils/types';
import { 
  startOfWeek, 
  endOfWeek, 
  format, 
  subWeeks, 
  addWeeks 
} from 'date-fns';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Reports() {
  const theme = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [weekEnd, setWeekEnd] = useState(endOfWeek(new Date()));
  const [loading, setLoading] = useState(true);
  
  const screenWidth = Dimensions.get('window').width - 32; // Account for padding
  
  useEffect(() => {
    loadData();
  }, [weekStart, weekEnd]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const weeklyTransactions = await getTransactionsByDateRange(weekStart, weekEnd);
      const allCategories = await getCategories();
      
      setTransactions(weeklyTransactions);
      setCategories(allCategories);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };
  
  const previousWeek = () => {
    setWeekStart(subWeeks(weekStart, 1));
    setWeekEnd(subWeeks(weekEnd, 1));
  };
  
  const nextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1));
    setWeekEnd(addWeeks(weekEnd, 1));
  };
  
  const currentWeek = () => {
    setWeekStart(startOfWeek(new Date()));
    setWeekEnd(endOfWeek(new Date()));
  };
  
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#999999';
  };
  
  const expensesByCategory = getCategorySummary(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const totalIncome = calculateTotalIncome(transactions);
  
  const pieChartData = Object.entries(expensesByCategory).map(([name, amount]) => ({
    name,
    amount,
    color: getCategoryColor(name),
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));
  
  // Extract daily totals for line chart
  const dailyData = () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = addWeeks(weekStart, 0);
      day.setDate(weekStart.getDate() + i);
      return {
        date: day,
        dayString: format(day, 'EEE'),
        expenses: 0,
        income: 0,
      };
    });
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const dayIndex = Math.floor((date.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000));
      
      if (dayIndex >= 0 && dayIndex < 7) {
        if (transaction.type === 'expense') {
          days[dayIndex].expenses += transaction.amount;
        } else {
          days[dayIndex].income += transaction.amount;
        }
      }
    });
    
    return days;
  };
  
  const chartData = {
    labels: dailyData().map(d => d.dayString),
    datasets: [
      {
        data: dailyData().map(d => d.expenses),
        color: () => 'rgba(220, 53, 69, 0.8)',
        strokeWidth: 2,
      },
      {
        data: dailyData().map(d => d.income),
        color: () => 'rgba(40, 167, 69, 0.8)',
        strokeWidth: 2,
      },
    ],
    legend: ["Expenses", "Income"]
  };
  
  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '1',
    },
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card style={styles.weekSelector}>
          <Card.Content style={styles.weekSelectorContent}>
            <Button onPress={previousWeek} mode="text">
              <Ionicons name="chevron-back" size={18} />
            </Button>
            <Text variant="titleMedium">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </Text>
            <Button onPress={nextWeek} mode="text">
              <Ionicons name="chevron-forward" size={18} />
            </Button>
          </Card.Content>
          <Card.Actions style={styles.weekSelectorActions}>
            <Button onPress={currentWeek} mode="outlined">
              Current Week
            </Button>
          </Card.Actions>
        </Card>
        
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>Weekly Summary</Text>
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge">Income:</Text>
              <Text 
                variant="bodyLarge" 
                style={{ color: '#28a745', fontWeight: 'bold' }}
              >
                ${totalIncome.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge">Expenses:</Text>
              <Text 
                variant="bodyLarge" 
                style={{ color: '#dc3545', fontWeight: 'bold' }}
              >
                ${totalExpenses.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge">Balance:</Text>
              <Text 
                variant="bodyLarge" 
                style={{ 
                  color: totalIncome - totalExpenses >= 0 ? '#28a745' : '#dc3545',
                  fontWeight: 'bold' 
                }}
              >
                ${(totalIncome - totalExpenses).toFixed(2)}
              </Text>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>Daily Transactions</Text>
            {transactions.length > 0 ? (
              <LineChart
                data={chartData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Text variant="bodyMedium" style={styles.noDataText}>No data for this period</Text>
              </View>
            )}
          </Card.Content>
        </Card>
        
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>Expenses by Category</Text>
            {Object.keys(expensesByCategory).length > 0 ? (
              <PieChart
                data={pieChartData}
                width={screenWidth - 40}
                height={200}
                chartConfig={chartConfig}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="10"
                center={[10, 0]}
                absolute
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Text variant="bodyMedium" style={styles.noDataText}>No expense data for this period</Text>
              </View>
            )}
          </Card.Content>
        </Card>
        
        <Card style={[styles.chartCard, { marginBottom: 40 }]}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>Expense Breakdown</Text>
            {Object.keys(expensesByCategory).length > 0 ? (
              Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a) // Sort by amount, descending
                .map(([category, amount]) => (
                  <View key={category} style={styles.categoryRow}>
                    <View style={styles.categoryInfo}>
                      <View 
                        style={[
                          styles.colorIndicator, 
                          { backgroundColor: getCategoryColor(category) }
                        ]} 
                      />
                      <Text variant="bodyMedium">{category}</Text>
                    </View>
                    <View style={styles.amountContainer}>
                      <Text variant="bodyMedium">${amount.toFixed(2)}</Text>
                      <Text variant="bodySmall" style={styles.percentage}>
                        {((amount / totalExpenses) * 100).toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                ))
            ) : (
              <View style={styles.noDataContainer}>
                <Text variant="bodyMedium" style={styles.noDataText}>No expenses for this period</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  weekSelector: {
    marginBottom: 16,
  },
  weekSelectorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekSelectorActions: {
    justifyContent: 'center',
  },
  summaryCard: {
    marginBottom: 16,
  },
  chartCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    opacity: 0.5,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  percentage: {
    opacity: 0.6,
    marginTop: 2,
  },
});
