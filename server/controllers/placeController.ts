import { Request, Response, NextFunction } from "express";
import Place, { IPlace } from "../models/Place.js";
import { IUser } from "../models/User.js";
import { placeService } from "../services/placeService.js";

interface AuthRequest extends Request {
  user?: IUser;
}

// ✅ NEW: Shake Feature Controller (Fixed)
export const getShakePlaces = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { maxBudget, zone } = req.query;

    // ✅ FIX: Using 'any' bypasses the strict Mongoose type check
    // This removes the red underline while keeping the query logic valid
    const query: any = { status: "active" };

    // Map Frontend "Inside Campus" -> Backend "inside"
    if (zone === "Inside Campus") {
      query.zoneMacro = "inside";
    } else if (zone === "Outside Campus") {
      query.zoneMacro = "outside";
    }

    // Handle Budget (Price Range)
    if (maxBudget) {
      // Check if the MINIMUM price of the place is <= User's Budget
      query["priceRange.min"] = { $lte: Number(maxBudget) };
    }

    // Fetch the data
    const places = await Place.find(query)
      .select("name zoneMacro nearestLandmark priceRange coverImage amenities categories")
      .lean();

    res.json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all places with filters
export const getPlaces = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      zoneMacro,
      maxPrice,
      search,
      categories,
      amenities,
      scope,
      page,
      limit,
    } = req.query as unknown as {
      zoneMacro?: string;
      maxPrice?: string;
      search?: string;
      categories?: string;
      amenities?: string;
      scope?: "global" | "store";
      page?: string;
      limit?: string;
    };

    const result = await placeService.getAllPlaces({
      zoneMacro,
      maxPrice,
      search,
      categories,
      amenities,
      scope,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single place
export const getPlace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate({
        path: "meals",
        match: { isApproved: true },
      })
      .populate("submittedBy", "username");

    if (!place) {
      res.status(404);
      throw new Error("Place not found");
    }

    res.json({ success: true, data: place });
  } catch (error) {
    next(error);
  }
};

// @desc    Update place
export const updatePlace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!place) {
      res.status(404);
      throw new Error("Place not found");
    }

    res.json({ success: true, data: place });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete place
export const deletePlace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      res.status(404);
      throw new Error("Place not found");
    }

    await place.deleteOne();

    res.json({ success: true, data: {}, message: "Place deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new place
export const createPlace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    const existingPending = await placeService.checkDuplicatePending(
      req.body.name
    );
    if (existingPending) {
      res.status(409).json({
        success: false,
        message: "A request for this place already exists and is pending review.",
        data: existingPending,
      });
      return;
    }

    const place = await Place.create({
      ...req.body,
      submittedBy: req.user._id,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      data: place,
      message: "Place submitted for review",
    });
  } catch (error) {
    next(error);
  }
};