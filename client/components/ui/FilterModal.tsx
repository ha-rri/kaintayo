import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { CATEGORIES, AMENITIES } from "@/constants/taxonomy";

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

  // Sync state when modal opens
  useEffect(() => {
    if (visible) {
      setFilters(initialFilters);
    }
  }, [visible, initialFilters]);

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
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Filter</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Price Limit */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Limit:</Text>
                <View style={styles.limitBadge}>
                  <Text style={styles.limitText}>₱{filters.limit}</Text>
                </View>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={minPrice}
                maximumValue={maxPrice}
                step={10}
                value={filters.limit}
                onValueChange={setLimit}
                minimumTrackTintColor="#FF6B35"
                maximumTrackTintColor="#e0e0e0"
                thumbTintColor="#FF6B35"
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
        </View>
      </View>
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.8, // 80% height
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  resetText: {
    color: "#FF6B35",
    fontSize: 14,
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
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  helperText: {
    fontSize: 12,
    color: "#888",
    marginBottom: 10,
    fontStyle: "italic",
  },
  limitBadge: {
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  limitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: -15,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  chipActive: {
    borderColor: "#FF6B35",
    backgroundColor: "#FFF0E6",
  },
  chipText: {
    color: "#666",
    fontSize: 14,
  },
  chipTextActive: {
    color: "#FF6B35",
    fontWeight: "500",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  applyButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
