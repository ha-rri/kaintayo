import express from "express";
const router = express.Router({ mergeParams: true });
import {
  getMealsByPlace,
  createMeal,
  updateMeal,
  deleteMeal,
} from "../controllers/mealController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateRequest.js";
import { createMealSchema, updateMealSchema } from "../schemas/mealSchema.js";

// /api/v1/places/:placeId/meals
router
  .route("/")
  .get(getMealsByPlace)
  .post(protect, validate(createMealSchema), createMeal);

// /api/v1/meals/:id
router
  .route("/:id")
  .put(protect, admin, validate(updateMealSchema), updateMeal)
  .delete(protect, admin, deleteMeal);

export default router;
