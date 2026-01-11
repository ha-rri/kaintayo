import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/lib/theme";
import React, { useState, useEffect, useRef } from "react";
import { CATEGORIES, AMENITIES } from "@/constants/taxonomy";
import { BudgetSlider } from "./BudgetSlider";

const { height } = Dimensions.get("window");

export interface FilterState {
  limit: number;
  zoneMacro?: string; // "inside" | "outside" | "all"
  categories: string[];
  amenities: string[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
  minPrice?: number;
  maxPrice?: number;
}

export const FilterModal = ({
  visible,
  onClose,
  onApply,
  initialFilters,
  minPrice = 0,
  maxPrice = 300,
}: FilterModalProps) => {
  // Local state for the modal
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Animation Value: 0 (Hidden) -> 1 (Visible)
  const anim = useRef(new Animated.Value(0)).current;

  // Sync state when modal opens
  useEffect(() => {
    if (visible) {
      setFilters(initialFilters);
      // Animate In
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    } else {
      // Reset anim for next time (though usually unmounted)
      anim.setValue(0);
    }
  }, [visible, initialFilters, anim]);

  // Handle animate out before close
  const handleClose = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.in(Easing.cubic),
    }).start(() => {
      onClose(); // Actual Close Prop
    });
  };

  // Interpolations
  const backdropOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0], // Slide from bottom
  });

  const toggleCategory = (category: string) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(category);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
  };

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const setLimit = (val: number) => {
    setFilters((prev) => ({ ...prev, limit: val }));
  };

  const handleReset = () => {
    setFilters({
      limit: 150,
      zoneMacro: "all",
      categories: [],
      amenities: [],
    });
  };

  const handleApply = () => {
    onApply(filters);
    handleClose();
  };

  return (
    <Modal
      animationType="none" // Custom animation
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[styles.modalOverlay, { opacity: backdropOpacity }]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          style={[styles.modalContent, { transform: [{ translateY }] }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Filter</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContainer}
          >
            {/* Price Limit */}
            <View style={styles.section}>
              <BudgetSlider
                limit={filters.limit}
                setLimit={setLimit}
                min={minPrice}
                max={maxPrice}
              />
            </View>
            {/* Zone Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.chipContainer}>
                {["All", "Inside Campus", "Outside Campus"].map((zone) => {
                  const isActive =
                    filters.zoneMacro ===
                    (zone === "All"
                      ? "all"
                      : zone === "Inside Campus"
                      ? "inside"
                      : "outside");
                  return (
                    <TouchableOpacity
                      key={zone}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          zoneMacro:
                            zone === "All"
                              ? "all"
                              : zone === "Inside Campus"
                              ? "inside"
                              : "outside",
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isActive && styles.chipTextActive,
                        ]}
                      >
                        {zone}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            {/* Categories */}
            <View style={styles.section}>
              <View>
                <Text style={styles.sectionTitle}>Categories</Text>
                <Text style={styles.helperText}>
                  Show places with any of these
                </Text>
              </View>
              <View style={styles.chipContainer}>
                {CATEGORIES.map((cat) => {
                  const isActive = filters.categories.includes(cat);
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => toggleCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isActive && styles.chipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            {/* Amenities */}
            <View style={styles.section}>
              <View>
                <Text style={styles.sectionTitle}>Amenities</Text>
                <Text style={styles.helperText}>
                  Show places with all of these
                </Text>
              </View>
              <View style={styles.chipContainer}>
                {AMENITIES.map((amenity) => {
                  const isActive = filters.amenities.includes(amenity);
                  return (
                    <TouchableOpacity
                      key={amenity}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => toggleAmenity(amenity)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isActive && styles.chipTextActive,
                        ]}
                      >
                        {amenity}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    height: height * 0.8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  resetText: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm, // 14
    fontWeight: "500",
  },
  scrollContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 5,
  },
  helperText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.disabled,
    marginBottom: 10,
    fontStyle: "italic",
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  chipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: "#FFF0E6",
  },
  chipText: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSizes.sm,
  },
  chipTextActive: {
    color: theme.colors.primary,
    fontWeight: "500",
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  applyButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 15,
    alignItems: "center",
  },
  applyButtonText: {
    color: theme.colors.text.light,
    fontSize: theme.fontSizes.md,
    fontWeight: "600",
  },
});
