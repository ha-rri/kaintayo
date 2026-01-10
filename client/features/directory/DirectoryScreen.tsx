import { View, Text, ScrollView, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo, useEffect } from "react";
import { styles } from "./styles/directory.styles";
import { usePlaces } from "./hooks/usePlaces";
import { useDebounce } from "@/hooks/useDebounce";
import { DirectoryHeader } from "./components/DirectoryHeader";
import { DirectoryFilters } from "./components/DirectoryFilters";
import { FilterModal, FilterState } from "@/components/ui/FilterModal";
import { PlaceCard } from "./components/PlaceCard";
import { PlaceDetailModal } from "./components/PlaceDetailModal";
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

  // Server-Side Filtering:
  // Fetch based on Category (Zone) and Search Query to reduce payload and handle indexing.
  const filters: any = {};
  if (activeCategory === "Inside Campus") filters.zoneMacro = "inside";
  if (activeCategory === "Outside Campus") filters.zoneMacro = "outside";
  if (categories.length > 0) filters.categories = categories;
  if (amenities.length > 0) filters.amenities = amenities;
  if (debouncedSearch) filters.search = debouncedSearch;
  // Note: We don't need to pass maxPrice here if we filter client-side,
  // BUT if we want to support server-side filtering fully later, we can add it.
  // For now, consistent with original code (client side Price), we don't pass limit to API query unless refactoring completely.
  // However, based on requirements, I'll stick to the hybrid approach but ensure 'limit' from modal updates our local limit state.

  const { data: places = [], isLoading } = usePlaces(filters);

  // Sync selectedPlace with fresh data when places update (e.g. after edit)
  useEffect(() => {
    if (selectedPlace) {
      const freshData = places.find((p) => p._id === selectedPlace._id);
      if (freshData) {
        setSelectedPlace(freshData);
      }
    }
  }, [places, selectedPlace]);

  // Client-Side Filtering (Price):
  // Filter locally to maintain immediate responsiveness for the slider (no network lag).
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => place.priceRange.min <= limit);
  }, [places, limit]);

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Hook automatically triggers on searchQuery change
    Keyboard.dismiss();
  };

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
    // Map zoneMacro to UI state
    if (newFilters.zoneMacro === "inside") setActiveCategory("Inside Campus");
    else if (newFilters.zoneMacro === "outside")
      setActiveCategory("Outside Campus");
    else setActiveCategory("All");

    setCategories(newFilters.categories);
    setAmenities(newFilters.amenities);
  };

  // Filter meals within price limit
  const getAffordableMeals = (meals: Meal[]) => {
    return meals.filter((meal) => meal.priceRegular <= limit);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <DirectoryHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />

        {/* Filters Dashboard */}
        <DirectoryFilters
          limit={limit}
          setLimit={setLimit}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onFilterPress={() => setFilterModalVisible(true)}
        />

        {/* Results Count */}
        <View style={styles.resultsCount}>
          {isLoading ? (
            <Text style={styles.resultsText}>Loading...</Text>
          ) : (
            <Text style={styles.resultsText}>
              {filteredPlaces.length}{" "}
              {filteredPlaces.length === 1 ? "place" : "places"} found
            </Text>
          )}
        </View>

        {/* Restaurant Cards */}
        {filteredPlaces.length > 0
          ? filteredPlaces.map((place) => (
              <PlaceCard
                key={place._id}
                place={place}
                onPress={openRestaurantModal}
              />
            ))
          : !isLoading && (
              <View style={styles.emptyState}>
                <Ionicons name="sad-outline" size={64} color="#ccc" />
                <Text style={styles.emptyTitle}>No places found!</Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery
                    ? `Try searching for something else or increase your limit.`
                    : `Increase your limit to discover more places!`}
                </Text>
              </View>
            )}
      </ScrollView>

      {/* Restaurant Modal */}
      <PlaceDetailModal
        visible={modalVisible}
        place={selectedPlace}
        limit={limit}
        onClose={closeModal}
        getAffordableMeals={getAffordableMeals}
      />

      {/* Filter Modal */}
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
