import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

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

const styles = StyleSheet.create({
  limitSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#ffffffff",
    marginTop: -17,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  limitLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000ff",
    marginBottom: 10,
  },
  limitContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  sliderContainer: {
    flex: 1,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  limitBadge: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FF6B35",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  limitText: {
    color: "#FF6B35",
    fontWeight: "700",
    fontSize: 14,
  },
});
