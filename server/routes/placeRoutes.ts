import express from "express";
const router = express.Router();
import {
  getPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
  getMyPendingPlaces,
} from "../controllers/placeController.js";
import {
  protect,
  admin,
  optionalProtect,
} from "../middleware/authMiddleware.js";
import validate from "../middleware/validateRequest.js";
import {
  createPlaceSchema,
  updatePlaceSchema,
} from "../schemas/placeSchema.js";

// Re-route into other resource routers
import mealRouter from "./mealRoutes.js";
router.use("/:placeId/meals", mealRouter);

// Public: Get all places (Feed)
router.get("/", optionalProtect, getPlaces);
router.get("/my-pending", protect, getMyPendingPlaces);

// Protected: Create new place (Pending for regular users)
router.post("/", protect, validate(createPlaceSchema), createPlace);

// Single Place Operations
router
  .route("/:id")
  .get(getPlace)
  .put(protect, admin, validate(updatePlaceSchema), updatePlace)
  .delete(protect, admin, deletePlace);

export default router;
