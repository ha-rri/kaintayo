import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { User } from "@/types/User";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DashboardViewProps {
  user: User | null;
  onLogout: () => void;
}

export default function DashboardView({ user, onLogout }: DashboardViewProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (!user) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Uniform Orange Header */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>
            View and edit your Personal Information
          </Text>
        </View>

        {/* 2. Overlapping Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar & Info */}
          <View style={styles.userInfoRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {user.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.usernameText}>{user.username}</Text>
              <Text style={styles.emailText}>{user.email}</Text>
            </View>
          </View>

          {/* Account Management Menu */}
          <View style={styles.menuContainer}>
            <Text style={styles.sectionLabel}>ACCOUNT MANAGEMENT</Text>

            <ActionCard
              title="My Contributions"
              subtitle="View pending places and meals"
              icon="list"
              color="#FF6B35"
              onPress={() => router.push("/my-contributions")}
            />

            {user.role === "admin" && (
              <ActionCard
                title="Admin Panel"
                subtitle="Approve requests and manage users"
                icon="shield-checkmark"
                color="#4CAF50"
                onPress={() => router.push("/admin")}
              />
            )}

            <View style={styles.spacer} />

            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>v1.0.0 Student Edition</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// --- Helper Component: Action Card ---
interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

function ActionCard({
  title,
  subtitle,
  icon,
  color,
  onPress,
}: ActionCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#fff" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  // Uniform Header Style
  header: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24, // Consistent 24
    fontWeight: "700",
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  // Overlapping Card Style
  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    minHeight: 400,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 24,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#fff5ed",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 2,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
  },
  emailText: {
    fontSize: 14,
    color: "#666",
  },
  menuContainer: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    marginBottom: 12,
    letterSpacing: 1,
  },
  // Card Styles
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#888",
  },
  spacer: {
    height: 40,
  },
  // Logout
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF5252", // Clear red
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#FF5252",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  versionText: {
    textAlign: "center",
    marginTop: 20,
    color: "#ccc",
    fontSize: 12,
  },
});
