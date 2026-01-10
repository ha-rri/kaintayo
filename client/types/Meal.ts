// Place can be ID string OR populated object
import { Place } from "./Place";

export interface Meal {
  _id: string;
  place: string | Place; // ObjectId of the parent Place OR populated Place
  title: string;
  priceRegular: number;
  priceHalf?: number;
  imageUri?: string;
  isApproved: boolean;
  submittedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
