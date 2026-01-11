import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "../Skeleton";
import { theme } from "@/lib/theme";

export const PlaceCardSkeleton = () => {
  return (
    <View style={styles.card}>
      {/* Image Placeholder */}
      <Skeleton width="100%" height={150} borderRadius={theme.radius.md} />

      {/* Content */}
      <View style={styles.content}>
        {/* Title & Badge Row */}
        <View style={styles.row}>
          <Skeleton width="60%" height={24} />
          <Skeleton width={60} height={20} borderRadius={12} />
        </View>

        {/* Info Row (Location/Price) */}
        <View style={[styles.row, { marginTop: 8 }]}>
          <Skeleton width="40%" height={16} />
          <Skeleton width="30%" height={16} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    padding: theme.spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
