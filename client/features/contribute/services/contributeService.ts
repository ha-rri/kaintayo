import axios from "@/lib/axios";
import { ContributeFormData } from "../types/contribute.types";
import { APIResponse } from "@/types/common";
import { Place } from "@/types/Place";
import { Meal } from "@/types/Meal";

export const contributeService = {
  // 1. Create a Place (If New)
  createPlace: async (data: ContributeFormData["place"]): Promise<Place> => {
    // Map UI "Inside Campus" -> "inside"
    const mapZone = (zone?: string) => {
      if (zone === "Inside Campus") return "inside";
      if (zone === "Outside Campus") return "outside";
      return "inside"; // Default fallback
    };

    const payload = {
      name: data?.name,
      zoneMacro: mapZone(data?.zone),
      nearestLandmark: data?.nearestLandmark, // Correct field name
      categories: data?.categories,
      amenities: data?.amenities,
      coverImage: data?.coverImage, // ✅ Fix: Include coverImage!
    };

    const response = await axios.post<APIResponse<Place>>("/places", payload);
    return response.data.data;
  },

  // 2. Add Meal to Place
  addMeal: async (
    placeId: string,
    data: ContributeFormData["meal"]
  ): Promise<Meal> => {
    const payload = {
      title: data.title,
      priceRegular: data.priceRegular,
      priceHalf: data.priceHalf,
      imageUri: data.imageUri, // Will be replaced by Cloudinary URL later
    };

    const response = await axios.post<APIResponse<Meal>>(
      `/places/${placeId}/meals`,
      payload
    );
    return response.data.data;
  },

  // Combined Workflow
  submitContribution: async (data: ContributeFormData) => {
    let placeId = data.placeId;

    // Step 1: Create Place if needed
    if (data.isNewPlace && data.place) {
      const newPlace = await contributeService.createPlace(data.place);
      placeId = newPlace._id;
    }

    if (!placeId) throw new Error("Missing Place ID");

    // Step 2: Add Meal
    return await contributeService.addMeal(placeId, data.meal);
  },
};
