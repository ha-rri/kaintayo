import express from "express";
import { getShake, getShakeCount } from "../controllers/shakeController.js";

const router = express.Router();

router.get("/", getShake);
router.get("/count", getShakeCount);

export default router;
