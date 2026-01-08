import api from "@/lib/axios";
import Config from "@/constants/Config";
import { Place } from "@/types/Place";
import { MOCK_PLACES } from "@/constants/mockData";
import { APIResponse } from "@/types/common";

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
      scope?: "global" | "store";
    } = {}
  ): Promise<Place[]> => {
    // 1. Mock Mode
    if (Config.USE_MOCK_DATA) {
      console.log("⚡ [Mock Mode] Fetching places...", filters);
      await new Promise((resolve) => setTimeout(resolve, 300));

      let data = [...MOCK_PLACES];

      if (filters.zoneMacro && filters.zoneMacro !== "all") {
        data = data.filter((p) => p.zoneMacro === filters.zoneMacro);
      }

      if (filters.search) {
        // Use Word Boundary Regex for smarter matching (e.g. "t" matches "Tapa", not "Canteen")
        const q = filters.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape regex chars
        const regex = new RegExp(`\\b${q}`, "i");
        // Mock Data doesn't have searchable meals, so we search Name Only.
        // We removed Category search as per requirement (prevent "f" -> "Fast Food").
        data = data.filter((p) => regex.test(p.name));
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
    if (filters.scope) params.append("scope", filters.scope);
    if (filters.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice)
      params.append("maxPrice", filters.maxPrice.toString()); // Note: Controller might expect 'priceMax' or check logic

    const { data } = await api.get<APIResponse<Place[]>>(
      `/places?${params.toString()}`
    );
    return data.data;
  },

  getById: async (id: string): Promise<Place | undefined> => {
    if (Config.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_PLACES.find((p) => p._id === id);
    }

    const { data } = await api.get<APIResponse<Place>>(`/places/${id}`);
    return data.data;
  },
};

export default placeService;
