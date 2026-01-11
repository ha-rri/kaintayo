import {
  View,
  Text,
  Keyboard,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
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

  // Debounce Limit (Price) to prevent API spam
  const debouncedLimit = useDebounce(limit, 500);

  // Server-Side Filtering
  const filters: any = {};
  if (activeCategory === "Inside Campus") filters.zoneMacro = "inside";
  if (activeCategory === "Outside Campus") filters.zoneMacro = "outside";
  if (categories.length > 0) filters.categories = categories;
  if (amenities.length > 0) filters.amenities = amenities;
  if (debouncedSearch) filters.search = debouncedSearch;
  // Add Max Price Filter (Server-Side)
  filters.maxPrice = debouncedLimit;

  // Use Infinite Query Hook
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePlaces(filters);

  // Buffered Loading (Prevent Skeleton Flash)
  const [bufferedLoading, setBufferedLoading] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setBufferedLoading(true);
    } else {
      // If loading finishes, keep showing skeleton for a bit to prevent flash
      const timer = setTimeout(() => {
        setBufferedLoading(false);
      }, 500); // 500ms minimum duration
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Flatten Data
  // Removed client-side filtering for price, relying on server-side 'filters' now
  const allPlaces = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const totalCount = data?.pages?.[0]?.meta?.total || 0;

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
  // Data Construction for Sticky Header
  const listData = useMemo(() => {
    // Item 0: Search Header (Scrolls away)
    // Item 1: Filter Header (Static In-List)
    const items: any[] = [{ type: "search-header" }, { type: "filter-header" }];

    if (bufferedLoading) {
      // Loading Skeletons
      items.push(
        { type: "skeleton", id: "s1" },
        { type: "skeleton", id: "s2" },
        { type: "skeleton", id: "s3" }
      );
    } else if (filteredPlaces.length === 0) {
      // Empty State
      items.push({ type: "empty" });
    } else {
      // Actual Places
      items.push(...filteredPlaces.map((p) => ({ type: "place", data: p })));
    }

    return items;
  }, [bufferedLoading, filteredPlaces]);

  // Animated Sticky Header Logic
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerHeight, setHeaderHeight] = useState(130); // Default estimate

  // Interpolate translateY to snap the sticky header in/out
  const stickyHeaderTranslateY = scrollY.interpolate({
    inputRange: [headerHeight - 21, headerHeight - 20], // Threshold
    outputRange: [-1000, 0], // Hide off-screen -> Snap to top
    extrapolate: "clamp",
  });

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      switch (item.type) {
        case "search-header":
          return (
            <View
              onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
            >
              <DirectoryHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
              />
            </View>
          );
        case "filter-header":
          return (
            <View
              style={{ backgroundColor: theme.colors.background, zIndex: 1 }}
            >
              <DirectoryFilters
                limit={limit}
                setLimit={setLimit}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                onFilterPress={() => setFilterModalVisible(true)}
                variant="static" // Standard Curve
              />
              <View style={styles.resultsCount}>
                {bufferedLoading ? (
                  <View
                    style={{
                      height: 14,
                      width: 100,
                      backgroundColor: "#E1E9EE",
                      borderRadius: 4,
                    }}
                  />
                ) : (
                  <Text style={styles.resultsText}>
                    {totalCount} {totalCount === 1 ? "place" : "places"} found
                  </Text>
                )}
              </View>
            </View>
          );
        case "skeleton":
          return (
            <View style={{ paddingHorizontal: theme.spacing.md }}>
              <PlaceCardSkeleton />
            </View>
          );
        case "empty":
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
        case "place":
          return <PlaceCard place={item.data} onPress={openRestaurantModal} />;
        default:
          return null;
      }
    },
    [
      limit,
      activeCategory,
      searchQuery,
      handleSearch,
      bufferedLoading,
      totalCount,
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
    return <View style={{ height: 20 }} />;
  };

  return (
    <View style={styles.container}>
      {/* Animated Sticky Header Overlay */}
      <Animated.View
        style={[
          styles.stickyOverlay,
          { transform: [{ translateY: stickyHeaderTranslateY }] },
        ]}
      >
        <DirectoryFilters
          limit={limit}
          setLimit={setLimit}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onFilterPress={() => setFilterModalVisible(true)}
          variant="sticky" // Safe Area + Flat Top
        />
      </Animated.View>

      <Animated.FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.type === "place" ? item.data._id : item.type + index
        }
        ListFooterComponent={renderFooter}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16} // 60fps
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
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
  stickyOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100, // Top of everything
    backgroundColor: theme.colors.surface, // Use Surface (White) to match content
    // Shadows
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});
