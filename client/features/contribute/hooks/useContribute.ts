import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contributeService } from "../services/contributeService";
import { ContributeFormData } from "../types/contribute.types";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const useContribute = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: ContributeFormData) => {
      // 1. Handle Image Uploads First (if any)
      const uploadPromises = [];
      let finalData = { ...data };

      // Helper to check for local file URI
      const isLocalFile = (uri?: string) => uri?.startsWith("file://");

      // Check Place Image
      if (finalData.isNewPlace && isLocalFile(finalData.place?.coverImage)) {
        uploadPromises.push(
          uploadToCloudinary(finalData.place.coverImage!).then((url) => {
            if (url) finalData.place.coverImage = url;
          })
        );
      }

      // Check Meal Image
      if (isLocalFile(finalData.meal.imageUri)) {
        uploadPromises.push(
          uploadToCloudinary(finalData.meal.imageUri!).then((url) => {
            if (url) finalData.meal.imageUri = url;
          })
        );
      }

      // Wait for all uploads
      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      // 2. Submit Final Payload to Backend
      return contributeService.submitContribution(finalData);
    },
    onSuccess: () => {
      // Invalidate feed or relevant queries
      queryClient.invalidateQueries({ queryKey: ["places"] });
      queryClient.invalidateQueries({ queryKey: ["myPendingContributions"] });
    },
  });

  return mutation;
};
