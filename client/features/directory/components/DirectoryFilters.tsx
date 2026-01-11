import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/lib/theme";
import { BudgetSlider } from "@/components/ui/BudgetSlider";

import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DirectoryFiltersProps {
  limit: number;
  setLimit: (value: number) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onFilterPress: () => void;
  variant?: "static" | "sticky"; // New prop
}

export const DirectoryFilters = ({
  limit,
  setLimit,
  activeCategory,
  setActiveCategory,
  onFilterPress,
  variant = "static",
}: DirectoryFiltersProps) => {
  const insets = useSafeAreaInsets();
  // Local state for smooth slider dragging
  const [localLimit, setLocalLimit] = useState(limit);

  // Sync local limit if prop changes (e.g. from Filter Modal)
  useEffect(() => {
    setLocalLimit(limit);
  }, [limit]);

  // Dynamic Styles
  const containerStyle =
    variant === "sticky"
      ? {
          paddingTop: Math.max(20, insets.top + 10),
          marginTop: 0,
          marginBottom: 0, // Remove bottom margin for sticky
          borderTopLeftRadius: 0, // Flat top for sticky
          borderTopRightRadius: 0,
          borderBottomWidth: 1, // Optional: Separator
          borderBottomColor: "#eee",
        }
      : {
          paddingTop: 20,
        };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Top Section: Limit Slider */}
      <BudgetSlider
        limit={localLimit}
        setLimit={(value) => {
          setLocalLimit(value);
          setLimit(value); // Live Update
        }}
        onSlidingComplete={(value) => setLimit(value)}
      />

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
  },

  filterButton: {
    backgroundColor: "#FFF0E6",
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
