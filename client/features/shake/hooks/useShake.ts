import { useState } from "react";
import { Vibration } from "react-native";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { shakeService } from "../services/shakeService";
import { Place } from "@/types/Place";
import { Zone } from "../types";

import { useDebounce } from "@/hooks/useDebounce";

export function useShake(
  budget: number,
  zone: Zone,
  categories: string[] = [],
  amenities: string[] = []
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

  const handleShake = async () => {
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
  };

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
