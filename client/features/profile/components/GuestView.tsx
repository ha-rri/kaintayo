import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../profile.styles";

interface GuestViewProps {
  onLoginPress: () => void;
  onRegisterPress: () => void;
}

export default function GuestView({
  onLoginPress,
  onRegisterPress,
}: GuestViewProps) {
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
          <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={onRegisterPress}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
