import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { styles } from "./styles/shake.styles";
import { Zone } from "./types";
import { useShake } from "./hooks/useShake";

// Components
import BudgetDisplay from "./components/BudgetDisplay";
import ZoneSelector from "./components/ZoneSelector";
import MatchCounter from "./components/MatchCounter";
import ShakeButton from "./components/ShakeButton";
import ShakeResultModal from "./components/ShakeResultModal";
import ShakeAnimationOverlay from "./components/ShakeAnimationOverlay"; // ✅ Imported

export default function ShakeScreen() {
  const [budget, setBudget] = useState(150);
  const [selectedZone, setSelectedZone] = useState<Zone>("All");

  const {
    matchedPlacesCount,
    selectedPlace,
    isShaking,
    handleShake,
    handleReset,
  } = useShake(budget, selectedZone);

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
        {/* We hide the text reset button here because the Modal handles it now */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Budget Display */}
        <BudgetDisplay budget={budget} onBudgetChange={setBudget} />

        {/* Zone Selector & Match Counter */}
        <View style={styles.row}>
          <ZoneSelector
            selectedZone={selectedZone}
            onZoneChange={setSelectedZone}
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

      {/* ✅ Animation Overlay (Shows DURING shaking) */}
      <ShakeAnimationOverlay visible={isShaking} />
    </View>
  );
}