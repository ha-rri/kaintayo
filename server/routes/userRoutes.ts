import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getFavorites, toggleFavorite } from "../controllers/userController.js";

const router = express.Router();

router.get("/favorites", protect, getFavorites);
router.post("/favorites/:placeId", protect, toggleFavorite);

export default router;
