import mongoose, { Document, Model, Schema } from "mongoose";
import Place from "./Place.js";

// 1. Interface for Document
export interface IMeal extends Document {
  place: mongoose.Types.ObjectId;
  title: string;
  priceRegular: number;
  priceHalf?: number;
  imageUri?: string;
  isApproved: boolean;
  submittedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Interface for Model (Statics)
interface IMealModel extends Model<IMeal> {
  computePriceRange(_placeId: mongoose.Types.ObjectId): Promise<void>;
}

const MealSchema = new Schema<IMeal, IMealModel>(
  {
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Please provide a meal name"],
      trim: true,
    },

    // Student Hack
    priceRegular: {
      type: Number,
      required: [true, "Please provide the regular price"],
    },
    priceHalf: {
      type: Number,
      // Optional: If exists, UI shows 1/2 icon
    },

    imageUri: { type: String }, // Cloudinary URL

    // Moderation
    isApproved: {
      type: Boolean,
      default: false,
    }, // "Wizard of Oz" moderation

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Static Method to get Price Range
MealSchema.statics.computePriceRange = async function (
  placeId: mongoose.Types.ObjectId
) {
  try {
    const obj = await this.aggregate([
      {
        $match: { place: placeId, isApproved: true },
      },
      {
        $group: {
          _id: "$place",
          minPrice: { $min: "$priceRegular" },
          maxPrice: { $max: "$priceRegular" },
        },
      },
    ]);

    try {
      await Place.findByIdAndUpdate(placeId, {
        priceRange: {
          min: obj[0]?.minPrice || 0,
          max: obj[0]?.maxPrice || 0,
        },
      });
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
};

// Call after SAVE
MealSchema.post("save", function () {
  (this.constructor as IMealModel).computePriceRange(this.place);
});

// Call after DELETE
MealSchema.post("deleteOne", { document: true, query: false }, function () {
  (this.constructor as IMealModel).computePriceRange(this.place);
});

const Meal = mongoose.model<IMeal, IMealModel>("Meal", MealSchema);
export default Meal;
