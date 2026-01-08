import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Control, useWatch } from "react-hook-form";
import { ContributeFormData } from "../types/contribute.types";
import { FieldError } from "@/components/ui/FormError";
import { usePlaces } from "../../directory/hooks/usePlaces";
import { Place } from "@/types/Place";
import { useDebounce } from "@/hooks/useDebounce";

interface StoreSearchProps {
  control: Control<ContributeFormData>;
  setValue: (name: any, value: any) => void;
  errors: any;
  onClear: () => void;
}

export const StoreSearch = ({
  control,
  setValue,
  errors,
  onClear,
}: StoreSearchProps) => {
  const [query, setQuery] = useState("");

  const selectedPlaceId = useWatch({ control, name: "placeId" });
  const isNewPlace = useWatch({ control, name: "isNewPlace" });
  const placeName = useWatch({ control, name: "place.name" });

  // Standard debounce - 300ms delay
  const debouncedQuery = useDebounce(query, 300);

  // Ref to track query for safe access in effects
  const queryRef = useRef(query);
  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  // Hook into the API search
  const {
    data: searchResults = [],
    isLoading,
    isFetching,
  } = usePlaces({
    search: debouncedQuery.length > 0 ? debouncedQuery : undefined,
    scope: "store",
    keepPreviousData: false, // Prevent flash of stale options
  });

  // Combine loading states
  const showLoading = isLoading || isFetching;
  const isDebouncing = query !== debouncedQuery;

  // Auto-clear query when form resets (selectedPlaceId becomes null)
  useEffect(() => {
    if (!selectedPlaceId && !isNewPlace && queryRef.current) {
      setQuery("");
    }
  }, [selectedPlaceId, isNewPlace]);

  useEffect(() => {
    // If it's a new place, sync query with place name if query is empty (initial load of edit)
    if (isNewPlace && placeName && !query) {
      setQuery(placeName);
    }
  }, [isNewPlace, placeName, query]);

  const handleSelectPlace = (place: Place) => {
    setValue("placeId", place._id);
    setValue("isNewPlace", false);
    setQuery(place.name);
  };

  const handleCreateNew = () => {
    setValue("placeId", undefined);
    setValue("isNewPlace", true);
    setValue("place.name", query);
  };

  const handleReset = () => {
    onClear();
    setQuery("");
  };

  const showDropdown =
    !isDebouncing &&
    !showLoading &&
    searchResults.length > 0 &&
    !isNewPlace &&
    !selectedPlaceId &&
    debouncedQuery.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Store Name</Text>
      <View style={styles.searchWrapper}>
        <TextInput
          style={[
            styles.input,
            (selectedPlaceId || isNewPlace) && styles.lockedInput,
          ]}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (selectedPlaceId) handleReset();

            if (isNewPlace) {
              setValue("place.name", text);
            }
          }}
          placeholder="Search existing place..."
          editable={!selectedPlaceId}
        />

        {/* Loading Indicator or Clear Button */}
        {showLoading ? (
          <ActivityIndicator
            size="small"
            color="#FF6B35"
            style={styles.loader}
          />
        ) : (
          (selectedPlaceId || isNewPlace) && (
            <TouchableOpacity onPress={handleReset} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Show FieldError for PlaceId if separate */}
      {errors.placeId && <FieldError message={errors.placeId.message} />}

      {/* Recommendations Dropdown */}
      {showDropdown && (
        <View style={styles.dropdown}>
          {searchResults.map((place) => (
            <TouchableOpacity
              key={place._id}
              style={styles.dropdownItem}
              onPress={() => handleSelectPlace(place)}
            >
              <Text style={styles.placeName}>{place.name}</Text>
              <Text style={styles.placeDetail}>{place.nearestLandmark}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.createBtn} onPress={handleCreateNew}>
            <Text style={styles.createBtnText}>
              Request New Place: &quot;{debouncedQuery}&quot;
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* No Results -> Create New */}
      {debouncedQuery.length > 0 &&
        !isDebouncing &&
        !showLoading &&
        searchResults.length === 0 &&
        !isNewPlace &&
        !selectedPlaceId && (
          <TouchableOpacity
            style={[styles.createBtn, { marginTop: 8 }]}
            onPress={handleCreateNew}
          >
            <Text style={styles.createBtnText}>
              Request New Place: &quot;{debouncedQuery}&quot;
            </Text>
          </TouchableOpacity>
        )}

      {/* New Store Badge */}
      {isNewPlace && (
        <View style={styles.badgeContainer}>
          <View style={styles.newStoreBadge}>
            <Ionicons name="add-circle" size={16} color="#FF6B35" />
            <Text style={styles.newStoreBadgeText}>New Store</Text>
          </View>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.cancelText}>Change</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Existing Store Badge */}
      {selectedPlaceId && (
        <View style={styles.existingStoreBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.existingStoreBadgeText}>Existing Store</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15, zIndex: 50, elevation: 5 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchWrapper: { position: "relative" },
  lockedInput: {
    backgroundColor: "#e8f5e9", // Green tint for selected
    borderColor: "#4CAF50",
    color: "#2E7D32",
  },
  clearBtn: { position: "absolute", right: 12, top: 12, zIndex: 1 },
  loader: { position: "absolute", right: 12, top: 12, zIndex: 1 },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  placeName: { fontWeight: "500", fontSize: 14, color: "#333" },
  placeDetail: { color: "#999", fontSize: 12, marginTop: 2 },
  createBtn: {
    backgroundColor: "#fff5f0",
    paddingHorizontal: 15,
    paddingVertical: 12,
    // matches dropdownItem flow or newStoreItem in oldContribute
    flexDirection: "row",
    alignItems: "center",
  },
  createBtnText: {
    color: "#FF6B35",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  newStoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#fff5f0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  newStoreBadgeText: { fontSize: 12, color: "#FF6B35", fontWeight: "600" },
  cancelText: { fontSize: 12, color: "#666", textDecorationLine: "underline" },
  existingStoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#f0f9f4",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  existingStoreBadgeText: { fontSize: 12, color: "#4CAF50", fontWeight: "600" },
});
