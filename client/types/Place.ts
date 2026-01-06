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
  submittedBy?: string; // ObjectId as string
  createdAt: string;
  updatedAt: string;
  meals?: Meal[]; // Optional: Populated/Joined field
}
