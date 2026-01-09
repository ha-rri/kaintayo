import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";

interface DirectoryFiltersProps {
  limit: number;
  setLimit: (limit: number) => void;
  activeCategory: string; // "All" | "Inside Campus" | "Outside Campus"
  setActiveCategory: (category: string) => void;
  onFilterPress: () => void;
}

export const DirectoryFilters = ({
  limit,
  setLimit,
  activeCategory,
  setActiveCategory,
  onFilterPress,
}: DirectoryFiltersProps) => {
  const zones = ["All", "Inside Campus", "Outside Campus"];

  return (
    <View style={styles.container}>
      {/* Top Section: Limit Slider */}
      <View style={styles.limitHeader}>
        <Text style={styles.limitLabel}>My Limit:</Text>
        <View style={styles.limitBadge}>
          <Text style={styles.limitText}>₱{limit}</Text>
        </View>
      </View>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={300}
          step={10}
          value={limit}
          onValueChange={setLimit}
          minimumTrackTintColor="#FF6B35"
          maximumTrackTintColor="#e0e0e0"
          thumbTintColor="#FF6B35"
        />
      </View>

      {/* Bottom Section: Zones + Filter Button */}
      <View style={styles.bottomRow}>
        <View style={styles.zoneContainer}>
          {zones.map((zone) => (
            <TouchableOpacity
              key={zone}
              style={[
                styles.zoneTab,
                activeCategory === zone && styles.zoneTabActive,
                { flex: zone === "All" ? 0.6 : 1.2 },
              ]}
              onPress={() => setActiveCategory(zone)}
            >
              <Text
                style={[
                  styles.zoneText,
                  activeCategory === zone && styles.zoneTextActive,
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {zone}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Ionicons name="options-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -20,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  limitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  limitLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  limitBadge: {
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  limitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  sliderContainer: {
    marginBottom: 5,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  zoneContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
  },
  zoneTab: {
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  zoneTabActive: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  zoneText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
  zoneTextActive: {
    color: "#fff",
  },
  filterButton: {
    backgroundColor: "#FF6B35",
    width: 44,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
