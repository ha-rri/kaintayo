import { z } from "zod";

export const createPlaceSchema = z.object({
  body: z.object({
    name: z.string({ error: "Name is required" }).min(2, "Name too short"),
    zoneMacro: z.enum(["Inside", "Outside"] as const, {
      error: "Zone must be either 'Inside' or 'Outside'",
    }),

    // Optional fields
    zoneMicro: z.string().optional(),
    amenities: z
      .array(z.string(), { error: "Amenities must be an array of strings" })
      .optional(),
    categories: z
      .array(z.string(), { error: "Categories must be an array of strings" })
      .optional(),
    coverImage: z.url({ error: "Cover image must be a valid URL" }).optional(),
  }),
});

export const updatePlaceSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    zoneMacro: z.enum(["Inside", "Outside"] as const).optional(),
    zoneMicro: z.string().optional(),
    amenities: z
      .array(z.string(), { error: "Amenities must be an array of strings" })
      .optional(),
    categories: z
      .array(z.string(), { error: "Categories must be an array of strings" })
      .optional(),
    coverImage: z.url({ error: "Cover image must be a valid URL" }).optional(),
    status: z.enum(["active", "pending", "rejected"] as const).optional(),
  }),
});
