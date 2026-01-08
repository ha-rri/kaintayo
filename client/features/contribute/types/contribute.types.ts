import { z } from "zod";
import {
  placeSchema,
  mealSchema,
  contributeSchema,
} from "../schemas/contributeSchema";

export type PlaceFormData = z.infer<typeof placeSchema>;
export type MealFormData = z.infer<typeof mealSchema>;
export type ContributeFormData = z.infer<typeof contributeSchema>;
