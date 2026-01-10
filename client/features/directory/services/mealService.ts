import api from "@/lib/axios";
import { Meal } from "@/types/Meal";
import { APIResponse } from "@/types/common";

export const mealService = {
  async getByPlace(placeId: string) {
    const { data } = await api.get<APIResponse<Meal[]>>(
      `/places/${placeId}/meals`
    );
    return data.data;
  },

  async getMyPending() {
    const { data } = await api.get<{
      success: boolean;
      data: Meal[];
    }>("/meals/my-pending");
    return data.data;
  },
};

export default mealService;
