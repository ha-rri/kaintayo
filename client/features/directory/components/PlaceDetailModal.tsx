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
import { useAuth } from "@/features/auth/context/AuthContext"; // Speculative Fix: It's likely exported from context or a hook in auth feature
import { useQueryClient } from "@tanstack/react-query";
import { AdminEditModal } from "@/features/admin/components/AdminEditModal";

interface PlaceDetailModalProps {
  visible: boolean;
  place?: Place | null; // Allow null to match DirectoryScreen state
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
    showToast,
    visible: toastVisible,
    message: toastMessage,
    fadeAnim: toastFadeAnim,
  } = useToast();

  const { user } = useAuth();
  const queryClient = useQueryClient();
  // Simplified role check as per user instruction (only user and admin exist)
  const isAdmin = user?.role === "admin";

  // Edit State
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [editType, setEditType] = React.useState<"place" | "meal" | null>(null);
  const [editTarget, setEditTarget] = React.useState<Place | Meal | null>(null);

  if (!visible || !place) return null;

  const handleEditPlace = () => {
    setEditType("place");
    setEditTarget(place);
    setEditModalVisible(true);
  };

  const handleEditMeal = (meal: Meal) => {
    setEditType("meal");
    setEditTarget(meal);
    setEditModalVisible(true);
  };

  /* Hook moved to top level */

  const handleEditSuccess = (updatedData?: any) => {
    setEditModalVisible(false);

    // Manual Cache Update for Instant Feedback
    if (updatedData) {
      queryClient.setQueryData(["places"], (oldPlaces: Place[] | undefined) => {
        if (!oldPlaces) return [];

        if (editType === "place") {
          // Update Place: Replace the entire object
          return oldPlaces.map((p) =>
            p._id === updatedData._id ? updatedData : p
          );
        } else if (editType === "meal" && place) {
          // Update Meal: Find the place, then update the specific meal in its array
          return oldPlaces.map((p) => {
            if (p._id === place._id) {
              const updatedMeals = (p.meals || []).map((m) =>
                m._id === updatedData._id ? updatedData : m
              );
              return { ...p, meals: updatedMeals };
            }
            return p;
          });
        }
        return oldPlaces;
      });
    } else {
      // Fallback if no data returned (shouldn't happen with updated forms)
      queryClient.invalidateQueries({ queryKey: ["places"] });
    }

    showToast("Updated successfully", "success");
  };

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
          <View style={styles.headerActions}>
            {isAdmin && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={handleEditPlace}
              >
                <Ionicons name="pencil" size={20} color="#fff" />
              </TouchableOpacity>
            )}
            <FavoriteButton placeId={place._id} size={24} color="#fff" />
          </View>
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
                    Updated {formatRelativeTime(place.updatedAt)}
                  </Text>

                  {/* New Price Display: Regular First, Half as Badge */}
                  <View style={styles.priceContainer}>
                    <Text style={styles.regularPrice}>
                      ₱{meal.priceRegular}
                    </Text>
                    {meal.priceHalf && (
                      <View style={styles.halfPriceBadge}>
                        <Text style={styles.halfPriceText}>
                          ₱{meal.priceHalf} Half
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                {isAdmin && (
                  <TouchableOpacity
                    style={styles.mealEditBtn}
                    onPress={() => handleEditMeal(meal)}
                  >
                    <Ionicons name="pencil" size={16} color="#666" />
                  </TouchableOpacity>
                )}
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

        {/* Admin Edit Modal */}
        <AdminEditModal
          visible={editModalVisible}
          type={editType}
          target={editTarget}
          onClose={() => setEditModalVisible(false)}
          onSuccess={handleEditSuccess}
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
    resizeMode: "cover",
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
    zIndex: 10,
  },
  headerActions: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
    gap: 10,
    zIndex: 10,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  // modalHeartButton style is no longer needed as FavoriteButton is now inside headerActions
  modalContent: {
    flex: 1,
    padding: 20, // Added padding as per instruction
  },
  modalHeader: {
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginHorizontal: -20, // Compensate for modalContent padding
    marginTop: -20, // Compensate for modalContent padding
    marginBottom: 10,
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
    padding: 20,
    marginHorizontal: -20, // Compensate for modalContent padding
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
    alignItems: "center", // Align items vertically
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
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  regularPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF6B35",
  },
  halfPriceBadge: {
    backgroundColor: "#FFF0E6", // Light orange background for compatibility with primary color
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFDcc2",
  },
  halfPriceText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF6B35",
  },
  // Removed old price styles to keep clean
  mealEditBtn: {
    padding: 8,
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
