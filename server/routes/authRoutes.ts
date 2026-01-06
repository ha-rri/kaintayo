import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";
import validate from "../middleware/validateRequest.js";
import { registerSchema, loginSchema } from "../schemas/authSchema.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/me", protect, getMe);

export default router;
