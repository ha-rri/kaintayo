import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User.js";
import { authService } from "../services/authService.js";

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

    // Create user (Middleware will hash password)
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          token: authService.generateToken(user._id.toString()),
        },
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
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

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          token: authService.generateToken(user._id.toString()),
        },
      });
    } else {
      res.status(401);
      throw new Error("Incorrect email or password");
    }
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
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
