import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import LoginForm from "@/features/auth/components/LoginForm";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { styles } from "../profile.styles";

interface AuthViewProps {
  initialTab: "login" | "register";
  onBack: () => void;
}

export default function AuthView({ initialTab, onBack }: AuthViewProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* Header */}
      <View style={styles.authHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
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
