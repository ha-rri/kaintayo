import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "../styles/directory.styles";
import { Place } from "@/types/Place";

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
        {place.coverImage && (
          <Image source={{ uri: place.coverImage }} style={styles.cardImage} />
        )}
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
          <Text style={styles.cardLocation}>{place.zoneMicro}</Text>

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
