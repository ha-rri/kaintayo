const { z } = require("zod");

const createPlaceSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Place name is required" })
      .min(2, "Name too short"),
    zoneMacro: z.enum(["Inside", "Outside"], {
      required_error: "Zone Macro is required (Inside/Outside)",
    }),
    // Optional fields
    zoneMicro: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    coverImage: z.string().url("Cover image must be a valid URL").optional(),
  }),
});

const updatePlaceSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    zoneMacro: z.enum(["Inside", "Outside"]).optional(),
    zoneMicro: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    coverImage: z.string().url().optional(),
    status: z.enum(["active", "pending", "rejected"]).optional(), // Admin might update status
  }),
});

module.exports = {
  createPlaceSchema,
  updatePlaceSchema,
};
