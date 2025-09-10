import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Title, Text, Divider, List, useTheme } from 'react-native-paper';
import { useExpense } from '../context/ExpenseContext';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ReportsScreen() {
  const { transactions } = useExpense();
  const theme = useTheme();
  const [weeklyData, setWeeklyData] = useState<{ labels: string[], expenses: number[], income: number[] }>({ 
    labels: [], 
    expenses: [], 
    income: []
  });
  const [categoryData, setCategoryData] = useState<Array<{name: string, amount: number, color: string, legendFontColor: string, legendFontSize: number}>>([]);
  
  const chartColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#2E7D32', '#C62828', '#6A1B9A'
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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

  const prepareWeeklyData = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const labels = [];
    const expenses = new Array(7).fill(0);
    const income = new Array(7).fill(0);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      labels.push(days[i]);

      transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        if (
          transactionDate.getDate() === currentDate.getDate() &&
          transactionDate.getMonth() === currentDate.getMonth() &&
          transactionDate.getFullYear() === currentDate.getFullYear()
        ) {
          if (transaction.isExpense) {
            expenses[i] += transaction.amount;
          } else {
            income[i] += transaction.amount;
          }
        }
      });
    }

    setWeeklyData({ labels, expenses, income });
  };

  const prepareCategoryData = () => {
    const categoryTotals: { [key: string]: number } = {};

    // Only consider expenses for pie chart
    transactions
      .filter(t => t.isExpense)
      .forEach(transaction => {
        const category = transaction.category;
        categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
      });

    const data = Object.keys(categoryTotals).map((category, index) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      amount: categoryTotals[category],
      color: chartColors[index % chartColors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));

    setCategoryData(data);
  };

  useEffect(() => {
    prepareWeeklyData();
    prepareCategoryData();
  }, [transactions]);

  const getScreenWidth = () => {
    return Dimensions.get('window').width - 32; // padding on both sides
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    barPercentage: 0.5,
    decimalPlaces: 0,
  };

  // Calculate total expenses for each category
  const categoryTotals = transactions
    .filter(t => t.isExpense)
    .reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as { [key: string]: number });

  // Sort categories by amount (descending)
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, amountA], [, amountB]) => amountB - amountA)
    .map(([category, amount]) => ({ category, amount }));

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Weekly Summary</Title>
          <Text style={styles.subtitle}>This week's income and expenses</Text>
          
          {weeklyData.labels.length > 0 && (
            <View style={styles.chartContainer}>
              <BarChart
                data={{
                  labels: weeklyData.labels,
                  datasets: [
                    {
                      data: weeklyData.expenses,
                      color: (opacity = 1) => `rgba(198, 40, 40, ${opacity})`,
                    },
                    {
                      data: weeklyData.income,
                      color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
                    },
                  ],
                }}
                width={getScreenWidth()}
                height={220}
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                fromZero
                showBarTops
                showValuesOnTopOfBars
                yAxisLabel="$"
                style={styles.chart}
              />
            </View>
          )}
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#C62828' }]} />
              <Text>Expenses</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#2E7D32' }]} />
              <Text>Income</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Expense Breakdown</Title>
          <Text style={styles.subtitle}>Where your money is going</Text>

          {categoryData.length > 0 ? (
            <View style={styles.chartContainer}>
              <PieChart
                data={categoryData}
                width={getScreenWidth()}
                height={220}
                chartConfig={chartConfig}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          ) : (
            <Text style={styles.noDataText}>No expense data to display</Text>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Top Spending Categories</Title>
          
          {sortedCategories.length > 0 ? (
            <List.Section>
              {sortedCategories.map(({ category, amount }, index) => (
                <List.Item
                  key={category}
                  title={category.charAt(0).toUpperCase() + category.slice(1)}
                  description={formatCurrency(amount)}
                  left={props => <List.Icon {...props} icon={getCategoryIcon(category)} />}
                  right={props => <Text {...props} style={styles.rankText}>#{index + 1}</Text>}
                />
              ))}
            </List.Section>
          ) : (
            <Text style={styles.noDataText}>No expense data available</Text>
          )}
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
    marginBottom: 8,
    elevation: 4,
  },
  chartContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  subtitle: {
    color: '#757575',
    marginTop: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  rankText: {
    fontWeight: 'bold',
  },
  noDataText: {
    marginVertical: 20,
    textAlign: 'center',
    color: '#757575',
  },
});
