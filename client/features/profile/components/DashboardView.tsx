import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { User } from "@/types/User";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface DashboardViewProps {
  user: User | null;
  onLogout: () => void;
}

export default function DashboardView({ user, onLogout }: DashboardViewProps) {
  const router = useRouter();
  if (!user) return null; // Should be handled by parent, but safety first

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>
          View and edit your Personal Information
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.ctaTitle}>Welcome back!</Text>

        {/* Add logged-in content here later */}

        {user.role === "admin" && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => router.push("/admin" as any)}
          >
            <Ionicons name="shield-checkmark" size={20} color="#fff" />
            <Text style={styles.adminButtonText}>Admin Panel</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8e8e8",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 30,
  },
  header: {
    backgroundColor: "#FF6B35",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "column",
    alignItems: "flex-start",
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
  ctaTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  ctaSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  adminButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    width: "100%",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  adminButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
