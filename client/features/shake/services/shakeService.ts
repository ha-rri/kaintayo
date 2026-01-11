import axios from "@/lib/axios";
import { Place } from "@/types/Place";

interface ShakeParams {
  budget: number;
  zone: "All" | "Inside Campus" | "Outside Campus";
  categories?: string[];
  amenities?: string[];
}

export const shakeService = {
  /**
   * Get the number of matching places
   */
  getMatchCount: async (params: ShakeParams): Promise<number> => {
    try {
      // Map params to query string format
      const queryParams = buildQueryParams(params);
      const { data } = await axios.get<{ count: number }>("/shake/count", {
        params: queryParams,
      });
      return data.count;
    } catch (error) {
      console.error("Error fetching match count:", error);
      return 0; // Default to 0 on error
    }
  },

  /**
   * Get a random place matching the criteria
   */
  getRandomPlace: async (params: ShakeParams): Promise<Place | null> => {
    try {
      const queryParams = buildQueryParams(params);
      const { data } = await axios.get<Place>("/shake", {
        params: queryParams,
      });
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};

/**
 * Helper to transform complex params into backend-friendly query object
 */
function buildQueryParams(params: ShakeParams) {
  const { budget, zone, categories, amenities } = params;

  return {
    budget,
    zone,
    categories: categories?.join(","),
    amenities: amenities?.join(","),
  };
}
