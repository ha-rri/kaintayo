import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteService } from "../services/favoriteService";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Place } from "@/types/Place";
import { Alert } from "react-native";

export const useFavorites = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["favorites", user?._id],
    queryFn: favoriteService.getFavorites,
    enabled: !!user,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (placeId: string) => favoriteService.toggleFavorite(placeId),
    onMutate: async (placeId) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: ["favorites", user?._id] });

      // Snapshot previous value
      const previousFavorites = queryClient.getQueryData<Place[]>([
        "favorites",
        user?._id,
      ]);

      // Optimistically update Favorites List
      queryClient.setQueryData<Place[]>(["favorites", user?._id], (old) => {
        if (!old) return [];
        const exists = old.find((p) => p._id === placeId);
        if (exists) {
          return old.filter((p) => p._id !== placeId);
        }
        return old;
      });

      return { previousFavorites };
    },
    onSuccess: (data, placeId) => {
      // Refresh User context to update the favorites array IDs
      // By invalidating authUser, we force refetch of user data
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      // Invalidate favorites list to ensure data is fresh (especially for adds)
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (err, newTodo, context) => {
      Alert.alert("Error", "Failed to update favorites");
      queryClient.setQueryData(
        ["favorites", user?._id],
        context?.previousFavorites
      );
    },
  });
};
