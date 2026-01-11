import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  StyleSheet,
} from "react-native";

interface ShakeButtonProps {
  onShake: () => void;
  isShaking: boolean;
  disabled: boolean;
}

export default function ShakeButton({
  onShake,
  isShaking,
  disabled,
}: ShakeButtonProps) {
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

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

  const handlePressIn = () => {
    Animated.spring(scaleAnimation, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.shakeContainer}>
      <TouchableOpacity
        style={[styles.shakeButton, disabled && styles.shakeButtonDisabled]}
        onLongPress={onShake}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        delayLongPress={500}
        disabled={disabled}
        activeOpacity={1}
      >
        <Animated.View
          style={{
            transform: [
              { translateX: shakeAnimation },
              { scale: scaleAnimation },
            ],
          }}
        >
          <Image
            source={require("../../../assets/images/icons/shaketayo.png")}
            style={styles.logoImage}
          />
        </Animated.View>
      </TouchableOpacity>
      <Text style={styles.shakeText}>
        {disabled
          ? "No places match your criteria"
          : "Shake phone or Hold button!"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shakeContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  shakeButton: {
    marginTop: -100,
    marginBottom: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
    justifyContent: "center",
    alignItems: "center",

    // ✅ REMOVED: backgroundColor and shadow
    // (Because your image already has the orange color and shadow!)
    backgroundColor: "transparent",
    elevation: 0,
  },
  shakeButtonDisabled: {
    opacity: 0.5,
  },
  logoImage: {
    width: 220,
    height: 220,
    resizeMode: "contain",
  },
  shakeText: {
    marginTop: 36,
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
});
