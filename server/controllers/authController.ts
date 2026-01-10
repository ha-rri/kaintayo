import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User.js";
import { authService } from "../services/authService.js";
import { userService } from "../services/userService.js";

interface AuthRequest extends Request {
  user?: IUser;
}

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    const user = await authService.registerUser({ username, email, password });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser({ email, password });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user data
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401);
      throw new Error("Not authorized");
    }

    res.status(200).json({
      success: true,
      data: userService.formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};
