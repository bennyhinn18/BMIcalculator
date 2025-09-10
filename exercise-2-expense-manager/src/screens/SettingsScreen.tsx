import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Switch, Divider, Button, Dialog, Portal, TextInput, Title, Card } from 'react-native-paper';
import { useExpense } from '../context/ExpenseContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { clearAllTransactions } = useExpense();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showCurrencyDialog, setShowCurrencyDialog] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [backupEmail, setBackupEmail] = useState('');
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  
  const toggleDarkMode = () => {
    // In a real app, this would update a theme context
    setDarkMode(!darkMode);
  };
  
  const toggleNotifications = () => {
    // In a real app, this would update notification settings
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  const handleClearData = () => {
    setShowResetDialog(false);
    // Show a confirmation dialog
    Alert.alert(
      'Confirm Reset',
      'Are you sure you want to clear all transaction data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: () => {
            clearAllTransactions();
            Alert.alert('Data Cleared', 'All transaction data has been reset.');
          }
        },
      ]
    );
  };

  const handleBackup = () => {
    // In a real app, this would initiate a backup process to the provided email
    setShowBackupDialog(false);
    Alert.alert(
      'Backup Initiated',
      `A backup of your expense data will be sent to ${backupEmail}.`
    );
  };

  const handleCurrencyChange = () => {
    // In a real app, this would update currency settings
    setShowCurrencyDialog(false);
    Alert.alert('Currency Updated', `Currency has been updated to ${currency}.`);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Appearance</Title>
          <List.Item
            title="Dark Mode"
            description="Use dark theme throughout the app"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={props => <Switch {...props} value={darkMode} onValueChange={toggleDarkMode} />}
          />

          <Divider />

          <Title style={styles.sectionTitle}>Notifications</Title>
          <List.Item
            title="Enable Notifications"
            description="Get alerts for budget limits and payment reminders"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => <Switch {...props} value={notificationsEnabled} onValueChange={toggleNotifications} />}
          />

          <Divider />

          <Title style={styles.sectionTitle}>Preferences</Title>
          <List.Item
            title="Currency"
            description={`Current: ${currency}`}
            left={props => <List.Icon {...props} icon="currency-usd" />}
            right={props => <Button {...props} onPress={() => setShowCurrencyDialog(true)}>Change</Button>}
          />

          <Divider />

          <Title style={styles.sectionTitle}>Data Management</Title>
          <List.Item
            title="Backup Data"
            description="Export your expense data via email"
            left={props => <List.Icon {...props} icon="cloud-upload" />}
            right={props => <Button {...props} onPress={() => setShowBackupDialog(true)}>Backup</Button>}
          />

          <List.Item
            title="Reset Data"
            description="Clear all your expense data"
            left={props => <List.Icon {...props} icon="delete" color="#C62828" />}
            right={props => (
              <Button 
                {...props} 
                onPress={() => setShowResetDialog(true)} 
                color="#C62828"
              >
                Reset
              </Button>
            )}
          />
        </Card.Content>
      </Card>

      <View style={styles.infoContainer}>
        <Text style={styles.version}>Expense Manager v1.0.0</Text>
      </View>

      {/* Reset Data Dialog */}
      <Portal>
        <Dialog visible={showResetDialog} onDismiss={() => setShowResetDialog(false)}>
          <Dialog.Title>Reset Data</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to clear all transaction data? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowResetDialog(false)}>Cancel</Button>
            <Button onPress={handleClearData} color="#C62828">Reset</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Currency Selection Dialog */}
      <Portal>
        <Dialog visible={showCurrencyDialog} onDismiss={() => setShowCurrencyDialog(false)}>
          <Dialog.Title>Select Currency</Dialog.Title>
          <Dialog.Content>
            <List.Item
              title="USD - United States Dollar ($)"
              onPress={() => setCurrency('USD')}
              right={props => currency === 'USD' && <List.Icon {...props} icon="check" />}
            />
            <List.Item
              title="EUR - Euro (€)"
              onPress={() => setCurrency('EUR')}
              right={props => currency === 'EUR' && <List.Icon {...props} icon="check" />}
            />
            <List.Item
              title="GBP - British Pound (£)"
              onPress={() => setCurrency('GBP')}
              right={props => currency === 'GBP' && <List.Icon {...props} icon="check" />}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCurrencyDialog(false)}>Cancel</Button>
            <Button onPress={handleCurrencyChange}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Backup Dialog */}
      <Portal>
        <Dialog visible={showBackupDialog} onDismiss={() => setShowBackupDialog(false)}>
          <Dialog.Title>Backup Data</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Enter your email address to receive a backup of your expense data:
            </Text>
            <TextInput
              label="Email"
              value={backupEmail}
              onChangeText={setBackupEmail}
              mode="outlined"
              style={styles.dialogInput}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowBackupDialog(false)}>Cancel</Button>
            <Button onPress={handleBackup} disabled={!backupEmail.includes('@')}>Send Backup</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 8,
  },
  infoContainer: {
    alignItems: 'center',
    padding: 24,
  },
  version: {
    color: '#757575',
  },
  dialogText: {
    marginBottom: 16,
  },
  dialogInput: {
    marginTop: 8,
  },
});