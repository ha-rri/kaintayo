const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getMealsByPlace,
  createMeal,
  updateMeal,
  deleteMeal,
} = require("../controllers/mealController");
const { protect, admin } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateRequest");
const { createMealSchema, updateMealSchema } = require("../schemas/mealSchema");

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

module.exports = router;
