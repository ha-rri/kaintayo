import express from "express";
const router = express.Router({ mergeParams: true });
import {
  createMeal,
  deleteMeal,
  getMealsByPlace,
  updateMeal,
  getMyPendingMeals,
} from "../controllers/mealController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateRequest.js";
import { createMealSchema, updateMealSchema } from "../schemas/mealSchema.js";

// Note: This router handles both /api/v1/meals AND /api/v1/places/:placeId/meals
// If triggered from /api/v1/meals, mergeParams won't find placeId unless passed

// Public: Get meals for a specific place
router.get("/", getMealsByPlace);
router.get("/my-pending", protect, getMyPendingMeals);

// Create Meal (Linked to Place)
router.post("/", protect, validate(createMealSchema), createMeal);

// /api/v1/meals/:id
router
  .route("/:id")
  .put(protect, admin, validate(updateMealSchema), updateMeal)
  .delete(protect, admin, deleteMeal);

export default router;
