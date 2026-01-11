import express from "express";
import { getShake, getShakeCount } from "../controllers/shakeController.js";
// Note: Shake is public, so maybe optional auth, but generally open.
// If we wanted to track user shake history, we'd add protect.
// For now, keeping it public as per feature nature.

const router = express.Router();

router.get("/", getShake);
router.get("/count", getShakeCount);

export default router;
