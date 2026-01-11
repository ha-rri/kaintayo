import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/shake.styles";
import { theme } from "@/lib/theme";

type Zone = "All" | "Inside Campus" | "Outside Campus";

interface ZoneSelectorProps {
  selectedZone: Zone;
  onZoneChange: (zone: Zone) => void;
  onFilterPress?: () => void;
}

export default function ZoneSelector({
  selectedZone,
  onZoneChange,
  onFilterPress,
}: ZoneSelectorProps) {
  const zones: Zone[] = ["All", "Inside Campus", "Outside Campus"];

  return (
    <View style={styles.zoneCard}>
      <Text style={styles.zoneLabel}>Select Zones</Text>
      <View
        style={[
          styles.zoneButtons,
          { flexDirection: "row", flexWrap: "wrap", alignItems: "center" },
        ]}
      >
        {zones.map((zone) => (
          <TouchableOpacity
            key={zone}
            style={[
              styles.zoneButton,
              selectedZone === zone && styles.zoneButtonActive,
            ]}
            onPress={() => onZoneChange(zone)}
          >
            <Text
              style={[
                styles.zoneButtonText,
                selectedZone === zone && styles.zoneButtonTextActive,
              ]}
            >
              {zone}
            </Text>
          </TouchableOpacity>
        ))}
        {onFilterPress && (
          <TouchableOpacity
            style={[
              styles.zoneButton,
              { paddingHorizontal: 10, borderColor: theme.colors.primary },
            ]}
            onPress={onFilterPress}
          >
            <Ionicons
              name="options-outline"
              size={16}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
