import { Meal } from "./Meal";

export interface Place {
  _id: string;
  name: string;
  zoneMacro: "inside" | "outside";
  zoneMicro?: string;
  priceRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  categories: string[];
  coverImage?: string;
  status: "active" | "pending";
  submittedBy?: string; // DEFAULT: ObjectId string
  createdAt: string;
  updatedAt: string;
  meals?: Meal[];
}

// For the Modal/Detail View where we populate
export interface PopulatedPlace extends Omit<Place, "submittedBy"> {
  submittedBy?: { username: string }; // Strictly Object. We trust the backend populate.
}
