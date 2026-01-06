import { z } from "zod";

export const createPlaceSchema = z.object({
  body: z.object({
    name: z.string({ error: "Name is required" }).min(2, "Name too short"),
    zoneMacro: z.enum(["inside", "outside"] as const, {
      error: "Zone must be either 'inside' or 'outside'",
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
    zoneMacro: z.enum(["inside", "outside"] as const).optional(),
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
