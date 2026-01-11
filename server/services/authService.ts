import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User.js";
import { userService } from "./userService.js";

export const authService = {
  /**
   * Generate JWT Token
   */
  generateToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: "30d",
    });
  },

  /**
   * Register a new user
   */
  async registerUser(userData: Partial<IUser>) {
    const { username, email, password } = userData;

    // Check if user exists (Email)
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new Error("User already exists"); // Generic or specific "Email already taken"
    }

    // Check if username exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      throw new Error("Username already taken");
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      return {
        ...userService.formatUserResponse(user),
        token: this.generateToken(user._id.toString()),
      };
    } else {
      throw new Error("Invalid user data");
    }
  },

  /**
   * Login user
   */
  async loginUser(credentials: { email?: string; password?: string }) {
    const { email, password } = credentials;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password!))) {
      return {
        ...userService.formatUserResponse(user),
        token: this.generateToken(user._id.toString()),
      };
    } else {
      throw new Error("Incorrect email or password");
    }
  },
};
