import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { theme } from "@/lib/theme";

interface BudgetSliderProps {
  limit: number;
  setLimit: (limit: number) => void;
  min?: number;
  max?: number;
  step?: number;
  onSlidingComplete?: (value: number) => void;
}

export const BudgetSlider = ({
  limit,
  setLimit,
  min = 0,
  max = 300,
  step = 10,
  onSlidingComplete,
}: BudgetSliderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>My Limit:</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>₱{limit}</Text>
        </View>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={limit}
        onValueChange={setLimit}
        onSlidingComplete={onSlidingComplete}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.border}
        thumbTintColor={theme.colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // No external layout margins/padding defaults, let parent handle
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontSize: theme.fontSizes.sm, // 14
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm, // 8
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: theme.colors.text.light,
    fontWeight: "700",
    fontSize: theme.fontSizes.sm, // 14
  },
  slider: {
    width: "100%",
    height: 40,
    // Adjust negative margin if needed to align thumb, but standard is usually fine.
    // DirectoryFilters had no negative margin. FilterModal had -15.
    // Let's stick to standard and let parent adjust if critical.
  },
});
