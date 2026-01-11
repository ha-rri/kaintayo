import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
} from "react-native";
import { theme } from "@/lib/theme";

interface SegmentedControlProps {
  values: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const SegmentedControl = ({
  values,
  selectedIndex,
  onChange,
}: SegmentedControlProps) => {
  const handlePress = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onChange(index);
  };

  return (
    <View style={styles.container}>
      {values.map((value, index) => {
        const isActive = selectedIndex === index;
        return (
          <TouchableOpacity
            key={value}
            style={[styles.segment, isActive && styles.segmentActive]}
            onPress={() => handlePress(index)}
            activeOpacity={0.7}
          >
            <Text style={[styles.text, isActive && styles.textActive]}>
              {value}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0", // Light gray track
    borderRadius: theme.radius.md,
    padding: 4,
    height: 44,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.sm,
  },
  segmentActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: theme.fontSizes.sm,
    fontWeight: "500",
    color: theme.colors.text.secondary,
  },
  textActive: {
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
});
