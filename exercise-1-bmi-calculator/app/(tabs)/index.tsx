import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Provider as PaperProvider, TextInput, Button, Text, Title, Card } from 'react-native-paper';

export default function App() {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      setBmi(null);
      setCategory('Please enter valid height and weight');
      return;
    }

    const bmiValue = parseFloat((w / (h * h)).toFixed(1));
    setBmi(bmiValue);

    if (bmiValue < 18.5) setCategory('Underweight');
    else if (bmiValue < 24.9) setCategory('Normal weight');
    else if (bmiValue < 29.9) setCategory('Overweight');
    else setCategory('Obese');
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.innerContainer}>
            <Title style={styles.title}>BMI Calculator</Title>

            <TextInput
              label="Height (cm)"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
              placeholder="e.g. 170"
            />

            <TextInput
              label="Weight (kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
              placeholder="e.g. 65"
            />

            <Button mode="contained" onPress={calculateBMI} style={styles.button}>
              Calculate BMI
            </Button>

            {bmi !== null && (
              <Card style={styles.resultCard}>
                <Card.Content>
                  <Title>Your BMI: {bmi}</Title>
                  <Text>Status: {category}</Text>
                </Card.Content>
              </Card>
            )}

            {bmi === null && category !== '' && (
              <Text style={styles.errorText}>{category}</Text>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e81515ca',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  resultCard: {
    marginTop: 30,
    backgroundColor: '#E0F7FA',
  },
  errorText: {
    marginTop: 20,
    color: 'red',
    textAlign: 'center',
  },
});
