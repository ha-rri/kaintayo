import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useToggleFavorite } from "@/features/favorites/hooks/useFavorites";
import { useToast } from "@/features/common/context/ToastContext";

interface FavoriteButtonProps {
  placeId: string;
  size?: number;
  color?: string;
  initialIsFavorite?: boolean;
  style?: any;
}

export const FavoriteButton = ({
  placeId,
  size = 28,
  color = "#fff",
  initialIsFavorite = false,
  style,
}: FavoriteButtonProps) => {
  const { user } = useAuth();
  const { mutate: toggle, isPending } = useToggleFavorite();
  const { showToast } = useToast();

  // Robust check: Handle string IDs, populated objects, and Mongoose ObjectIds
  const isFavoriteContext =
    user?.favorites?.some((f: any) => {
      const id = typeof f === "string" ? f : f._id?.toString() || f.toString();
      return id === placeId;
    }) ?? initialIsFavorite;

  // Local state for instant feedback (Optimistic UI)
  const [isFavoriteLocal, setIsFavoriteLocal] =
    React.useState(isFavoriteContext);

  // Sync local state when context changes (e.g. invalidation after success)
  React.useEffect(() => {
    setIsFavoriteLocal(isFavoriteContext);
  }, [isFavoriteContext]);

  const handlePress = () => {
    if (!user) {
      showToast("Please login to add favorites", "error");
      return;
    }

    // 1. Optimistic Update
    const newStatus = !isFavoriteLocal;
    setIsFavoriteLocal(newStatus);

    // 2. Feedback
    showToast(newStatus ? "Added to favorites" : "Removed from favorites");

    // 3. API Call
    toggle(placeId, {
      onError: () => {
        // Revert on error
        setIsFavoriteLocal(!newStatus);
        showToast("Action failed. Try again.", "error");
      },
    });
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handlePress}>
      {isPending ? (
        // Optional: Can keep spinner or just let the heart fill instantly.
        // User requested instant fill, so maybe removing spinner logic or keeping it subtle?
        // Let's keep the heart interactive but maybe show loading elsewhere if critical.
        // For "instant feel", we usually hide the loader or show it small.
        // But let's stick to the heart change.
        <Ionicons
          name={isFavoriteLocal ? "heart" : "heart-outline"}
          size={size}
          color={isFavoriteLocal ? "#E91E63" : color}
        />
      ) : (
        <Ionicons
          name={isFavoriteLocal ? "heart" : "heart-outline"}
          size={size}
          color={isFavoriteLocal ? "#E91E63" : color} // Pink if active, default if not
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});
