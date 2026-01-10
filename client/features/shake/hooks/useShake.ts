import { useState, useEffect } from 'react';
import { Vibration } from 'react-native'; 
import { getRandomPlace, getMatchedPlacesCount } from '../services/randomPlaceService';
import { Place, Zone } from '../types';

export function useShake(budget: number, zone: Zone) {
  const [matchedPlacesCount, setMatchedPlacesCount] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    updateMatchedCount();
  }, [budget, zone]);

  const updateMatchedCount = async () => {
    const count = await getMatchedPlacesCount(budget, zone);
    setMatchedPlacesCount(count);
  };

  const handleShake = async () => {
    if (matchedPlacesCount === 0) return;

    setIsShaking(true);
    setSelectedPlace(null);
    Vibration.vibrate(100); 

    // ✅ UPDATED: Increased to 5 seconds (5000ms)
    // This gives the animation plenty of time to show the "Kainan Found" state
    setTimeout(async () => {
      const place = await getRandomPlace(budget, zone);
      setSelectedPlace(place);
      setIsShaking(false);
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