import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../hooks/useFavorites";
import { PlaceCard } from "@/features/directory/components/PlaceCard"; // Re-using existing card
import { Place } from "@/types/Place";
import { PlaceDetailModal } from "@/features/directory/components/PlaceDetailModal";
import { Meal } from "@/types/Meal";

const FavoritesScreen = () => {
  const router = useRouter();
  const { data: favorites, isLoading } = useFavorites();
  const [selectedPlace, setSelectedPlace] = React.useState<Place | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const getAffordableMeals = (meals: Meal[]) => meals;

  const handlePress = (place: Place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* White Header as requested */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.center}>
          <Text>Loading favorites...</Text>
        </View>
      ) : !favorites || favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-dislike-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No favorites yet.</Text>
          <Text style={styles.emptySubtext}>
            Save places you love to see them here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            // Using the Shared PlaceCard
            <PlaceCard place={item} onPress={handlePress} />
          )}
        />
      )}

      {/* Detail Modal */}
      <PlaceDetailModal
        visible={modalVisible}
        place={selectedPlace}
        limit={9999} // Max limit to show all
        onClose={() => setModalVisible(false)}
        getAffordableMeals={getAffordableMeals}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1, // Optional subtle separator
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20, // Standard size
    fontWeight: "700",
    color: "#333",
  },
  listContent: {
    padding: 12, // Reduced from 16
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24, // Reduced from 32
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
  },
  emptySubtext: {
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
});

export default FavoritesScreen;
