import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/shake.styles';

interface ShakeButtonProps {
  onShake: () => void;
  isShaking: boolean;
  disabled: boolean;
}

export default function ShakeButton({ onShake, isShaking, disabled }: ShakeButtonProps) {
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isShaking) {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isShaking]);

  return (
    <View style={styles.shakeContainer}>
      <TouchableOpacity
        style={[styles.shakeButton, disabled && styles.shakeButtonDisabled]}
        onPress={onShake}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
          <Ionicons name="phone-portrait-outline" size={80} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
      <Text style={styles.shakeText}>
        {disabled ? 'No places match your criteria' : 'Tap the button or Start shaking'}
      </Text>
    </View>
  );
}