import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './styles/shake.styles';
import { Zone } from './types';
import { useShake } from './hooks/useShake';

// Components
import BudgetDisplay from './components/BudgetDisplay';
import ZoneSelector from './components/ZoneSelector';
import MatchCounter from './components/MatchCounter';
import ShakeButton from './components/ShakeButton';

export default function ShakeScreen() {
  const [budget, setBudget] = useState(150);
  const [selectedZone, setSelectedZone] = useState<Zone>('All');

  const {
    matchedPlacesCount,
    selectedPlace,
    isShaking,
    isLoading,
    handleShake,
    handleReset,
  } = useShake(budget, selectedZone);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Shake Tayo!</Text>
          <Text style={styles.headerSubtitle}>Can't decide? Let us shake it for you</Text>
        </View>
        {selectedPlace && (
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetButton}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Budget */}
        <BudgetDisplay budget={budget} onBudgetChange={setBudget} />

        {/* Filters Row */}
        <View style={styles.row}>
          <ZoneSelector selectedZone={selectedZone} onZoneChange={setSelectedZone} />
          <MatchCounter count={matchedPlacesCount} isLoading={isLoading} />
        </View>

        {/* Shake Action */}
        <ShakeButton 
          onShake={handleShake} 
          isShaking={isShaking} 
          disabled={matchedPlacesCount === 0 || isLoading} 
        />

        {/* Result Popup */}
        {selectedPlace && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>We recommend:</Text>
            <Text style={styles.placeName}>{selectedPlace.name}</Text>
            <Text style={styles.placeLocation}>
              📍 {selectedPlace.nearestLandmark || "Unknown Location"}
            </Text>
            <Text style={{ marginTop: 8, color: '#FF6B35', fontWeight: 'bold' }}>
              ₱{selectedPlace.priceRange.min} - ₱{selectedPlace.priceRange.max}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}