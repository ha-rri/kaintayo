import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Place } from "@/types/Place";
import { AppImage } from "@/components/ui/AppImage";

interface PlaceCardProps {
  place: Place;
  onPress: (place: Place) => void;
}

export const PlaceCard = ({ place, onPress }: PlaceCardProps) => {
  // Safe Access to fields that might differ from mock vs real (though we standardized them)
  // We use the Place interface which matches our new data structure

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} onPress={() => onPress(place)}>
        <AppImage
          uri={place.coverImage}
          style={styles.cardImage}
          optimizeWidth={400}
        />
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>
            ₱{place.priceRange.min} - ₱{place.priceRange.max}
          </Text>
        </View>
        <View style={styles.cardContent}>
          {/* Categories are arrays now, grab the first one or join them */}
          {place.categories && place.categories.length > 0 && (
            <View style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{place.categories[0]}</Text>
            </View>
          )}

          <Text style={styles.cardTitle}>{place.name}</Text>
          <Text style={styles.cardLocation}>{place.nearestLandmark}</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContainer}
            style={{ flexGrow: 0 }} // Prevent it from expanding indefinitely vertically
          >
            {/* Display amenities/categories as tags */}
            {[...(place.categories || []), ...(place.amenities || [])].map(
              (tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              )
            )}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#e0e0e0",
  },
  cardBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cardBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  cardContent: {
    padding: 15,
  },
  categoryChip: {
    backgroundColor: "#FF6B35",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryChipText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: "#666",
  },
});
