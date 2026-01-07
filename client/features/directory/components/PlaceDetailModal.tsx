import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/directory.styles";
import { Place } from "@/types/Place";
import { Meal } from "@/types/Meal";
import { formatRelativeTime } from "@/lib/dateUtils";

interface PlaceDetailModalProps {
  visible: boolean;
  place: Place | null;
  limit: number;
  onClose: () => void;
  getAffordableMeals: (meals: Meal[]) => Meal[];
}

export const PlaceDetailModal = ({
  visible,
  place,
  limit,
  onClose,
  getAffordableMeals,
}: PlaceDetailModalProps) => {
  if (!place) return null;

  // Ensure meals exists (it might be undefined if not populated/fetched)
  const meals = place.meals || [];
  const affordableMeals = getAffordableMeals(meals);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Restaurant Image Header */}
        <View style={styles.modalImageContainer}>
          {place.coverImage && (
            <Image
              source={{ uri: place.coverImage }}
              style={styles.modalImage}
            />
          )}
          <TouchableOpacity style={styles.modalBackButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalHeartButton}>
            <Ionicons name="heart-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Restaurant Info */}
        <ScrollView style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{place.name}</Text>
              <Text style={styles.modalLocation}>{place.zoneMicro}</Text>
            </View>
            <View style={styles.modalPriceBadge}>
              <Text style={styles.modalPriceText}>
                ₱{place.priceRange.min} - ₱{place.priceRange.max}
              </Text>
            </View>
          </View>

          {/* Student Menu Section */}
          <View style={styles.menuSection}>
            <Text style={styles.menuTitle}>Student Menu</Text>

            {affordableMeals.map((meal) => (
              <View key={meal._id} style={styles.menuItem}>
                <View style={styles.menuItemIcon} />
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemName}>{meal.title}</Text>
                  <Text style={styles.menuItemMeta}>
                    {/* Display Updated Time */}
                    Updated {formatRelativeTime(place.updatedAt)}
                    {place.submittedBy && ` by @${place.submittedBy.username}`}
                  </Text>
                  <Text style={styles.menuItemPrice}>₱{meal.priceRegular}</Text>
                </View>
              </View>
            ))}

            {affordableMeals.length === 0 && (
              <View style={styles.noMealsContainer}>
                <Text style={styles.noMealsText}>
                  No meals within your ₱{limit} budget
                </Text>
                <Text style={styles.noMealsSubtext}>
                  Try increasing your limit to see more options
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
