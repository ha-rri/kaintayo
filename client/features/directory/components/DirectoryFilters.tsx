import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
  const zones = ["All", "Inside Campus", "Outside Campus"];

  return (
    <View style={styles.container}>
      {/* Top Section: Limit Slider */}
      <BudgetSlider limit={limit} setLimit={setLimit} />

      {/* Bottom Section: Zones + Filter Button */}
      <View style={styles.bottomRow}>
        <View style={styles.zoneContainer}>
          {zones.map((zone) => (
            <TouchableOpacity
              key={zone}
              style={[
                styles.zoneTab,
                activeCategory === zone && styles.zoneTabActive,
                { flex: zone === "All" ? 0.6 : 1.2 },
              ]}
              onPress={() => setActiveCategory(zone)}
            >
              <Text
                style={[
                  styles.zoneText,
                  activeCategory === zone && styles.zoneTextActive,
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {zone}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons
            name="options-outline"
            size={20}
            color={theme.colors.text.light}
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
    marginTop: 10, // Add spacing since BudgetSlider is self-contained
  },
  zoneContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
  },
  zoneTab: {
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  zoneTabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  zoneText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  zoneTextActive: {
    color: theme.colors.text.light,
  },
  filterButton: {
    backgroundColor: theme.colors.primary,
    width: 44,
    height: 40,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
