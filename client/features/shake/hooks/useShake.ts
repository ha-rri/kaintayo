import { useState, useEffect, useCallback } from "react";
import { Vibration } from "react-native";
import { Accelerometer } from "expo-sensors";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { shakeService } from "../services/shakeService";
import { Place } from "@/types/Place";
import { Zone } from "../types";

import { useDebounce } from "@/hooks/useDebounce";

export function useShake(
  budget: number,
  zone: Zone,
  categories: string[] = [],
  amenities: string[] = [],
  enabled: boolean = true
) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Debounce API calls to prevent 429 Rate Limit
  const debouncedBudget = useDebounce(budget, 500);
  const debouncedZone = useDebounce(zone, 500);

  // 1. Live Match Count
  const { data: matchedPlacesCount = 0 } = useQuery({
    queryKey: [
      "shake",
      "count",
      debouncedBudget,
      debouncedZone,
      categories,
      amenities,
    ],
    queryFn: () =>
      shakeService.getMatchCount({
        budget: debouncedBudget,
        zone: debouncedZone,
        categories,
        amenities,
      }),
    staleTime: 5000,
    placeholderData: keepPreviousData, // V5 Standard
  });

  const handleShake = useCallback(async () => {
    if (matchedPlacesCount === 0) return;

    setIsShaking(true);
    setSelectedPlace(null);
    Vibration.vibrate(100);

    // Animate for 5s, then reveal result
    setTimeout(async () => {
      try {
        const place = await shakeService.getRandomPlace({
          budget,
          zone,
          categories,
          amenities,
        });
        setSelectedPlace(place);

        // Wait 500ms before removing overlay to allow Modal to animate in
        // Fixes the "Flash" where you see the underlying screen
        setTimeout(() => {
          setIsShaking(false);
        }, 500);
      } catch (err) {
        console.error("Shake Failed:", err);
        setIsShaking(false);
      }
    }, 5000);
  }, [matchedPlacesCount, budget, zone, categories, amenities]);

  // 2. Physical Shake Subscription
  useEffect(() => {
    // Only listen if enabled, we have matches and are NOT currently shaking
    if (!enabled || matchedPlacesCount === 0 || isShaking) return;

    // Throttle Update Interval
    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener((data) => {
      const { x, y, z } = data;
      // Calculate Total G-Force
      const totalForce = Math.sqrt(x * x + y * y + z * z);

      // Threshold: 1.78g (Standard "Shake" force)
      if (totalForce > 1.78) {
        handleShake();
      }
    });

    return () => {
      subscription && subscription.remove();
    };
  }, [matchedPlacesCount, isShaking, handleShake, enabled]);

  const handleReset = () => {
    setSelectedPlace(null);
  };

  return {
    matchedPlacesCount,
    selectedPlace,
    isShaking,
    handleShake,
    handleReset,
  };
}
