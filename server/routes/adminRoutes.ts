import express from "express";
const router = express.Router();
import {
  getPendingItems,
  approveItem,
  rejectItem,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// All routes are protected and admin-only
router.use(protect);
router.use(admin);

router.get("/pending", getPendingItems);
router.patch("/approve/:type/:id", approveItem);
router.delete("/reject/:type/:id", rejectItem);

export default router;
