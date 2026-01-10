import { Stack, useRouter } from "expo-router";
import { useAuth } from "../../features/auth/context/AuthContext";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

export default function AdminLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in
        router.replace("/(tabs)/profile");
      } else if (user.role !== "admin") {
        // Logged in but not admin
        router.replace("/(tabs)");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "admin") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
