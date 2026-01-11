import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/lib/theme";
import { BudgetSlider } from "@/components/ui/BudgetSlider";

interface DirectoryFiltersProps {
  limit: number;
  setLimit: (value: number) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onFilterPress: () => void;
}

export const DirectoryFilters = ({
  limit,
  setLimit,
  activeCategory,
  setActiveCategory,
  onFilterPress,
}: DirectoryFiltersProps) => {
  return (
    <View style={styles.container}>
      {/* Top Section: Limit Slider */}
      <BudgetSlider limit={limit} setLimit={setLimit} />

      {/* Bottom Section: Zones + Filter Button */}
      <View style={styles.bottomRow}>
        <View style={styles.zoneContainer}>
          <SegmentedControl
            values={["All", "Inside", "Outside"]}
            selectedIndex={
              activeCategory === "Inside Campus"
                ? 1
                : activeCategory === "Outside Campus"
                ? 2
                : 0
            }
            onChange={(index) => {
              const categories = ["All", "Inside Campus", "Outside Campus"];
              setActiveCategory(categories[index]);
            }}
          />
        </View>

        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons
            name="options-outline"
            size={20}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -20,
    marginBottom: 20,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: theme.shadows.sm.shadowColor,
    shadowOffset: theme.shadows.sm.shadowOffset,
    shadowOpacity: theme.shadows.sm.shadowOpacity,
    shadowRadius: theme.shadows.sm.shadowRadius,
    elevation: theme.shadows.sm.elevation,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  zoneContainer: {
    flex: 1,
    // Removed flexDirection: 'row' and gap, allowing SegmentedControl to fill width
  },
  // zoneTab, zoneTabActive, zoneText, zoneTextActive styles REMOVED as they are replaced by SegmentedControl

  filterButton: {
    backgroundColor: "#FFF0E6", // Light Orange (Shake Style)
    width: 44,
    height: 44, // Matched height with SegmentedControl (approx)
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
