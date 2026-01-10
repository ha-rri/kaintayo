// 1. Define the specific strings allowed for Zones
export type Zone = 'All' | 'Inside Campus' | 'Outside Campus';

// 2. Define the shape of a Place (matches your MongoDB)
export interface Place {
  _id: string;
  name: string;
  zoneMacro: 'inside' | 'outside';
  nearestLandmark?: string;
  priceRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  categories: string[];
  coverImage?: string;
}

// 3. Helper function (Optional, but good for services)
export const mapZoneToMacro = (zone: Zone): 'inside' | 'outside' | undefined => {
  if (zone === 'Inside Campus') return 'inside';
  if (zone === 'Outside Campus') return 'outside';
  return undefined; // 'All' means undefined in the filter
};