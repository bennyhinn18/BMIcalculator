import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Context
import { ExpenseProvider } from './src/context/ExpenseContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider>
      <ExpenseProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: '#6200ee',
              tabBarInactiveTintColor: 'gray',
              tabBarLabelStyle: { fontSize: 12 },
            }}
          >
            <Tab.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen 
              name="Add" 
              component={AddExpenseScreen} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="plus-circle" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen 
              name="Reports" 
              component={ReportsScreen} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen 
              name="Settings" 
              component={SettingsScreen} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="cog" color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ExpenseProvider>
    </PaperProvider>
  );
}