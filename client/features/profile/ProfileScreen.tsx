import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import LoginForm from "@/features/auth/components/LoginForm";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { styles } from "./profile.styles";

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
