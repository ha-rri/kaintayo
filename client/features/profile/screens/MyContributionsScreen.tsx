import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // FIXED: Use safe-area-context
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/context/AuthContext";
import placeService from "@/features/directory/services/placeService";
import { Place } from "@/types/Place";

import { Meal } from "@/types/Meal";
import { mealService } from "@/features/directory/services/mealService";

export default function MyContributionsScreen() {
  const router = useRouter();
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>My Pending Contributions</Text>
          <Text style={styles.headerSubtitle}>
            Manage your pending submissions
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Pending Listings</Text>
        <Text style={styles.sectionDesc}>
          Items you submitted that are waiting for admin approval.
        </Text>

        {isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : combinedItems && combinedItems.length > 0 ? (
          <FlatList
            data={combinedItems}
            renderItem={renderItem as any}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="documents-outline" size={48} color="#ddd" />
            <Text style={styles.emptyText}>No pending items found.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: "#FF6B35", // Brand Orange
    elevation: 4,
  },
  backButton: {
    marginRight: 12,
    marginTop: 4, // Alleviate alignment with title
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 28,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
  },
  content: {
    padding: 16,
    flex: 1,
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
  list: {
    paddingBottom: 20,
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
