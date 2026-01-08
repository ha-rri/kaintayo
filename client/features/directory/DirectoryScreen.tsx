import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo } from "react";
import { styles } from "./styles/directory.styles";
import { usePlaces } from "./hooks/usePlaces";
import { useDebounce } from "@/hooks/useDebounce";
import { DirectoryHeader } from "./components/DirectoryHeader";
import { BudgetSlider } from "./components/BudgetSlider";
import { CategoryFilter } from "./components/CategoryFilter";
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

  // Server-Side Filtering:
  // Fetch based on Category (Zone) and Search Query to reduce payload and handle indexing.
  const filters: any = {};
  if (activeCategory === "Inside Campus") filters.zoneMacro = "inside";
  if (activeCategory === "Outside Campus") filters.zoneMacro = "outside";
  if (debouncedSearch) filters.search = debouncedSearch;

  const { data: places = [], isLoading } = usePlaces(filters);

  // Client-Side Filtering (Price):
  // Filter locally to maintain immediate responsiveness for the slider (no network lag).
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => place.priceRange.min <= limit);
  }, [places, limit]);

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Hook automatically triggers on searchQuery change
  };

  const openRestaurantModal = (place: Place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlace(null);
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

        {/* Price Limit Slider */}
        <BudgetSlider limit={limit} setLimit={setLimit} />

        {/* Category Tabs */}
        <CategoryFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
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
    </View>
  );
}
