import { Place, Zone } from '../types';

const MOCK_PLACES: Place[] = [
  {
    id: 1,
    name: 'Streetside Lomi Haus',
    location: { landmark: 'Near Gate 1', campusLocation: 'Outside Campus' },
    priceRange: { min: 25, max: 150 },
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000',
  },
  {
    id: 2,
    name: 'Campus Canteen',
    location: { landmark: 'Main Building', campusLocation: 'Inside Campus' },
    priceRange: { min: 30, max: 80 },
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000',
  },
  {
    id: 3,
    name: 'Coffee Bean Café',
    location: { landmark: 'Near Library', campusLocation: 'Inside Campus' },
    priceRange: { min: 50, max: 200 },
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000',
  },
  {
    id: 4,
    name: "Ate Rica's Bacsilog",
    location: { landmark: 'CBA Building', campusLocation: 'Inside Campus' },
    priceRange: { min: 70, max: 120 },
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1000',
  },
  {
    id: 5,
    name: 'Jollibee',
    location: { landmark: 'University Mall', campusLocation: 'Outside Campus' },
    priceRange: { min: 100, max: 300 },
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000',
  },
];

const isMatch = (place: Place, budget: number, zone: Zone) => {
  const matchesBudget = place.priceRange.min <= budget;
  const matchesZone = zone === 'All' || place.location.campusLocation === zone;
  return matchesBudget && matchesZone;
};

export async function getRandomPlace(budget: number, zone: Zone): Promise<Place | null> {
  const filtered = MOCK_PLACES.filter(place => isMatch(place, budget, zone));
  if (filtered.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

export async function getMatchedPlacesCount(budget: number, zone: Zone): Promise<number> {
  const filtered = MOCK_PLACES.filter(place => isMatch(place, budget, zone));
  return filtered.length;
}