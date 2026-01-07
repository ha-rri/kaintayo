import { Meal } from "./Meal";

export interface Place {
  _id: string;
  name: string;
  zoneMacro: "inside" | "outside";
  nearestLandmark?: string;
  priceRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  categories: string[];
  coverImage?: string;
  status: "active" | "pending";
  submittedBy?: { username: string }; // Strictly Object. We trust the backend populate.
  createdAt: string;
  updatedAt: string;
  meals?: Meal[];
}
