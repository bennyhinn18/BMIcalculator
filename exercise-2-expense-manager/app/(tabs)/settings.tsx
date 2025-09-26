import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, List, Button, Divider, Dialog, Portal, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  const theme = useTheme();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [totalStorage, setTotalStorage] = useState('0 KB');

  useEffect(() => {
    calculateStorageUsage();
  }, []);

  const calculateStorageUsage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      
      for (const key of keys) {
        if (key.startsWith('expense_manager_')) {
          const data = await AsyncStorage.getItem(key);
          if (data) {
            totalSize += new Blob([data]).size;
          }
        }
      }
      
      // Convert bytes to KB
      const sizeInKB = (totalSize / 1024).toFixed(2);
      setTotalStorage(`${sizeInKB} KB`);
    } catch (error) {
      console.error("Failed to calculate storage usage", error);
    }
  };

  const clearAllData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const expenseManagerKeys = keys.filter(key => key.startsWith('expense_manager_'));
      
      if (expenseManagerKeys.length > 0) {
        await AsyncStorage.multiRemove(expenseManagerKeys);
        Alert.alert(
          "Success", 
          "All expense data has been cleared",
          [{ text: "OK" }]
        );
        setTotalStorage('0 KB');
      }
    } catch (error) {
      console.error("Failed to clear data", error);
      Alert.alert(
        "Error", 
        "Failed to clear data. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setShowClearDialog(false);
    }
  };

  const exportData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const expenseManagerKeys = keys.filter(key => key.startsWith('expense_manager_'));
      
      const exportData = {};
      for (const key of expenseManagerKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          exportData[key] = JSON.parse(data);
        }
      }
      
      Alert.alert(
        "Export Data",
        "This is a demo feature. In a real app, this would save your data to a file or cloud service.",
        [{ text: "OK" }]
      );
      
      console.log("Export data:", JSON.stringify(exportData, null, 2));
    } catch (error) {
      console.error("Failed to export data", error);
      Alert.alert("Error", "Failed to export data");
    }
  };

  const importData = () => {
    Alert.alert(
      "Import Data",
      "This is a demo feature. In a real app, this would let you import data from a file or cloud service.",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Settings</Text>
        
        <List.Section>
          <List.Subheader>Data Management</List.Subheader>
          <List.Item
            title="Storage Usage"
            description={`App data is using ${totalStorage}`}
            left={props => <List.Icon {...props} icon="database" />}
          />
          <Divider />
          <List.Item
            title="Export Data"
            description="Save your expense data"
            left={props => <List.Icon {...props} icon="export" />}
            onPress={exportData}
          />
          <Divider />
          <List.Item
            title="Import Data"
            description="Load previously exported data"
            left={props => <List.Icon {...props} icon="import" />}
            onPress={importData}
          />
          <Divider />
          <List.Item
            title="Clear All Data"
            description="Delete all transactions and categories"
            left={props => <List.Icon {...props} icon="delete" color={theme.colors.error} />}
            onPress={() => setShowClearDialog(true)}
          />
        </List.Section>
        
        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
          <Divider />
          <List.Item
            title="Exercise 2: Expense Manager"
            description="App Development Laboratory (CCS332)"
            left={props => <List.Icon {...props} icon="school" />}
          />
        </List.Section>
        
        <Portal>
          <Dialog visible={showClearDialog} onDismiss={() => setShowClearDialog(false)}>
            <Dialog.Title>Clear All Data</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Are you sure you want to clear all expense data? This action cannot be undone.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowClearDialog(false)}>Cancel</Button>
              <Button onPress={clearAllData} textColor={theme.colors.error}>Clear All</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 24,
  },
});
