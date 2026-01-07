import api from "@/lib/axios";
import Config from "@/constants/Config";
import { Place } from "@/types/Place";
import { MOCK_PLACES } from "@/constants/mockData";

// --- Service ---
const placeService = {
  /**
   * Fetch all places (supporting Filters later)
   */
  getAll: async (
    filters: {
      zoneMacro?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
    } = {}
  ): Promise<Place[]> => {
    // 1. Mock Mode
    if (Config.USE_MOCK_DATA) {
      console.log("⚡ [Mock Mode] Fetching places...", filters);
      await new Promise((resolve) => setTimeout(resolve, 500));

      let data = [...MOCK_PLACES];

      if (filters.zoneMacro && filters.zoneMacro !== "all") {
        data = data.filter((p) => p.zoneMacro === filters.zoneMacro);
      }

      if (filters.search) {
        const q = filters.search.toLowerCase();
        data = data.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.categories.some((c: string) => c.toLowerCase().includes(q))
        );
      }

      if (filters.maxPrice) {
        data = data.filter((p) => p.priceRange.min <= filters.maxPrice!);
      }

      return data;
    }

    // 2. Real Mode
    const params = new URLSearchParams();
    if (filters.zoneMacro && filters.zoneMacro !== "all")
      params.append("zoneMacro", filters.zoneMacro);
    if (filters.search) params.append("search", filters.search);
    if (filters.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice)
      params.append("maxPrice", filters.maxPrice.toString()); // Note: Controller might expect 'priceMax' or check logic

    const { data } = await api.get(`/places?${params.toString()}`);
    return data.data;
  },

  getById: async (id: string): Promise<Place | undefined> => {
    if (Config.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_PLACES.find((p) => p._id === id);
    }

    const { data } = await api.get(`/places/${id}`);
    return data.data;
  },
};

export default placeService;
