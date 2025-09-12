import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, IconButton, useTheme } from 'react-native-paper';
import { formatDate } from '../utils/storage';
import { Transaction } from '../utils/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface TransactionCardProps {
  transaction: Transaction;
  onDelete?: (id: string) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ 
  transaction, 
  onDelete 
}) => {
  const theme = useTheme();
  const { id, amount, category, description, date, type } = transaction;
  
  const handleEdit = () => {
    router.push({
      pathname: '/edit-transaction',
      params: { id }
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content style={styles.content}>
        <View style={styles.leftSection}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: type === 'income' ? '#d4edda' : '#f8d7da' }
          ]}>
            <Ionicons
              name={type === 'income' ? 'arrow-down' : 'arrow-up'}
              size={20}
              color={type === 'income' ? '#28a745' : '#dc3545'}
            />
          </View>
          <View style={styles.details}>
            <Text variant="titleMedium">{description}</Text>
            <Text variant="bodySmall" style={styles.category}>{category}</Text>
            <Text variant="bodySmall" style={styles.date}>{formatDate(date)}</Text>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <Text 
            variant="titleMedium" 
            style={[
              styles.amount,
              { color: type === 'income' ? '#28a745' : '#dc3545' }
            ]}
          >
            {type === 'income' ? '+' : '-'} ${amount.toFixed(2)}
          </Text>
          
          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              size={18}
              onPress={handleEdit}
              iconColor={theme.colors.primary}
            />
            <IconButton
              icon="trash-bin"
              size={18}
              onPress={handleDelete}
              iconColor={theme.colors.error}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  category: {
    marginTop: 2,
    opacity: 0.7,
  },
  date: {
    marginTop: 2,
    opacity: 0.5,
  },
  amount: {
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 4,
  },
});
