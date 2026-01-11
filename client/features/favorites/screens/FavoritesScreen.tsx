import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../hooks/useFavorites";
import { PlaceCard } from "@/features/directory/components/PlaceCard"; // Re-using existing card
import { Place } from "@/types/Place";
import { PlaceDetailModal } from "@/features/directory/components/PlaceDetailModal";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Meal } from "@/types/Meal";
import { theme } from "@/lib/theme";
import { PlaceCardSkeleton } from "@/components/ui/skeletons/PlaceCardSkeleton";

const FavoritesScreen = () => {
  const insets = useSafeAreaInsets();
  const { data: favorites, isLoading } = useFavorites();
  const [selectedPlace, setSelectedPlace] = React.useState<Place | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const getAffordableMeals = (meals: Meal[]) => meals;

  const handlePress = (place: Place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Favorites" />
      {/* List */}
      {isLoading ? (
        <View
          style={[styles.listContent, { paddingHorizontal: theme.spacing.md }]}
        >
          <PlaceCardSkeleton />
          <PlaceCardSkeleton />
          <PlaceCardSkeleton />
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
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // Header styles removed (replaced by ScreenHeader)
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 0,
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
