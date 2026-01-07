import React from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { styles } from "../styles/directory.styles";

interface BudgetSliderProps {
  limit: number;
  setLimit: (limit: number) => void;
}

export const BudgetSlider = ({ limit, setLimit }: BudgetSliderProps) => {
  return (
    <View style={styles.limitSection}>
      <Text style={styles.limitLabel}>My Limit:</Text>
      <View style={styles.limitContainer}>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={300}
            step={10}
            value={limit}
            onValueChange={setLimit}
            minimumTrackTintColor="#FF6B35"
            maximumTrackTintColor="#e0e0e0"
            thumbTintColor="#FF6B35"
          />
        </View>
        <View style={styles.limitBadge}>
          <Text style={styles.limitText}>₱{limit}</Text>
        </View>
      </View>
    </View>
  );
};
