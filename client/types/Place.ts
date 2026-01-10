import { Meal } from "./Meal";

export type ZoneMacro = "inside" | "outside";

export interface Place {
  _id: string;
  name: string;
  zoneMacro: ZoneMacro;
  nearestLandmark?: string;
  priceRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  categories: string[];
  coverImage?: string;
  status: "active" | "pending";
  submittedBy?: { _id: string; username: string }; // Strictly Object. We trust the backend populate.
  createdAt: string;
  updatedAt: string;
  meals?: Meal[];
}
