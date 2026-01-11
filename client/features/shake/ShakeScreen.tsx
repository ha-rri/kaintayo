import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/lib/theme";
import { useIsFocused } from "@react-navigation/native";
import { Zone } from "./types";
import { useShake } from "./hooks/useShake";

// Components
import { FilterControl } from "./components/FilterControl";
import ShakeButton from "./components/ShakeButton";
import ShakeResultModal from "./components/ShakeResultModal";
import ShakeAnimationOverlay from "./components/ShakeAnimationOverlay";
import { FilterModal, FilterState } from "@/components/ui/FilterModal";

import { Meal } from "@/types/Meal";
import { PlaceDetailModal } from "@/features/directory/components/PlaceDetailModal";

export default function ShakeScreen() {
  const [budget, setBudget] = useState(150);
  const [selectedZone, setSelectedZone] = useState<Zone>("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false); // Track Detail View

  const insets = useSafeAreaInsets();

  const {
    matchedPlacesCount,
    selectedPlace,
    isShaking,
    handleShake,
    handleReset,
  } = useShake(budget, selectedZone, categories, amenities, useIsFocused());

  const handleApplyFilters = (newFilters: FilterState) => {
    setBudget(newFilters.limit);

    // Map backend 'zoneMacro' back to frontend 'Zone'
    if (newFilters.zoneMacro === "inside") setSelectedZone("Inside Campus");
    else if (newFilters.zoneMacro === "outside")
      setSelectedZone("Outside Campus");
    else setSelectedZone("All");

    setCategories(newFilters.categories);
    setAmenities(newFilters.amenities);
  };

  // ✅ Helper for Detail Modal
  const getAffordableMeals = (meals: Meal[]) => {
    return meals.filter((meal) => {
      const price = meal.priceHalf || meal.priceRegular;
      return price <= budget;
    });
  };

  // ✅ Actions
  const handleAccept = () => {
    setIsDetailVisible(true); // Switch to Detail View
  };

  const handleShakeAgain = () => {
    handleReset(); // Clear current choice
    setTimeout(() => {
      handleShake(); // Trigger new shake immediately
    }, 100);
  };

  const handleCloseDetail = () => {
    setIsDetailVisible(false);
    handleReset(); // Fully reset when closing details
  };

  return (
    <View style={styles.container}>
      {/* Header (Profile Style) */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>Shake Tayo!</Text>
        <Text style={styles.headerSubtitle}>
          Can&apos;t decide? Let us shake it for you
        </Text>
      </View>

      <View style={styles.contentContainer}>
        {/* 1. Controls Area (Top) */}
        <View style={styles.controlsSection}>
          <FilterControl
            budget={budget}
            onBudgetChange={setBudget}
            selectedZone={selectedZone}
            onZoneChange={setSelectedZone}
            onFilterPress={() => setFilterModalVisible(true)}
          />
        </View>

        {/* 2. Action Area (Bottom) */}
        <View style={styles.actionSection}>
          {/* Status Pill */}
          <View style={styles.statusPill}>
            {matchedPlacesCount === 0 ? (
              <Text style={styles.statusTextDisabled}>No places found</Text>
            ) : (
              <Text style={styles.statusText}>
                ✨{" "}
                <Text style={{ fontWeight: "800" }}>{matchedPlacesCount}</Text>{" "}
                {matchedPlacesCount === 1 ? "Place" : "Places"} Found
              </Text>
            )}
          </View>

          <ShakeButton
            onShake={handleShake}
            isShaking={isShaking}
            disabled={matchedPlacesCount === 0}
          />
        </View>

        {/* Modals & Overlays */}

        {/* Result Modal: Shows only when we have a place AND NOT viewing details */}
        <ShakeResultModal
          visible={selectedPlace !== null && !isDetailVisible}
          place={selectedPlace}
          onClose={handleReset}
          onAccept={handleAccept}
          onShakeAgain={handleShakeAgain}
        />

        {/* Detail Modal: Shows when accepted */}
        <PlaceDetailModal
          visible={isDetailVisible}
          place={selectedPlace}
          limit={budget}
          onClose={handleCloseDetail}
          getAffordableMeals={getAffordableMeals}
        />

        <ShakeAnimationOverlay visible={isShaking} />

        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          onApply={handleApplyFilters}
          initialFilters={{
            limit: budget,
            zoneMacro:
              selectedZone === "Inside Campus"
                ? "inside"
                : selectedZone === "Outside Campus"
                ? "outside"
                : "all",
            categories,
            amenities,
          }}
          maxPrice={300}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Light background
  },
  contentContainer: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "flex-start", // Group content at top
    paddingBottom: 20,
  },
  header: {
    backgroundColor: theme.colors.primary, // Orange
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff", // White
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#fff", // White
    opacity: 0.9,
  },
  controlsSection: {
    marginBottom: 0,
  },
  actionSection: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 20,
    marginTop: 30, // Fixed separation instead of flex-gap
  },
  statusPill: {
    backgroundColor: "#FFF0E6", // Light Orange
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24, // Space above button
  },
  statusText: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  statusTextDisabled: {
    color: theme.colors.text.disabled,
    fontWeight: "600",
    fontSize: 14,
  },
});
