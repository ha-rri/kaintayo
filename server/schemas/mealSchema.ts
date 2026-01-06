import { z } from "zod";

export const createMealSchema = z.object({
  body: z.object({
    title: z.string({ error: "Meal title is required" }).min(1),
    priceRegular: z
      .number({ error: "Regular price is required" })
      .min(0, "Price cannot be negative"),
    priceHalf: z.number().min(0, "Price cannot be negative").optional(),
    imageUrl: z.url({ error: "Cover image must be a valid URL" }).optional(),
  }),
});

export const updateMealSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    priceRegular: z.number().min(0).optional(),
    priceHalf: z.number().min(0).optional(),
    imageUrl: z.url({ error: "Cover image must be a valid URL" }).optional(),
    isApproved: z.boolean().optional(), // Admin might approve separately via update
  }),
});
