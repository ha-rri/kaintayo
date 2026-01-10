import api from "@/lib/axios";
import { Place } from "@/types/Place";
import { APIResponse } from "@/types/common";

interface ToggleFavoriteResponse {
  success: boolean;
  isFavorite: boolean;
  message: string;
}

export const favoriteService = {
  // Get all favorite places
  getFavorites: async (): Promise<Place[]> => {
    const { data } = await api.get<APIResponse<Place[]>>("/users/favorites");
    return data.data;
  },

  // Toggle favorite status
  toggleFavorite: async (placeId: string): Promise<ToggleFavoriteResponse> => {
    const { data } = await api.post<ToggleFavoriteResponse>(
      `/users/favorites/${placeId}`
    );
    return data;
  },
};
