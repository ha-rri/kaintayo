import { useState, useEffect } from 'react';
import { getRandomPlace } from '../services/randomPlaceService';

type Zone = 'All' | 'Inside Campus' | 'Outside Campus';

export function useShake(budget: number, zone: Zone) {
  const [matchedPlacesCount, setMatchedPlacesCount] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Update matched places count when budget or zone changes
  useEffect(() => {
    updateMatchedCount();
  }, [budget, zone]);

  const updateMatchedCount = async () => {
    // TODO: Call API to get count
    // For now, use mock data
    const mockCount = Math.floor(Math.random() * 10) + 1;
    setMatchedPlacesCount(mockCount);
  };

  const handleShake = async () => {
    if (matchedPlacesCount === 0) return;

    setIsShaking(true);
    setSelectedPlace(null);

    // Simulate shake delay
    setTimeout(async () => {
      const place = await getRandomPlace(budget, zone);
      setSelectedPlace(place);
      setIsShaking(false);
    }, 1000);
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