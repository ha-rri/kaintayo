import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "../Skeleton";
import { theme } from "@/lib/theme";

export const ListItemSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Left: Text Content */}
      <View style={styles.content}>
        {/* Badge Row */}
        <View style={styles.badgeRow}>
          <Skeleton width={50} height={16} borderRadius={4} />
          <Skeleton width={60} height={16} borderRadius={4} />
        </View>

        {/* Title */}
        <Skeleton width="70%" height={20} style={{ marginBottom: 6 }} />

        {/* Subtitle */}
        <Skeleton width="40%" height={14} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12, // Matches Card Radius
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "transparent", // Consistency with actual cards if they have borders
    // Shadow simulation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
});
