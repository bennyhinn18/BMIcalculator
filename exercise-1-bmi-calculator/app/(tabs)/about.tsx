import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, Title, Text, Card, Divider } from 'react-native-paper';

export default function AboutScreen() {
  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Title style={styles.title}>About BMI Calculator</Title>
          
          <Card style={styles.card}>
            <Card.Content>
              <Title>What is BMI?</Title>
              <Text style={styles.text}>
                Body Mass Index (BMI) is a simple calculation using a person's height and weight. 
                The formula is BMI = kg/m² where kg is weight in kilograms and m² is height in metres squared.
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title>BMI Categories</Title>
              <Divider style={styles.divider} />
              <Text style={styles.categoryText}>Underweight: BMI less than 18.5</Text>
              <Text style={styles.categoryText}>Normal weight: BMI 18.5 to 24.9</Text>
              <Text style={styles.categoryText}>Overweight: BMI 25 to 29.9</Text>
              <Text style={styles.categoryText}>Obese: BMI 30 or greater</Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title>Important Note</Title>
              <Text style={styles.text}>
                BMI is a useful screening tool, but it is not a diagnostic tool. 
                For a complete health assessment, consult with a healthcare professional.
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title>Exercise Information</Title>
              <Text style={styles.text}>
                This app is part of Exercise 1 from the App Development Laboratory (CCS332).
                It demonstrates React Native fundamentals including state management, 
                form validation, and UI component integration.
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    alignSelf: 'center',
    marginBottom: 20,
    fontSize: 24,
  },
  card: {
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  text: {
    marginTop: 10,
    lineHeight: 20,
  },
  divider: {
    marginVertical: 10,
  },
  categoryText: {
    marginVertical: 5,
    fontSize: 16,
  },
});
