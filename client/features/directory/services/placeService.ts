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
      scope?: "global" | "store" | "my_pending_inclusion" | string;
      includePendingForUser?: string;
      categories?: string[];
      amenities?: string[];
      page?: number;
      limit?: number;
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

      // Mock Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const start = (page - 1) * limit;
      return data.slice(start, start + limit);
    }

    // 2. Real Mode
    const params = new URLSearchParams();
    if (filters.zoneMacro && filters.zoneMacro !== "all")
      params.append("zoneMacro", filters.zoneMacro);
    if (filters.search) params.append("search", filters.search);
    if (filters.scope) params.append("scope", filters.scope);
    if (filters.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice)
      params.append("maxPrice", filters.maxPrice.toString());

    if (filters.categories && filters.categories.length > 0)
      params.append("categories", filters.categories.join(","));
    if (filters.amenities && filters.amenities.length > 0)
      params.append("amenities", filters.amenities.join(","));

    // Pagination
    params.append("page", (filters.page || 1).toString());
    params.append("limit", (filters.limit || 10).toString());

    // Response is { success: true, data: Place[], meta: ... }
    // APIResponse<Place[]> maps 'data' to Place[]
    const { data } = await api.get<APIResponse<Place[]>>(
      `/places?${params.toString()}`
    );
    return data.data;
  },

  async getMyPending() {
    const { data } = await api.get<{
      success: boolean;
      data: Place[];
    }>("/places/my-pending");
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
