import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/shake.styles';

interface MatchCounterProps {
  count: number;
}

export default function MatchCounter({ count }: MatchCounterProps) {
  return (
    <View style={styles.matchCard}>
      <Text style={styles.matchLabel}>Possible No. of Places</Text>
      <Text style={styles.matchCount}>{count}</Text>
      <Text style={styles.matchSubtext}>
        Places have matched your budget & zones
      </Text>
    </View>
  );
}