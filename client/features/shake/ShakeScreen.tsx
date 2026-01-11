import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { styles } from "./styles/shake.styles";
import { Zone } from "./types";
import { useShake } from "./hooks/useShake";

// Components
import BudgetDisplay from "./components/BudgetDisplay";
import ZoneSelector from "./components/ZoneSelector";
import MatchCounter from "./components/MatchCounter";
import ShakeButton from "./components/ShakeButton";
import ShakeResultModal from "./components/ShakeResultModal";
import ShakeAnimationOverlay from "./components/ShakeAnimationOverlay";
import { FilterModal, FilterState } from "@/components/ui/FilterModal";

export default function ShakeScreen() {
  const [budget, setBudget] = useState(150);
  const [selectedZone, setSelectedZone] = useState<Zone>("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const {
    matchedPlacesCount,
    selectedPlace,
    isShaking,
    handleShake,
    handleReset,
  } = useShake(budget, selectedZone, categories, amenities);

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Shake Tayo!</Text>
          <Text style={styles.headerSubtitle}>
            Can&apos;t decide? Let us shake it for you
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Budget Display */}
        <BudgetDisplay budget={budget} onBudgetChange={setBudget} />

        {/* Zone Selector & Match Counter */}
        <View style={styles.row}>
          <ZoneSelector
            selectedZone={selectedZone}
            onZoneChange={setSelectedZone}
            onFilterPress={() => setFilterModalVisible(true)}
          />
          <MatchCounter count={matchedPlacesCount} />
        </View>

        {/* Shake Button */}
        <ShakeButton
          onShake={handleShake}
          isShaking={isShaking}
          disabled={matchedPlacesCount === 0}
        />
      </ScrollView>

      {/* Result Modal (Shows AFTER animation finishes) */}
      <ShakeResultModal
        visible={selectedPlace !== null}
        place={selectedPlace}
        onClose={handleReset}
        onAccept={() => {
          Alert.alert("Enjoy!", `Navigating to ${selectedPlace?.name}...`);
          handleReset();
        }}
      />

      {/* Animation Overlay (Shows DURING shaking) */}
      <ShakeAnimationOverlay visible={isShaking} />

      {/* Filter Modal */}
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
  );
}
