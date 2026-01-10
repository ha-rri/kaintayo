import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from '../styles/shake.styles';

interface BudgetDisplayProps {
  budget: number;
  onBudgetChange: (value: number) => void;
}

export default function BudgetDisplay({ budget, onBudgetChange }: BudgetDisplayProps) {
  return (
    <View style={styles.budgetCard}>
      <Text style={styles.budgetLabel}>Set Max Budget</Text>
      
      {/* Input Container */}
      <View style={styles.budgetInputContainer}>
        <Text style={styles.budgetIcon}>₱</Text>
        <TextInput
          style={styles.budgetInput}
          value={budget > 0 ? budget.toString() : ''}
          placeholder="0"
          placeholderTextColor="#999"
          keyboardType="numeric"
          onChangeText={(text) => {
            // Only allow numbers
            const numericValue = parseInt(text.replace(/[^0-9]/g, '')) || 0;
            onBudgetChange(numericValue);
          }}
        />
      </View>
    </View>
  );
}