export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type ZoneMacro = "Inside" | "Outside";

export interface Place {
  _id: string;
  name: string;
  zoneMacro: ZoneMacro;
  zoneMicro: string;
  priceRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  categories: string[];
  coverImage?: string;
  status: "active" | "pending";
  createdAt: string;
  updatedAt: string;
  // Computed/Populated fields
  meals?: Meal[];
}

export interface Meal {
  _id: string;
  place: string | Place; // ID or Populated object
  title: string;
  priceRegular: number;
  priceHalf?: number;
  imageUrl?: string;
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  favorites: string[]; // Array of Place IDs
  contributionCount: number;
  // Password is explicitly excluded for security
}
