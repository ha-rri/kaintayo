import React from "react";
import { TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export const DebugOnboardingButton = () => {
  const router = useRouter();

  const handleResetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem("hasSeenOnboarding");
      Alert.alert("Debug", "Onboarding flag cleared! The app will reload.", [
        {
          text: "Reload App",
          onPress: () => router.replace("/"),
        },
      ]);
    } catch (error) {
      console.error("Failed to reset onboarding:", error);
      Alert.alert("Error", "Could not clear storage.");
    }
  };

  if (!__DEV__) return null; // Only show in development mode

  return (
    <TouchableOpacity
      onPress={handleResetOnboarding}
      style={styles.container}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>Debug: Reset Onboarding</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: "center",
    padding: 10,
  },
  text: {
    color: "#ccc",
    fontSize: 10,
    textAlign: "center",
  },
});
