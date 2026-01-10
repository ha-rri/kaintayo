import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Place } from "@/types/Place";
import { Meal } from "@/types/Meal";
import { formatRelativeTime } from "@/lib/dateUtils";
import { FavoriteButton } from "@/features/common/components/FavoriteButton";
import { useToast, ToastUI } from "@/features/common/context/ToastContext";
import { AppImage } from "@/components/ui/AppImage";

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
  const {
    visible: toastVisible,
    message: toastMessage,
    fadeAnim: toastFadeAnim,
  } = useToast();

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
          <AppImage
            uri={place.coverImage}
            style={styles.modalImage}
            optimizeWidth={800}
          />
          <TouchableOpacity style={styles.modalBackButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <FavoriteButton placeId={place._id} style={styles.modalHeartButton} />
        </View>

        {/* Restaurant Info */}
        <ScrollView style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{place.name}</Text>
              <Text style={styles.modalLocation}>{place.nearestLandmark}</Text>
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
                <AppImage
                  uri={meal.imageUri}
                  style={styles.menuItemIcon}
                  optimizeWidth={200}
                />
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

        {/* Reusable Toast for Modal Visibility */}
        <ToastUI
          visible={toastVisible}
          message={toastMessage}
          fadeAnim={toastFadeAnim}
          style={styles.localToastPosition}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  modalImageContainer: {
    position: "relative",
    height: 250,
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  modalBackButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeartButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // Ensure it's clickable above the image
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  modalLocation: {
    fontSize: 14,
    color: "#666",
  },
  modalPriceBadge: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalPriceText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  menuSection: {
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 15,
  },
  menuItemIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  menuItemMeta: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  noMealsContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noMealsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  noMealsSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  localToastPosition: {
    bottom: 50, // Slightly higher than tab bar
  },
});
