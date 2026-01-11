import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ContributeForm } from "./components/ContributeForm";

export const ContributeScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { paddingTop: insets.top },
        ]}
      >
        <Ionicons name="restaurant-outline" size={80} color="#ddd" />
        <Text style={styles.guestTitle}>Join the Community</Text>
        <Text style={styles.guestSubtitle}>
          Log in to share your favorite food spots and discoveries with the
          campus.
        </Text>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Text style={styles.actionBtnText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Authenticated View
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={100}
        enableAutomaticScroll={true}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.headerTitle}>iShare Mo!</Text>
          <Text style={styles.headerSubtitle}>
            Found something new? Share it now!
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <ContributeForm />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  formCard: {
    backgroundColor: "#fff",
    marginTop: -20, // Overlap effect
    marginHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  // Guest Styles
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 24,
    marginBottom: 8,
  },
  guestSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  actionBtn: {
    backgroundColor: "#FF6B35",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
