import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Helper to open specific auth tab
  const openAuth = (tab: "login" | "register") => {
    setActiveTab(tab);
    setShowAuthScreen(true);
  };

  // 1. Not Logged In - Show Profile CTA (Landing)
  if (!user && !showAuthScreen) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>
            View and edit your Personal Information
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Profile Icon */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={80} color="#999" />
            </View>
          </View>

          {/* Call to Action */}
          <Text style={styles.ctaTitle}>Find Your Place</Text>
          <Text style={styles.ctaSubtitle}>
            Log in to save favorites and track your contributions.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => openAuth("login")}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => openAuth("register")}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // 2. Auth Screen (Login/Register Forms)
  if (!user && showAuthScreen) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header - FIXED */}
        <View style={styles.authHeader}>
          <TouchableOpacity
            onPress={() => setShowAuthScreen(false)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.authHeaderTitle}>Welcome to Kain Tayo!</Text>
        </View>

        {/* Content */}
        <View style={styles.authContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>🍜</Text>
            </View>
          </View>

          <Text style={styles.title}>Find the Best Places!</Text>

          {/* Tab Toggle */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "login" && styles.activeTab]}
              onPress={() => setActiveTab("login")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "login" && styles.activeTabText,
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === "register" && styles.activeTab]}
              onPress={() => setActiveTab("register")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "register" && styles.activeTabText,
                ]}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* Forms */}
          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
        </View>
      </ScrollView>
    );
  }

  // 3. Logged In State (Dashboard)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>
          Welcome back, {user?.username}!
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: "#FF6B35" }]}>
            <Text style={{ fontSize: 40, color: "#fff", fontWeight: "bold" }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.ctaTitle}>{user?.email}</Text>
        <Text style={styles.ctaSubtitle}>Role: {user?.role || "Student"}</Text>

        <TouchableOpacity style={styles.loginButton} onPress={() => logout()}>
          <Text style={[styles.loginButtonText, { color: "#FF4444" }]}>
            Log Out
          </Text>
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
  header: {
    backgroundColor: "#FF6B35",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  authHeader: {
    backgroundColor: "#FF6B35",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  authHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#fff",
    opacity: 0.8,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 30,
  },
  avatarContainer: {
    marginBottom: 30,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#c4c4c4",
    justifyContent: "center",
    alignItems: "center",
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
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    gap: 12,
  },
  loginButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  registerButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  authContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#d0d0d0",
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#FF6B35",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
});
