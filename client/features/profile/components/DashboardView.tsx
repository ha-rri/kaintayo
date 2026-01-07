import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { User } from "@/types/User";

interface DashboardViewProps {
  user: User | null;
  onLogout: () => void;
}

export default function DashboardView({ user, onLogout }: DashboardViewProps) {
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
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#fff",
    opacity: 0.8,
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
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
