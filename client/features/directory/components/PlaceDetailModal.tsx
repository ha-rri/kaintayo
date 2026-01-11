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
import { theme } from "@/lib/theme"; // Import theme

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
      // FIX: Use setQueriesData with { queryKey: ['places'] } to fuzzy match and update ALL place lists
      // This ensures both usePlaces({}) and usePlaces({ filter }) caches are updated.
      queryClient.setQueriesData(
        { queryKey: ["places"] },
        (oldPlaces: Place[] | undefined) => {
          if (!oldPlaces) return [];

          if (editType === "place") {
            // Update Place: Merge updated fields but PRESERVE existing meals
            // API only returns updated fields, not relations like meals
            return oldPlaces.map((p) =>
              p._id === updatedData._id
                ? { ...p, ...updatedData, meals: p.meals }
                : p
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
        }
      );
    } else {
      // Fallback
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
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={onClose}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.colors.text.light} // White
              />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              {isAdmin && (
                <TouchableOpacity
                  style={[styles.iconButton]}
                  onPress={handleEditPlace}
                >
                  <Ionicons
                    name="pencil"
                    size={20}
                    color={theme.colors.text.light} // White
                  />
                </TouchableOpacity>
              )}
              <FavoriteButton
                placeId={place._id}
                size={24}
                color={theme.colors.text.light} // White
              />
            </View>
          </View>
        </View>

        {/* Restaurant Info */}
        <ScrollView style={styles.modalContent}>
          <View style={styles.modalHeader}>
            {/* Title & Location (Left) */}
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={styles.modalTitle}>{place.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons
                  name="location-sharp"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles.modalLocation}>
                  {place.nearestLandmark}
                </Text>
              </View>
            </View>

            {/* Price Badge (Right) */}
            <View style={styles.modalPriceBadge}>
              <Text style={styles.modalPriceText}>
                ₱{place.priceRange.min} - ₱{place.priceRange.max}
              </Text>
            </View>
          </View>

          {/* Categories & Amenities Section */}
          <View style={styles.tagsSection}>
            {/* Categories */}
            {place.categories && place.categories.length > 0 && (
              <View style={styles.tagGroup}>
                <Text style={styles.sectionLabel}>CATEGORIES</Text>
                <View style={styles.pillsContainer}>
                  {place.categories.map((cat) => (
                    <View key={cat} style={styles.pill}>
                      <Text style={styles.pillText}>{cat}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Amenities */}
            {place.amenities && place.amenities.length > 0 && (
              <View style={styles.tagGroup}>
                <Text style={styles.sectionLabel}>AMENITIES</Text>
                <View style={styles.pillsContainer}>
                  {place.amenities.map((amenity) => (
                    <View key={amenity} style={styles.pill}>
                      <Text style={styles.pillText}>{amenity}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={styles.divider} />

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
                    {place.submittedBy &&
                      `\nby\u00A0@${place.submittedBy.username}`}
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    height: "90%",
    width: "100%",
    paddingBottom: 20,
    overflow: "hidden",
  },
  modalImageContainer: {
    position: "relative",
    height: 250,
    width: "100%",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: theme.colors.surface,
  },
  modalBackButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: theme.radius.xl,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  headerButtons: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.xl, // 20
    backgroundColor: "rgba(0,0,0,0.5)", // Dark transparent overlay
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalHeader: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg, // 20
    paddingBottom: 10,
    flexDirection: "row", // Horizontal layout
    justifyContent: "space-between", // Spread title and badge
    alignItems: "flex-start",
  },
  modalTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  modalLocation: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text.secondary,
  },

  tagsSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: 20,
  },
  tagGroup: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.text.disabled,
    letterSpacing: 1,
    marginBottom: 4,
  },
  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.lg,
  },
  pillText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.secondary,
  },
  modalPriceBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.radius.md,
    // alignSelf removed to allow flex positioning in header
    justifyContent: "center",
  },
  modalPriceText: {
    color: theme.colors.text.light,
    fontWeight: "700",
    fontSize: theme.fontSizes.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: 10, // Slight space
  },
  menuSection: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    paddingTop: 10,
  },
  menuTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: "700",
    color: theme.colors.text.primary,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 15,
    alignItems: "center",
  },
  menuItemIcon: {
    width: 60,
    height: 60,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.background,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    fontSize: theme.fontSizes.md,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  menuItemMeta: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.disabled,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  regularPrice: {
    fontSize: theme.fontSizes.md,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  halfPriceBadge: {
    backgroundColor: "#FFF0E6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "#FFDCC2",
  },
  halfPriceText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  mealEditBtn: {
    padding: 8,
  },
  noMealsContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noMealsText: {
    fontSize: theme.fontSizes.md,
    fontWeight: "600",
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  noMealsSubtext: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.disabled,
    textAlign: "center",
  },
  localToastPosition: {
    bottom: 50,
  },
});
