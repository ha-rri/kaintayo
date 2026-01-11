import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PendingItem } from "../hooks/usePendingItems";
import { theme } from "@/lib/theme";
import { AdminEditModal } from "./AdminEditModal";
import { useToast } from "@/features/common/context/ToastContext";
import { AppImage } from "@/components/ui/AppImage";

interface AdminReviewModalProps {
  visible: boolean;
  item: PendingItem | null;
  onClose: () => void;
  onApprove: (type: "place" | "meal", id: string) => void;
  onReject: (type: "place" | "meal", id: string) => void;
  onUpdate?: (updatedItem: any) => void; // Optional callback for instant updates
}

export default function AdminReviewModal({
  visible,
  item,
  onClose,
  onApprove,
  onReject,
  onUpdate,
}: AdminReviewModalProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const { showToast } = useToast();

  if (!item) return null;

  const isPlace = item.type === "place";
  // Safe image access
  const imageUrl = isPlace
    ? (item as any).startPhoto || (item as any).images?.[0]
    : (item as any).image;

  const name = isPlace ? (item as any).name : (item as any).title;
  const submittedBy =
    typeof item.submittedBy === "object"
      ? item.submittedBy?.username
      : "Unknown User";

  // Detailed Fields
  // Place Fields
  const zoneMacro = isPlace ? (item as any).zoneMacro : null;
  const nearestLandmark = isPlace ? (item as any).nearestLandmark : null;
  const amenities = isPlace ? (item as any).amenities || [] : [];
  const categories = isPlace ? (item as any).categories || [] : []; // Places have categories array

  // Meal Fields
  const priceRegular = !isPlace ? (item as any).priceRegular : null;
  const priceHalf = !isPlace ? (item as any).priceHalf : null;

  const handleApprove = () => {
    Alert.alert(
      "Approve Submission",
      "This will make the item visible to all users.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: () => {
            onApprove(item.type, item._id);
            onClose();
          },
        },
      ]
    );
  };

  const handleRejectAction = () => {
    Alert.alert(
      "Reject Submission",
      "This cannot be undone. The item will be deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            onReject(item.type, item._id);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose} // Fix for Android back button
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Review Submission</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <AppImage uri={imageUrl} style={styles.image} resizeMode="cover" />

          <View style={styles.details}>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.badge,
                  isPlace ? styles.badgePlace : styles.badgeMeal,
                ]}
              >
                <Text style={styles.badgeText}>
                  {isPlace ? "NEW PLACE" : "NEW MEAL"}
                </Text>
              </View>
              <Text style={styles.date}>
                {new Date(item.createdAt || "").toLocaleDateString()}
              </Text>
            </View>

            <Text style={styles.title}>{name}</Text>
            {!isPlace && (
              <Text style={styles.placeName}>
                at {(item as any).place?.name || "Unknown Place"}
              </Text>
            )}

            <Text style={styles.subtitle}>Submitted by @{submittedBy}</Text>

            {/* Description Section */}
            {(item as any).description && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Description</Text>
                <Text style={styles.sectionText}>
                  {(item as any).description}
                </Text>
              </View>
            )}

            {/* Place-Specific Details */}
            {isPlace && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Location</Text>

                {/* Zone */}
                <View style={[styles.row, { marginBottom: 8 }]}>
                  <Ionicons
                    name="map-outline"
                    size={16}
                    color="#666"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.infoText}>
                    {zoneMacro === "inside"
                      ? "Inside Campus"
                      : "Outside Campus"}
                  </Text>
                </View>

                {/* Landmark */}
                {nearestLandmark && (
                  <View style={styles.row}>
                    <Ionicons
                      name="navigate-circle-outline"
                      size={16}
                      color="#666"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.infoText}>{nearestLandmark}</Text>
                  </View>
                )}
              </View>
            )}

            {categories.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Categories</Text>
                <View style={styles.chipContainer}>
                  {categories.map((cat: string, index: number) => (
                    <View key={index} style={styles.chip}>
                      <Text style={styles.chipText}>{cat}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {isPlace && amenities.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Amenities</Text>
                <View style={styles.chipContainer}>
                  {amenities.map((amenity: any, index: number) => (
                    <View key={index} style={styles.chip}>
                      <Text style={styles.chipText}>
                        {typeof amenity === "string" ? amenity : amenity.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Meal-Specific Details */}
            {!isPlace && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Price</Text>
                <View style={styles.priceRow}>
                  <View>
                    <Text style={styles.priceLabel}>Regular</Text>
                    <Text style={styles.priceValue}>
                      {priceRegular ? `₱${priceRegular}` : "N/A"}
                    </Text>
                  </View>
                  <View style={{ width: 32 }} />
                  {/* Only show Half Order price if it exists */}
                  {priceHalf != null && (
                    <View>
                      <Text style={styles.priceLabel}>Half Order</Text>
                      <Text style={styles.priceValue}>{`₱${priceHalf}`}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="pencil" size={16} color="#fff" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={handleRejectAction}
          >
            <Ionicons name="close-circle-outline" size={20} color="#fff" />
            <Text style={styles.actionText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={handleApprove}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.actionText}>Approve</Text>
          </TouchableOpacity>
        </View>

        <AdminEditModal
          visible={isEditing}
          type={item.type}
          target={item as any}
          onClose={() => setIsEditing(false)}
          onSuccess={(updatedData) => {
            setIsEditing(false);
            if (updatedData && onUpdate) {
              onUpdate(updatedData);
            }
            showToast("Item updated successfully", "success");
            // Don't close the modal, keep it open to show updated data (handled by parent update)
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 100, // Space for footer
  },
  image: {
    width: "100%",
    height: 250,
    backgroundColor: theme.colors.border,
  },
  details: {
    padding: theme.spacing.md,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  badgePlace: { backgroundColor: "#E3F2FD" },
  badgeMeal: { backgroundColor: "#FFF3E0" },
  badgeText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  date: {
    color: theme.colors.text.disabled,
    fontSize: theme.fontSizes.xs,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: "700",
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  placeName: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    fontWeight: "500",
  },
  category: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary,
    marginBottom: 2,
    fontWeight: "600",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionLabel: {
    fontSize: theme.fontSizes.sm,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  sectionText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text.primary,
    lineHeight: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.primary,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.xl,
  },
  chipText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
  },
  priceRow: {
    flexDirection: "row",
  },
  priceLabel: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.disabled,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: theme.fontSizes.lg,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    gap: 6,
  },
  rejectButton: { backgroundColor: theme.colors.status.error },
  approveButton: { backgroundColor: theme.colors.status.success },
  editButton: { backgroundColor: theme.colors.status.warning },
  actionText: {
    color: theme.colors.text.light,
    fontSize: theme.fontSizes.sm,
    fontWeight: "600",
  },
});
