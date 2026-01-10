export type Zone = 'All' | 'Inside Campus' | 'Outside Campus';

export interface Place {
  id: number;
  name: string;
  location: {
    landmark: string;
    campusLocation: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  image: string;
}