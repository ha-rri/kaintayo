import User, { IUser } from "../models/User.js";
import Place from "../models/Place.js";
import { Types } from "mongoose";

export const userService = {
  /**
   * Format User Document to standard API response (DTO)
   */
  formatUserResponse(user: IUser) {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      favorites: user.favorites || [],
      contributionCount: user.contributionCount,
      createdAt: user.createdAt,
    };
  },

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return this.formatUserResponse(user);
  },

  /**
   * Get user favorites with populated place data
   */
  async getFavorites(userId: string) {
    const user = await User.findById(userId).populate({
      path: "favorites",
      select: "name coverImage priceRange categories nearestLandmark amenities",
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user.favorites;
  },

  /**
   * Toggle favorite status for a place
   */
  async toggleFavorite(userId: string, placeId: string) {
    // Check if place exists
    const place = await Place.findById(placeId);
    if (!place) {
      throw new Error("Place not found");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if already favorite
    const isFavorite = user.favorites.some(
      (id) => id.toString() === placeId.toString()
    );

    if (isFavorite) {
      // Remove
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== placeId.toString()
      );
    } else {
      // Add
      user.favorites.push(new Types.ObjectId(placeId));
    }

    await user.save();

    return {
      isFavorite: !isFavorite, // Return new status
    };
  },
};
