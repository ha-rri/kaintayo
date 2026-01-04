const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getMealsByPlace,
  createMeal,
  updateMeal,
  deleteMeal,
} = require("../controllers/mealController");
const { protect, admin } = require("../middleware/authMiddleware");

// /api/v1/places/:placeId/meals
router.route("/").get(getMealsByPlace).post(protect, createMeal);

// /api/v1/meals/:id
router
  .route("/:id")
  .put(protect, admin, updateMeal)
  .delete(protect, admin, deleteMeal);

module.exports = router;
