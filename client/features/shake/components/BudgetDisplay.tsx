import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from '../styles/shake.styles';

interface BudgetDisplayProps {
  budget: number;
  onBudgetChange: (value: number) => void;
}

export default function BudgetDisplay({ budget, onBudgetChange }: BudgetDisplayProps) {
  
  const handleChange = (text: string) => {
    // 1. Remove non-numeric characters (prevents copy-paste errors)
    const cleanNumber = text.replace(/[^0-9]/g, '');
    
    // 2. Update state (if empty, default to 0 to prevent NaN errors)
    onBudgetChange(Number(cleanNumber));
  };

  return (
    <View style={styles.budgetCard}>
      <Text style={styles.budgetLabel}>Set Max Budget</Text>
      
      {/* The Grey Input Box */}
      <View style={styles.budgetInputContainer}>
        <Text style={styles.budgetCurrency}>₱</Text>
        <TextInput
          style={styles.budgetInput}
          value={budget === 0 ? '' : budget.toString()}
          onChangeText={handleChange}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#999"
          maxLength={5} // Prevents crazy large numbers
        />
      </View>
    </View>
  );
}