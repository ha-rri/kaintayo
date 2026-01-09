type Zone = 'All' | 'Inside Campus' | 'Outside Campus';

// Mock data - Replace with actual API call
const mockPlaces = [
  {
    id: 1,
    name: 'Streetside Lomi Haus',
    location: { landmark: 'Near Gate 1', campusLocation: 'Outside Campus' },
    priceRange: { min: 25, max: 150 },
  },
  {
    id: 2,
    name: 'Campus Canteen',
    location: { landmark: 'Main Building', campusLocation: 'Inside Campus' },
    priceRange: { min: 30, max: 80 },
  },
  {
    id: 3,
    name: 'Coffee Bean Café',
    location: { landmark: 'Near Library', campusLocation: 'Inside Campus' },
    priceRange: { min: 50, max: 200 },
  },
];

export async function getRandomPlace(budget: number, zone: Zone) {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_URL}/places/random?budget=${budget}&zone=${zone}`);
  
  // Filter places based on criteria
  const filtered = mockPlaces.filter(place => {
    const matchesBudget = place.priceRange.min <= budget;
    const matchesZone = zone === 'All' || place.location.campusLocation === zone;
    return matchesBudget && matchesZone;
  });

  // Return random place
  if (filtered.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

export async function getMatchedPlacesCount(budget: number, zone: Zone): Promise<number> {
  // TODO: Replace with actual API call
  const filtered = mockPlaces.filter(place => {
    const matchesBudget = place.priceRange.min <= budget;
    const matchesZone = zone === 'All' || place.location.campusLocation === zone;
    return matchesBudget && matchesZone;
  });
  
  return filtered.length;
}