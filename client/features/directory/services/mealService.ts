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

  async updateMeal(id: string, updates: Partial<Meal>) {
    const { data } = await api.put<APIResponse<Meal>>(`/meals/${id}`, updates);
    return data.data;
  },

  async deleteMeal(id: string) {
    const { data } = await api.delete<APIResponse<{ message: string }>>(
      `/meals/${id}`
    );
    return data;
  },
};

export default mealService;
