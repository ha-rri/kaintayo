export interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  favorites: string[]; // ObjectIds as strings
  contributionCount: number;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}
