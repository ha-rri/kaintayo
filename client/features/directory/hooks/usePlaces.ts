import { useQuery } from "@tanstack/react-query";
import placeService from "../services/placeService";

export const usePlaces = (
  filters: {
    zoneMacro?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    scope?: "global" | "store";
    keepPreviousData?: boolean;
  } = {}
) => {
  return useQuery({
    queryKey: ["places", filters],
    queryFn: () => placeService.getAll(filters),
    // Optional: Keep previous data while fetching new filter results for smoother UX
    // Defaults to true unless explicitly set to false
    placeholderData: (previousData) =>
      filters.keepPreviousData !== false ? previousData : undefined,
  });
};
