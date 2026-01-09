import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { styles } from '../styles/shake.styles';

interface BudgetDisplayProps {
  budget: number;
  onBudgetChange: (value: number) => void;
}

export default function BudgetDisplay({ budget, onBudgetChange }: BudgetDisplayProps) {
  return (
    <View style={styles.budgetCard}>
      <Text style={styles.budgetLabel}>Set Max Budget</Text>
      <View style={styles.budgetDisplay}>
        <Text style={styles.budgetIcon}>₱</Text>
        <Text style={styles.budgetAmount}>{budget}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={300}
        step={10}
        value={budget}
        onValueChange={onBudgetChange}
        minimumTrackTintColor="#FF6B35"
        maximumTrackTintColor="#e0e0e0"
        thumbTintColor="#FF6B35"
      />
    </View>
  );
}
