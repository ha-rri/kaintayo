import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/shake.styles';

type Zone = 'All' | 'Inside Campus' | 'Outside Campus';

interface ZoneSelectorProps {
  selectedZone: Zone;
  onZoneChange: (zone: Zone) => void;
}

export default function ZoneSelector({ selectedZone, onZoneChange }: ZoneSelectorProps) {
  const zones: Zone[] = ['All', 'Inside Campus', 'Outside Campus'];

  return (
    <View style={styles.zoneCard}>
      <Text style={styles.zoneLabel}>Select Zones</Text>
      <View style={styles.zoneButtons}>
        {zones.map((zone) => (
          <TouchableOpacity
            key={zone}
            style={[
              styles.zoneButton,
              selectedZone === zone && styles.zoneButtonActive
            ]}
            onPress={() => onZoneChange(zone)}
          >
            <Text style={[
              styles.zoneButtonText,
              selectedZone === zone && styles.zoneButtonTextActive
            ]}>
              {zone}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}