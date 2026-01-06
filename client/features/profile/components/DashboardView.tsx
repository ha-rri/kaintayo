import { View, Text, TouchableOpacity } from "react-native";
import { User } from "@/types/User";
import { styles } from "../profile.styles";

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
          Welcome back, {user.username}!
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: "#FF6B35" }]}>
            <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>
              {user.username.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.ctaTitle}>{user.email}</Text>
        <Text style={styles.ctaSubtitle}>Role: {user.role || "Student"}</Text>

        <TouchableOpacity style={styles.loginButton} onPress={onLogout}>
          <Text style={[styles.loginButtonText, { color: "#FF4444" }]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
