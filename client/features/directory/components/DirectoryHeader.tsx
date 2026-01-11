import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { theme } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DirectoryHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
}

export const DirectoryHeader = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
}: DirectoryHeaderProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
      <View style={styles.headerTop}>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={20} color={theme.colors.text.light} />
          <Text style={styles.locationText}>Cavite State University</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/favorites")}>
          <Ionicons
            name="heart-outline"
            size={28}
            color={theme.colors.text.light}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.text.disabled} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for your favorite kaninan!"
          placeholderTextColor={theme.colors.text.disabled}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.colors.text.disabled}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 40,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  locationText: {
    color: theme.colors.text.light,
    fontSize: theme.fontSizes.sm,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 15,
    paddingVertical: 6,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.primary,
  },
});
