import { Zone, Place } from '../types';
import { endpoints, mapZoneToServer } from '../../../config/api';

export async function getRandomPlace(budget: number, zone: Zone): Promise<Place | null> {
  try {
    const zoneMacro = mapZoneToServer(zone);
    
    // 1. Build query params to filter on the SERVER side
    // Adjust these param names ('maxPrice', 'zoneMacro') to match your Backend Controller
    const params = new URLSearchParams();
    if (budget > 0) params.append('maxPrice', budget.toString());
    if (zoneMacro) params.append('zoneMacro', zoneMacro);

    console.log(`Fetching: ${endpoints.places.getAll}?${params.toString()}`);

    // 2. The Real API Call
    const response = await fetch(`${endpoints.places.getAll}?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    
    // Assuming your API returns { success: true, data: [...] }
    // Adjust 'result.data' if your API structure is different
    const places: Place[] = result.data || [];

    if (places.length === 0) return null;

    // 3. Pick a random winner from the filtered list
    const randomIndex = Math.floor(Math.random() * places.length);
    return places[randomIndex];

  } catch (error) {
    console.error('Error fetching random place:', error);
    // Optional: Re-throw error if you want to show an alert in the UI
    throw error;
  }
}