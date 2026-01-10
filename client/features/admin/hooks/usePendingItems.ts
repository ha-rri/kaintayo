import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/adminService";
import { Place } from "@/types/Place";
import { Meal } from "@/types/Meal";

// Export a union type for easier consumption in components
export type PendingItem =
  | (Place & { type: "place" })
  | (Meal & { type: "meal" });

export const usePendingItems = () => {
  return useQuery({
    queryKey: ["admin", "pending"],
    queryFn: async () => {
      const { places, meals } = await adminService.getPendingItems();

      // Tag items with their type so we can distinguish them in a mixed list
      const taggedPlaces = places.map(
        (p) => ({ ...p, type: "place" } as const)
      );
      const taggedMeals = meals.map((m) => ({ ...m, type: "meal" } as const));

      // Merge and Sort by Created Date (Newest First)
      // Assuming 'createdAt' exists on both models
      const allItems = [...taggedPlaces, ...taggedMeals].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Descending
      });

      return allItems as PendingItem[];
    },
  });
};
