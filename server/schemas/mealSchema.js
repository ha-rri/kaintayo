const { z } = require("zod");

const createMealSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Meal title is required" }).min(1),
    priceRegular: z
      .number({ required_error: "Regular price is required and must be a number" })
      .min(0, "Price cannot be negative"),
    priceHalf: z.number().min(0).optional(),
    imageUrl: z.string().url().optional(),
  }),
});

const updateMealSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    priceRegular: z.number().min(0).optional(),
    priceHalf: z.number().min(0).optional(),
    imageUrl: z.string().url().optional(),
    isApproved: z.boolean().optional(), // Admin might approve separately via update
  }),
});

module.exports = {
  createMealSchema,
  updateMealSchema,
};
