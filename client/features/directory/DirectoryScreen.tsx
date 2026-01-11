import {
  View,
  Text,
  FlatList,
  Keyboard,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo, useEffect, useCallback } from "react";
import { theme } from "@/lib/theme";
import { useInfinitePlaces } from "./hooks/useInfinitePlaces";
import { useDebounce } from "@/hooks/useDebounce";
import { DirectoryHeader } from "./components/DirectoryHeader";
import { DirectoryFilters } from "./components/DirectoryFilters";
import { FilterModal, FilterState } from "@/components/ui/FilterModal";
import { PlaceCard } from "./components/PlaceCard";
import { PlaceDetailModal } from "./components/PlaceDetailModal";
import { PlaceCardSkeleton } from "@/components/ui/skeletons/PlaceCardSkeleton";
import { Place } from "@/types/Place";
import { Meal } from "@/types/Meal";

export default function DirectoryScreen() {
  const [limit, setLimit] = useState(150);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Additional Filter State
  const [categories, setCategories] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);

  // Server-Side Filtering
  const filters: any = {};
  if (activeCategory === "Inside Campus") filters.zoneMacro = "inside";
  if (activeCategory === "Outside Campus") filters.zoneMacro = "outside";
  if (categories.length > 0) filters.categories = categories;
  if (amenities.length > 0) filters.amenities = amenities;
  if (debouncedSearch) filters.search = debouncedSearch;

  // Use Infinite Query Hook
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePlaces(filters);

  // Flatten Pages
  const allPlaces = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  // Sync selectedPlace with fresh data
  useEffect(() => {
    if (selectedPlace) {
      const freshData = allPlaces.find((p) => p._id === selectedPlace._id);
      if (freshData) {
        setSelectedPlace(freshData);
      }
    }
  }, [allPlaces, selectedPlace]);

  // Client-Side Filtering (Price) - Applied to the flattened list
  const filteredPlaces = useMemo(() => {
    return allPlaces.filter((place) => place.priceRange.min <= limit);
  }, [allPlaces, limit]);

  const handleSearch = useCallback(() => {
    console.log("Searching for:", searchQuery);
    Keyboard.dismiss();
  }, [searchQuery]);

  const openRestaurantModal = (place: Place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlace(null);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setLimit(newFilters.limit);
    if (newFilters.zoneMacro === "inside") setActiveCategory("Inside Campus");
    else if (newFilters.zoneMacro === "outside")
      setActiveCategory("Outside Campus");
    else setActiveCategory("All");

    setCategories(newFilters.categories);
    setAmenities(newFilters.amenities);
  };

  const getAffordableMeals = (meals: Meal[]) => {
    return meals.filter((meal) => meal.priceRegular <= limit);
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Render Functions
  const headerContent = useMemo(
    () => (
      <View>
        <DirectoryHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
        <DirectoryFilters
          limit={limit}
          setLimit={setLimit}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onFilterPress={() => setFilterModalVisible(true)}
        />

        {/* Results Count / Status */}
        <View style={styles.resultsCount}>
          {!isLoading && (
            <Text style={styles.resultsText}>
              {filteredPlaces.length}{" "}
              {filteredPlaces.length === 1 ? "place" : "places"} visible
              {/* Note: Total count might be higher due to server pagination, 
                 but "visible" is accurate for client-side price filter context */}
            </Text>
          )}
        </View>
      </View>
    ),
    [
      searchQuery,
      limit,
      activeCategory,
      isLoading,
      filteredPlaces.length,
      handleSearch,
    ]
  );

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      );
    }
    return <View style={{ height: 20 }} />; // Bottom padding
  };

  const renderEmpty = () => {
    if (isLoading) {
      // Show Skeletons while initial loading
      return (
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          <PlaceCardSkeleton />
          <PlaceCardSkeleton />
          <PlaceCardSkeleton />
        </View>
      );
    }

    // Actual Empty State
    return (
      <View style={styles.emptyState}>
        <Ionicons name="sad-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No places found!</Text>
        <Text style={styles.emptySubtitle}>
          {searchQuery
            ? `Try searching for something else.`
            : `Try adjusting your budget or filters.`}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={isLoading ? [] : filteredPlaces} // Use empty array if loading to trigger EmptyComponent (which has skeletons) OR handle skeletons via loading check
        // Better: Pass empty data when loading, let ListEmptyComponent handle skeletons
        renderItem={({ item }) => (
          <PlaceCard place={item} onPress={openRestaurantModal} />
        )}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={headerContent}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled" // Improve search UX
      />

      <PlaceDetailModal
        visible={modalVisible}
        place={selectedPlace}
        limit={limit}
        onClose={closeModal}
        getAffordableMeals={getAffordableMeals}
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        initialFilters={{
          limit,
          zoneMacro:
            activeCategory === "Inside Campus"
              ? "inside"
              : activeCategory === "Outside Campus"
              ? "outside"
              : "all",
          categories,
          amenities,
        }}
        maxPrice={300}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  resultsCount: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  resultsText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: "600",
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: "center",
    marginTop: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginTop: theme.spacing.md,
  },
  emptySubtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
