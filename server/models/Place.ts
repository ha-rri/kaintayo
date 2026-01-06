import mongoose, { Document, Schema } from "mongoose";

export interface IPlace extends Document {
  name: string;
  zoneMacro: "inside" | "outside";
  zoneMicro?: string;
  priceRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  categories: string[];
  coverImage?: string;
  status: "active" | "pending";
  submittedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PlaceSchema = new Schema<IPlace>(
  {
    // Indexing name allows fast autocomplete search
    name: {
      type: String,
      required: [true, "Please provide a place name"],
      trim: true,
      index: true,
    },

    // Filtering Fields
    zoneMacro: {
      type: String,
      enum: ["inside", "outside"],
      required: [true, "Please specify if Inside or Outside campus"],
    },
    zoneMicro: {
      type: String,
      // Optional: Users might not know the exact "Micro" zone initially.
    },

    // Optimized for Filter Sliders
    priceRange: {
      min: { type: Number, default: 0, index: true },
      max: { type: Number, default: 0, index: true },
    },

    // Searchable Tags
    amenities: [{ type: String }], // ["Aircon", "Wifi", "Charging"]
    categories: [{ type: String }], // ["Rice Meals", "Cafe", "Meryenda"]

    // Media
    coverImage: { type: String }, // Cloudinary URL

    // Moderation
    status: {
      type: String,
      enum: ["active", "pending"],
      default: "pending",
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Place = mongoose.model<IPlace>("Place", PlaceSchema);
export default Place;
