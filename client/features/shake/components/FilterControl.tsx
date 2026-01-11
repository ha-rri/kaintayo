import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/lib/theme";
import { Zone } from "../types";
import { BudgetSlider } from "@/components/ui/BudgetSlider";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

interface FilterControlProps {
  budget: number;
  onBudgetChange: (value: number) => void;
  selectedZone: Zone;
  onZoneChange: (zone: Zone) => void;
  onFilterPress: () => void;
}

export const FilterControl = ({
  budget,
  onBudgetChange,
  selectedZone,
  onZoneChange,
  onFilterPress,
}: FilterControlProps) => {
  const zones: Zone[] = ["All", "Inside Campus", "Outside Campus"];
  // Map Zone string -> Index
  const selectedIndex = zones.indexOf(selectedZone);

  return (
    <View style={styles.container}>
      {/* Row 1: Budget Slider (Full Width) */}
      <View style={styles.sliderRow}>
        <BudgetSlider limit={budget} setLimit={onBudgetChange} max={300} />
      </View>

      {/* Row 2: Zones + Filter Icon */}
      <View style={styles.bottomRow}>
        <View style={styles.zoneWrapper}>
          <SegmentedControl
            values={["All", "Inside", "Outside"]}
            selectedIndex={selectedIndex !== -1 ? selectedIndex : 0}
            onChange={(index) => onZoneChange(zones[index])}
          />
        </View>

        <TouchableOpacity style={styles.iconButton} onPress={onFilterPress}>
          <Ionicons name="options" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: 20,
    shadowColor: theme.shadows.sm.shadowColor,
    shadowOffset: theme.shadows.sm.shadowOffset,
    shadowOpacity: theme.shadows.sm.shadowOpacity,
    shadowRadius: theme.shadows.sm.shadowRadius,
    elevation: theme.shadows.sm.elevation,
  },
  sliderRow: {
    marginBottom: 16,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  zoneWrapper: {
    flex: 1, // Takes available space
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: "#FFF0E6",
    justifyContent: "center",
    alignItems: "center",
  },
});
