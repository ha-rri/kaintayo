import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/adminService";
import { Alert } from "react-native";

export const useAdminActions = () => {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: ({ type, id }: { type: "place" | "meal"; id: string }) =>
      adminService.approveItem(type, id),
    onSuccess: () => {
      // Refresh the pending list
      queryClient.invalidateQueries({ queryKey: ["admin", "pending"] });
      // Also refresh public feeds since a new item was added
      queryClient.invalidateQueries({ queryKey: ["places"] });
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to approve item"
      );
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ type, id }: { type: "place" | "meal"; id: string }) =>
      adminService.rejectItem(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending"] });
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to reject item"
      );
    },
  });

  return {
    approve: approveMutation.mutate,
    reject: rejectMutation.mutate,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};
