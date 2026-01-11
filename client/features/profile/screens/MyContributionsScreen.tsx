import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/context/AuthContext";
import placeService from "@/features/directory/services/placeService";
import { Place } from "@/types/Place";
import { ScreenHeader } from "@/components/ui/ScreenHeader";

import { Meal } from "@/types/Meal";
import { mealService } from "@/features/directory/services/mealService";
import { ListItemSkeleton } from "@/components/ui/skeletons/ListItemSkeleton";

export default function MyContributionsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // Fetch My Pending Places
  const { data: places, isLoading: isLoadingPlaces } = useQuery({
    queryKey: ["my-places", user?._id],
    queryFn: () => placeService.getMyPending(),
    enabled: !!user,
  });

  // Fetch My Pending Meals
  const { data: meals, isLoading: isLoadingMeals } = useQuery({
    queryKey: ["my-meals", user?._id],
    queryFn: () => mealService.getMyPending(),
    enabled: !!user,
  });

  // Combine and Sort: Places First, then Meals. Within group: Newest First
  const combinedItems = React.useMemo(() => {
    const pList = places?.map((p) => ({ ...p, type: "place" as const })) || [];
    const mList = meals?.map((m) => ({ ...m, type: "meal" as const })) || [];

    // Sort each list by date first
    pList.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );
    mList.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

    // Concatenate: Places first
    return [...pList, ...mList];
  }, [places, meals]);

  const isLoading = isLoadingPlaces || isLoadingMeals;

  const renderItem = ({ item }: { item: Place | Meal }) => {
    // Discriminate type
    const isPlace = (item as any).type === "place";
    const title = isPlace ? (item as Place).name : (item as Meal).title;

    let subtitle = "Unknown";
    if (isPlace) {
      subtitle = "Waiting for approval";
    } else {
      const m = item as Meal;
      const pName =
        typeof m.place === "object" ? m.place.name : "Unknown Place";
      subtitle = `For ${pName}`;
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PENDING</Text>
            </View>
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
          </View>

          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        {/* Chevron removed since interaction is disabled */}
      </View>
    );
  };

  const renderListHeader = () => (
    <View style={styles.headerContent}>
      <Text style={styles.sectionTitle}>Pending Listings</Text>
      <Text style={styles.sectionDesc}>
        Items you submitted waiting for admin approval.
      </Text>
    </View>
  );

  // ...

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={{ marginTop: 16 }}>
          <ListItemSkeleton />
          <ListItemSkeleton />
          <ListItemSkeleton />
        </View>
      );
    }
    // ...
    return (
      <View style={styles.emptyState}>
        <Ionicons name="documents-outline" size={48} color="#ddd" />
        <Text style={styles.emptyText}>No pending items found.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="My Pending Contributions" />
      <FlatList
        data={combinedItems}
        renderItem={renderItem as any}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + 20 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  // Header styles removed
  headerContent: {
    marginBottom: 0,
    padding: 16,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 20,
    flexGrow: 1, // Ensures Empty State centers properly if needed
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "#FFF3E0",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FF6B35",
  },
  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  bgOrange: { backgroundColor: "#fff5ed", borderColor: "#FF6B35" },
  bgGreen: { backgroundColor: "#e8f5e9", borderColor: "#4CAF50" },
  textOrange: { color: "#FF6B35", fontSize: 10, fontWeight: "700" },
  textGreen: { color: "#4CAF50", fontSize: 10, fontWeight: "700" },
  typeBadgeText: {},
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#888",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: {
    marginTop: 12,
    color: "#999",
  },
  debugBox: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  debugText: {
    color: "#0f0", // Matrix Green
    fontSize: 12,
    fontFamily: "monospace",
  },
});
