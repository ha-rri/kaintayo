const express = require("express");
const router = express.Router();
const {
  getPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/placeController");
const { protect, admin } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateRequest");
const {
  createPlaceSchema,
  updatePlaceSchema,
} = require("../schemas/placeSchema");

// Re-route into other resource routers
const mealRouter = require("./mealRoutes");
router.use("/:placeId/meals", mealRouter);

// Public: Get all places (Feed)

router.get("/", getPlaces);

// Protected: Create new place (Admin only)
router.post("/", protect, admin, validate(createPlaceSchema), createPlace);

// Single Place Operations
router
  .route("/:id")
  .get(getPlace)
  .put(protect, admin, validate(updatePlaceSchema), updatePlace)
  .delete(protect, admin, deletePlace);

module.exports = router;
