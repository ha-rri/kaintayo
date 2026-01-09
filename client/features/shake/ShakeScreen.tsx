import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import BudgetDisplay from './components/BudgetDisplay';
import ZoneSelector from './components/ZoneSelector';
import MatchCounter from './components/MatchCounter';
import ShakeButton from './components/ShakeButton';
import { useShake } from './hooks/useShake';
import { styles } from './styles/shake.styles';

export default function ShakeScreen() {
  const [budget, setBudget] = useState(150);
  const [selectedZone, setSelectedZone] = useState<'All' | 'Inside Campus' | 'Outside Campus'>('All');
  
  const { 
    matchedPlacesCount, 
    selectedPlace, 
    isShaking,
    handleShake,
    handleReset 
  } = useShake(budget, selectedZone);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Shake Tayo!</Text>
          <Text style={styles.headerSubtitle}>Can't decide? Let us shake it for you</Text>
        </View>
        {selectedPlace && (
          <Text style={styles.resetButton} onPress={handleReset}>
            Reset
          </Text>
        )}
      </View>

      <View style={styles.content}>
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

        {/* Selected Place Display */}
        {selectedPlace && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>We recommend:</Text>
            <Text style={styles.placeName}>{selectedPlace.name}</Text>
            <Text style={styles.placeLocation}>{selectedPlace.location.landmark}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}