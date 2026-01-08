import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contributeService } from "../services/contributeService";
import { ContributeFormData } from "../types/contribute.types";

export const useContribute = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ContributeFormData) =>
      contributeService.submitContribution(data),
    onSuccess: () => {
      // Invalidate feed or relevant queries
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });

  return mutation;
};
