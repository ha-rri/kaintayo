import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Expo Icons
import { Feather, Ionicons } from "@expo/vector-icons";
// Import Styles
import { styles } from "./styles/OnboardingStyles";

// Icon mapping type
type IconProps = {
  size: number;
  color: string;
};

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const slides = [
    {
      id: "1",
      // Using a render function for flexibility with different icon sets
      icon: ({ size, color }: IconProps) => (
        <Ionicons name="wallet-outline" size={size} color={color} />
      ),
      headline: "Petsa De Peligro?",
      subtext:
        "Find meals under ₱50 instantly.\nBudget-first search for students.",
    },
    {
      id: "2",
      icon: ({ size, color }: IconProps) => (
        <Feather name="map-pin" size={size} color={color} />
      ),
      headline: "Need Something?",
      subtext:
        "Filtered Everything Starting with Cafes,\nRestaurants, and even more!",
    },
    {
      id: "3",
      icon: ({ size, color }: IconProps) => (
        <Feather name="smartphone" size={size} color={color} />
      ),
      headline: "Can't Decide?",
      subtext: "Shake your phone to pick a spot.",
    },
  ];

  // Handle tracking which slide is currently in view
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentSlide(viewableItems[0].index);
      }
    }
  ).current;

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const handleNext = useCallback(async () => {
    if (currentSlide < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentSlide + 1 });
    } else {
      try {
        await AsyncStorage.setItem("hasSeenOnboarding", "true");
        router.replace("/(tabs)/food");
      } catch (error) {
        console.error("Error saving onboarding status:", error);
      }
    }
  }, [currentSlide, slides.length, router]);

  const handleBack = useCallback(() => {
    if (currentSlide > 0) {
      flatListRef.current?.scrollToIndex({ index: currentSlide - 1 });
    }
  }, [currentSlide]);

  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Orange Header Bar */}
      <View style={styles.headerBar} />

      {/* Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={({ item }) => (
            <View style={styles.slideItem}>
              {/* Icon Container */}
              <View style={styles.iconCircle}>
                {item.icon({ size: 64, color: "#f97316" })}
              </View>

              {/* Text Content */}
              <View style={styles.textContainer}>
                <Text style={styles.headline}>{item.headline}</Text>
                <Text style={styles.subtext}>{item.subtext}</Text>
              </View>
            </View>
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfigRef}
          scrollEventThrottle={32}
        />
      </View>

      {/* Bottom Section */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {!isFirstSlide && (
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={handleBack}
            >
              <Text style={styles.buttonTextBack}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={styles.buttonTextNext}>
              {isLastSlide ? "Get Started" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
