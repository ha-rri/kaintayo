import { useState } from "react";
import { Vibration } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { shakeService } from "../services/shakeService";
import { Place } from "@/types/Place";
import { Zone } from "../types";

export function useShake(
  budget: number,
  zone: Zone,
  categories: string[] = [],
  amenities: string[] = []
) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // 1. Live Match Count
  const { data: matchedPlacesCount = 0 } = useQuery({
    queryKey: ["shake", "count", budget, zone, categories, amenities],
    queryFn: () =>
      shakeService.getMatchCount({ budget, zone, categories, amenities }),
    staleTime: 5000,
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
      } catch (err) {
        console.error("Shake Failed:", err);
        // Could show error toast here
      } finally {
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
