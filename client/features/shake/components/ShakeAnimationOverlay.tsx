import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withTiming, 
  withRepeat,
  withDelay,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface ShakeAnimationOverlayProps {
  visible: boolean;
}

export default function ShakeAnimationOverlay({ visible }: ShakeAnimationOverlayProps) {
  // Animation Values
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(0); // ✅ UPDATED: Starts hidden (0)

  useEffect(() => {
    if (visible) {
      // 1. Reset values
      scale.value = 0;
      rotate.value = 0;
      textOpacity.value = 0;
      containerOpacity.value = 0; // Ensure it starts invisible

      // 2. Smooth Fade In -> Wait -> Fade Out
      // We wrap the whole lifecycle in one sequence
      containerOpacity.value = withSequence(
        withTiming(1, { duration: 400 }), // ✅ Fade In (0.4s)
        withDelay(4100, withTiming(0, { duration: 500 })) // Wait until 4.5s total, then Fade Out
      );

      // 3. Icon Pop In (Slightly delayed to match fade-in)
      scale.value = withDelay(100, withSpring(1, { damping: 10 }));

      // 4. Shake Animation (0.3s -> 3.0s)
      // 10 loops * 300ms = 3000ms (3 seconds)
      rotate.value = withDelay(
        300, 
        withRepeat(
          withSequence(
            withTiming(-15, { duration: 100 }),
            withTiming(15, { duration: 100 }),
            withTiming(0, { duration: 100 })
          ),
          10, // 10 loops = Stops exactly when text appears
          true
        )
      );

      // 5. "Kainan Found!" Text Reveal (at 3.0s)
      textOpacity.value = withDelay(3000, withTiming(1, { duration: 500 }));
    }
  }, [visible]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: withSpring(textOpacity.value === 1 ? 0 : 20) }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={animatedIconStyle}>
        <Image 
            source={require('../../../assets/images/icons/shake-logo.png')} 
            style={styles.overlayLogo}
        />
      </Animated.View>

      <Animated.Text style={[styles.loadingText, animatedTextStyle]}>
        Kainan Found!
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: '#FF7428', 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 10,
  },
  overlayLogo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  loadingText: {
    marginTop: -10, 
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 1,
  },
});