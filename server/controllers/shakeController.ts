import { Request, Response } from "express";
import { shakeService } from "../services/shakeService.js";

export const getShake = async (req: Request, res: Response): Promise<void> => {
  try {
    const budget = Number(req.query.budget) || 150; // Default budget if missing
    const zone =
      (req.query.zone as "All" | "Inside Campus" | "Outside Campus") || "All";
    const categories = req.query.categories as string;
    const amenities = req.query.amenities as string;

    const place = await shakeService.getRandomPlace({
      budget,
      zone,
      categories,
      amenities,
    });

    if (!place) {
      res
        .status(404)
        .json({ message: "No places found matching your criteria" });
      return;
    }

    res.status(200).json(place);
  } catch (error) {
    console.error("Shake Error:", error);
    res.status(500).json({ message: "Server error while shaking" });
  }
};

export const getShakeCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const budget = Number(req.query.budget) || 150;
    const zone =
      (req.query.zone as "All" | "Inside Campus" | "Outside Campus") || "All";
    const categories = req.query.categories as string;
    const amenities = req.query.amenities as string;

    const count = await shakeService.getMatchCount({
      budget,
      zone,
      categories,
      amenities,
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Shake Count Error:", error);
    res.status(500).json({ message: "Server error counting matches" });
  }
};
