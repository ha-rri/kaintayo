import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { styles } from '../styles/shake.styles';

interface MatchCounterProps {
  count: number;
  isLoading?: boolean;
}

export default function MatchCounter({ count, isLoading }: MatchCounterProps) {
  return (
    <View style={styles.matchCard}>
      <Text style={styles.matchLabel}>Possible No. of Places</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#FF6B35" style={{ marginVertical: 10 }} />
      ) : (
        <Text style={styles.matchCount}>{count}</Text>
      )}
      <Text style={styles.matchSubtext}>
        Places have matched your budget & zones
      </Text>
    </View>
  );
}