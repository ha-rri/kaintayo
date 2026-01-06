import api from "./api";
import Config from "@/constants/Config";
import { Place } from "@/types/Place";
import { MOCK_PLACES } from "@/constants/mockData";

// --- Service ---
const placeService = {
  /**
   * Fetch all places (supporting Filters later)
   */
  getAll: async (filters: any = {}): Promise<Place[]> => {
    // 1. Mock Mode
    if (Config.USE_MOCK_DATA) {
      console.log("⚡ [Mock Mode] Fetching places...");
      // Simulate network delay (500ms)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Basic client-side filtering support for Mock (Optional but helpful)
      let data = [...MOCK_PLACES];
      if (filters.macro) {
        data = data.filter(
          (p) => p.zoneMacro.toLowerCase() === filters.macro.toLowerCase()
        );
      }
      return data;
    }

    // 2. Real Mode
    const params = new URLSearchParams();
    if (filters.macro) params.append("macro", filters.macro);
    // Add other filters as needed

    const { data } = await api.get(`/places?${params.toString()}`);
    return data.data; // Backend returns { success: true, data: [...] }
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
