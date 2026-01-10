import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  const imageUrl = isPlace
    ? (item as any).startPhoto || (item as any).images?.[0]
    : (item as any).image;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <Image
        source={{ uri: imageUrl || "https://via.placeholder.com/150" }}
        style={styles.image}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <View
            style={[
              styles.typeBadge,
              isPlace ? styles.bgOrange : styles.bgGreen,
            ]}
          >
            <Text
              style={[
                styles.typeBadgeText,
                isPlace ? styles.textOrange : styles.textGreen,
              ]}
            >
              {isPlace ? "STORE" : "MEAL"}
            </Text>
          </View>
          <Text style={styles.date}>
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
          <Ionicons name="chevron-forward" size={16} color="#FF6B35" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // New Pill Styles
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  bgOrange: { backgroundColor: "#fff5ed", borderColor: "#FF6B35" },
  bgGreen: { backgroundColor: "#e8f5e9", borderColor: "#4CAF50" },
  typeBadgeText: { fontSize: 10, fontWeight: "700" },
  textOrange: { color: "#FF6B35" },
  textGreen: { color: "#4CAF50" },

  date: {
    fontSize: 10,
    color: "#999",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
  placeName: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "500",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 4,
  },
  reviewText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF6B35",
  },
});
