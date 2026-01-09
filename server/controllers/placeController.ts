import { Request, Response, NextFunction } from "express";
import Place from "../models/Place.js";
import { IUser } from "../models/User.js";
import { placeService } from "../services/placeService.js";

// Interface for Protected Request
interface AuthRequest extends Request {
  user?: IUser;
}

// @desc    Get all places with filters
// @route   GET /api/v1/places
// @access  Public
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
      ...result, // { data, meta }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single place
// @route   GET /api/v1/places/:id
// @access  Public
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
// @route   PUT /api/v1/places/:id
// @access  Private/Admin
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
// @route   DELETE /api/v1/places/:id
// @access  Private/Admin
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
// @route   POST /api/v1/places
// @access  Private
export const createPlace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Safety First: All submissions (even Admin) start as pending
    // This allows reviewing data before it goes live.
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    // Duplicate Check
    const existingPending = await placeService.checkDuplicatePending(
      req.body.name
    );
    if (existingPending) {
      res.status(409).json({
        success: false,
        message:
          "A request for this place already exists and is pending review.",
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
