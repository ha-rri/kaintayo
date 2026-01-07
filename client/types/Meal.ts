export interface Meal {
  _id: string;
  place: string; // ObjectId of the parent Place
  title: string;
  priceRegular: number;
  priceHalf?: number;
  imageUrl?: string;
  isApproved: boolean;
  submittedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
