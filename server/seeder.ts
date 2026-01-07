import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Load env vars
dotenv.config();

// Load Models
import User from "./models/User.js";
import Place from "./models/Place.js";
import Meal from "./models/Meal.js";

// Connect to DB
import { MASTER_PLACES, SeedPlace } from "./data/masterSeed.js";

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI);
}

const importData = async () => {
  try {
    // 1. Clear Data
    await User.deleteMany();
    await Place.deleteMany();
    await Meal.deleteMany();

    console.log("Data Destroyed...");

    // 2. Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    const createdUsers = await User.create([
      {
        username: "Admin User",
        email: "admin@kaintayo.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        username: "John Student",
        email: "student@kaintayo.com",
        password: hashedPassword,
        role: "user",
      },
    ]);

    const adminUser = createdUsers[0]._id;

    // 3. Create Places & Meals
    for (const placeData of MASTER_PLACES as SeedPlace[]) {
      const place = await Place.create({
        submittedBy: adminUser,
        name: placeData.name,
        zoneMacro: placeData.zoneMacro,
        zoneMicro: placeData.zoneMicro,
        amenities: placeData.amenities,
        categories: placeData.categories,
        status: placeData.status,
        coverImage: placeData.coverImage,
      });

      // Create Meals for this Place
      const mealDocs = placeData.meals.map((meal) => ({
        submittedBy: adminUser,
        place: place._id,
        title: meal.title,
        priceRegular: meal.priceRegular,
        priceHalf: meal.priceHalf,
        isApproved: meal.isApproved,
      }));

      await Meal.create(mealDocs);

      // Explicitly compute price range to ensure data consistency immediately
      try {
        await Meal.computePriceRange(place._id as mongoose.Types.ObjectId);
      } catch (error) {
        console.error(
          `Failed to compute price range for ${place.name}:`,
          error
        );
      }
    }

    console.log(`Imported ${MASTER_PLACES.length} Places and their meals...`);

    // 5. Trigger Re-Calculation Explicitly
    // This ensures that even if the hooks didn't finish in time, we force the update now.
    // The price range computation is now handled within the loop for each place.
    console.log("Price Ranges Calculated...");

    console.log("Data Imported!");
    process.exit();
  } catch (err) {
    console.error(`${err}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Place.deleteMany();
    await Meal.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (err) {
    console.error(`${err}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
