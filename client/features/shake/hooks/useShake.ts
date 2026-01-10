import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics'; // Better vibration than standard React Native
import { getRandomPlace } from '../services/randomPlaceService';
import { Place, Zone } from '../types';

export const useShake = (budget: number, selectedZone: Zone) => {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate potential matches locally for the UI counter
  const matchedPlacesCount = Math.floor(budget / 50) * (selectedZone === 'All' ? 5 : 2);

  // 1. Physical Shake Detection
  useEffect(() => {
    // Set how often we check the sensor (milliseconds)
    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener(data => {
      // Calculate total G-force
      const totalForce = Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z);
      
      // Threshold: 1.78 is a good "firm shake"
      if (totalForce > 1.78) {
        handleShake();
      }
    });

    return () => subscription && subscription.remove();
  }, [isShaking, isLoading]); // Re-bind listener to ensure we capture current state

  // 2. The Shake Action
  const handleShake = async () => {
    // Prevent double-shaking if already loading
    if (isShaking || isLoading) return;

    setIsShaking(true);
    setIsLoading(true);
    
    // Trigger Haptic Feedback (Vibration)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Simulate "Thinking" delay
    setTimeout(async () => {
      try {
        const place = await getRandomPlace(budget, selectedZone);
        setSelectedPlace(place);
      } catch (error) {
        console.error(error);
      } finally {
        setIsShaking(false);
        setIsLoading(false);
      }
    }, 2000); 
  };

  const handleReset = () => {
    setSelectedPlace(null);
  };

  return {
    matchedPlacesCount,
    selectedPlace,
    isShaking,
    isLoading,
    handleShake,
    handleReset,
  };
};