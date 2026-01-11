import { useInfiniteQuery } from "@tanstack/react-query";
import placeService from "../services/placeService";

export const useInfinitePlaces = (
  filters: {
    zoneMacro?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    categories?: string[];
    amenities?: string[];
    scope?: "global" | "store" | string;
    keepPreviousData?: boolean;
    limit?: number;
  } = {}
) => {
  return useInfiniteQuery({
    queryKey: ["places", "infinite", filters],
    queryFn: async ({ pageParam = 1 }) => {
      return placeService.getAll({
        ...filters,
        page: pageParam,
        limit: filters.limit || 10,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Logic: If current page < total pages, returns next page number
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined; // No more pages
    },
    // Optional: Keep previous data typically handled by infinite query structure
  });
};
