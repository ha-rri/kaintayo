import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";
import { styles } from "../styles/directory.styles";

interface CategoryFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const CategoryFilter = ({
  activeCategory,
  setActiveCategory,
}: CategoryFilterProps) => {
  const categories = ["All", "Inside Campus", "Outside Campus"];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryTab,
            activeCategory === category && styles.categoryTabActive,
          ]}
          onPress={() => setActiveCategory(category)}
        >
          <Text
            style={[
              styles.categoryText,
              activeCategory === category && styles.categoryTextActive,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
