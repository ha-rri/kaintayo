import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Place } from "@/types/Place";
import { AppImage } from "@/components/ui/AppImage";
import { theme } from "@/lib/theme";

interface PlaceCardProps {
  place: Place;
  onPress: (place: Place) => void;
}

export const PlaceCard = ({ place, onPress }: PlaceCardProps) => {
  // Safe Access to fields that might differ from mock vs real (though we standardized them)
  // We use the Place interface which matches our new data structure

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(place)}
        accessibilityRole="button"
        accessibilityHint={`Double tap to view details for ${place.name}`}
        accessibilityLabel={`${place.name}, located at ${
          place.nearestLandmark || "unknown location"
        }. Price range ${place.priceRange.min} to ${
          place.priceRange.max
        } pesos. Categories: ${(place.categories || []).join(", ")}`}
      >
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
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    shadowColor: theme.shadows.md.shadowColor,
    shadowOffset: theme.shadows.md.shadowOffset,
    shadowOpacity: theme.shadows.md.shadowOpacity,
    shadowRadius: theme.shadows.md.shadowRadius,
    elevation: theme.shadows.md.elevation,
  },
  cardImage: {
    width: "100%",
    height: 200,
    backgroundColor: theme.colors.border,
  },
  cardBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.radius.md,
  },
  cardBadgeText: {
    color: theme.colors.text.light,
    fontWeight: "700",
    fontSize: theme.fontSizes.xs,
  },
  cardContent: {
    padding: theme.spacing.md,
  },
  categoryChip: {
    backgroundColor: theme.colors.primary,
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.xs,
  },
  categoryChipText: {
    color: theme.colors.text.light,
    fontSize: theme.fontSizes.xs,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: "700",
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.lg,
  },
  tagText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.secondary,
  },
});
