import api from "@/lib/axios";
import { Place } from "@/types/Place";
import { Meal } from "@/types/Meal";

// Response types
interface PendingItemsResponse {
  success: boolean;
  count: number;
  data: {
    places: Place[];
    meals: Meal[];
  };
}

interface ActionResponse {
  success: boolean;
  message: string;
}

export const adminService = {
  // Get all pending items
  getPendingItems: async (): Promise<{ places: Place[]; meals: Meal[] }> => {
    const { data } = await api.get<PendingItemsResponse>("/admin/pending");
    return data.data;
  },

  // Approve Item
  approveItem: async (type: "place" | "meal", id: string) => {
    const { data } = await api.patch<ActionResponse>(
      `/admin/approve/${type}/${id}`
    );
    return data;
  },

  // Reject Item
  rejectItem: async (type: "place" | "meal", id: string) => {
    const { data } = await api.delete<ActionResponse>(
      `/admin/reject/${type}/${id}`
    );
    return data;
  },
};
