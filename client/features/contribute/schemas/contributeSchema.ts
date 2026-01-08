import { z } from "zod";
import { CATEGORIES, AMENITIES, ZONES } from "../constants/taxonomy";

// Helper to create Zod enum from const array with custom error messages
const CategoryEnum = z.enum(CATEGORIES, {
  error: "Please select a valid category",
});
const AmenityEnum = z.enum(AMENITIES);
const ZoneEnum = z.enum(ZONES, {
  error: "Please select a valid campus zone",
});

export const placeSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Place name must be at least 2 characters" }),
  zone: ZoneEnum,
  nearestLandmark: z
    .string()
    .min(2, { error: "Landmark must be at least 2 characters" })
    .optional(),
  categories: z
    .array(CategoryEnum)
    .min(1, { error: "Select at least one category" }),
  amenities: z.array(AmenityEnum).optional(),
  coverImage: z.url({ message: "Cover image must be a valid URL" }).optional(),
});

export const mealSchema = z
  .object({
    title: z
      .string()
      .min(2, { error: "Meal name must be at least 2 characters" }),
    // using pipe to ensure output is number
    priceRegular: z.coerce
      .number({ error: "Price must be a number" })
      .min(1, { error: "Price must be valid" }),
    priceHalf: z.coerce.number().optional(),
    imageUri: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.priceHalf !== undefined && data.priceHalf !== null) {
        return data.priceHalf < data.priceRegular;
      }
      return true;
    },
    {
      message: "Half order price must be less than regular price",
      path: ["priceHalf"],
    }
  );

// Discriminated Union for better validation logic
export const contributeSchema = z.discriminatedUnion("isNewPlace", [
  // 1. New Place: Requires 'place' object, ignores 'placeId'
  z.object({
    isNewPlace: z.literal(true),
    place: placeSchema,
    placeId: z.string().optional(),
    meal: mealSchema,
  }),
  // 2. Existing Place: Requires 'placeId', ignores 'place' errors
  z.object({
    isNewPlace: z.literal(false),
    // We use z.any() here so that leftover form state in 'place' doesn't trigger validation errors
    place: z.any().optional(),
    placeId: z
      .string({ error: "Please select a place" })
      .min(1, "Please select a place"),
    meal: mealSchema,
  }),
]);
