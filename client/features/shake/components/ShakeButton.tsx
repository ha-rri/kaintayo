import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Image, StyleSheet } from 'react-native';

interface ShakeButtonProps {
  onShake: () => void;
  isShaking: boolean;
  disabled: boolean;
}

export default function ShakeButton({ onShake, isShaking, disabled }: ShakeButtonProps) {
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isShaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnimation, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnimation, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnimation, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      shakeAnimation.setValue(0);
    }
  }, [isShaking, shakeAnimation]);

  return (
    <View style={styles.shakeContainer}>
      <TouchableOpacity
        style={[styles.shakeButton, disabled && styles.shakeButtonDisabled]}
        onPress={onShake}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
          {/* ✅ UPDATED: Using 'shaketayo.png' */}
          <Image 
            source={require('../../../assets/images/icons/shaketayo.png')} 
            style={styles.logoImage}
          />
        </Animated.View>
      </TouchableOpacity>
      <Text style={styles.shakeText}>
        {disabled ? 'No places match your criteria' : 'Tap the button or Start shaking'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shakeContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  shakeButton: {
    marginTop: -100,
    marginBottom: -100,
    width: 350, 
    height: 350,
    borderRadius: 175,
    justifyContent: 'center',
    alignItems: 'center',
    
    // ✅ REMOVED: backgroundColor and shadow 
    // (Because your image already has the orange color and shadow!)
    backgroundColor: 'transparent', 
    elevation: 0, 
  },
  shakeButtonDisabled: {
    backgroundColor: '#ccc', // We keep this for when it's disabled
    borderRadius: 110,
  },
  logoImage: {
    // ✅ FULL SIZE: The image fills the entire button area
    width: 220, 
    height: 220,
    resizeMode: 'contain',
    
    // ✅ REMOVED: tintColor (So the orange color shows!)
    // ✅ REMOVED: margins (It is already centered!)
  },
  shakeText: {
    marginBottom: -100,
    marginTop: 20,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});