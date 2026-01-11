import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppImage } from "@/components/ui/AppImage";
import { theme } from "@/lib/theme"; // Import theme
import { PendingItem } from "../hooks/usePendingItems";

interface PendingItemCardProps {
  item: PendingItem;
  onPress: (item: PendingItem) => void;
}

export default function PendingItemCard({
  item,
  onPress,
}: PendingItemCardProps) {
  const isPlace = item.type === "place";
  // Check for imageUri (standard), startPhoto/images (legacy places), or image (legacy meals)
  const imageUrl = isPlace
    ? (item as any).startPhoto ||
      (item as any).images?.[0] ||
      (item as any).coverImage
    : (item as any).imageUri || (item as any).image;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <AppImage uri={imageUrl} style={styles.image} optimizeWidth={200} />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View
            style={[
              styles.badge,
              isPlace ? styles.badgePlace : styles.badgeMeal,
            ]}
          >
            <Text style={styles.badgeText}>{isPlace ? "STORE" : "MEAL"}</Text>
          </View>
          <Text style={styles.dateText}>
            {new Date(item.createdAt || "").toLocaleDateString()}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {isPlace ? (item as any).name : (item as any).title}
        </Text>
        {!isPlace && (
          <Text style={styles.placeName} numberOfLines={1}>
            at {(item as any).place?.name || "Unknown Place"}
          </Text>
        )}
        <Text style={styles.subtitle} numberOfLines={1}>
          Submitted by:{" "}
          {typeof item.submittedBy === "object"
            ? item.submittedBy?.username
            : "Unknown"}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.reviewText}>Review Submission</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme.colors.primary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: "row",
    shadowColor: theme.shadows.sm.shadowColor,
    shadowOffset: theme.shadows.sm.shadowOffset,
    shadowOpacity: theme.shadows.sm.shadowOpacity,
    shadowRadius: theme.shadows.sm.shadowRadius,
    elevation: theme.shadows.sm.elevation,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.border,
    marginRight: theme.spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  badgePlace: {
    backgroundColor: "#E3F2FD",
  },
  badgeMeal: {
    backgroundColor: "#FFF3E0",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  title: {
    fontSize: theme.fontSizes.sm,
    fontWeight: "700",
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  subtitle: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  placeName: {
    fontSize: theme.fontSizes.xs,
    fontWeight: "500",
    marginBottom: 2,
    color: theme.colors.primary,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.secondary,
  },
  dateText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text.disabled,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 4,
  },
  reviewText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});
