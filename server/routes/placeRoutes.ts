import express from "express";
const router = express.Router();
import {
  getPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
  getShakePlaces, // ✅ Imported here
} from "../controllers/placeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateRequest.js";
import {
  createPlaceSchema,
  updatePlaceSchema,
} from "../schemas/placeSchema.js";
import mealRouter from "./mealRoutes.js";

// Re-route into other resource routers
router.use("/:placeId/meals", mealRouter);

// Public: Get all places (Feed)
router.get("/", getPlaces);

// ---------------------------------------------------------
// ✅ NEW SHAKE ROUTE (Must be before /:id)
router.get("/shake", getShakePlaces);
// ---------------------------------------------------------

// Protected: Create new place
router.post("/", protect, validate(createPlaceSchema), createPlace);

// Single Place Operations
router
  .route("/:id")
  .get(getPlace)
  .put(protect, admin, validate(updatePlaceSchema), updatePlace)
  .delete(protect, admin, deletePlace);

export default router;