import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
import connectDB from "./config/db.js";
import Place from "./models/Place.js";
import Meal from "./models/Meal.js";
import User from "./models/User.js";
import { MASTER_PLACES, MASTER_USERS } from "./data/masterSeed.js";

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    console.log(chalk.yellow("Clearing Database..."));
    await Place.deleteMany();
    await Meal.deleteMany();
    await User.deleteMany();

    console.log(chalk.green("Creating Users..."));
    const createdUsers = await User.create(MASTER_USERS);
    // Assuming StudentFoodie is [0] and Admin is [1]
    const mainUser = createdUsers[0]._id;

    console.log(chalk.green(`Seeding ${MASTER_PLACES.length} Places...`));

    for (const placeData of MASTER_PLACES) {
      // 1. Create Place
      const place = await Place.create({
        name: placeData.name,
        zoneMacro: placeData.zoneMacro,
        zoneMicro: placeData.zoneMicro,
        priceRange: placeData.priceRange, // Initial value, will be recalc'd
        amenities: placeData.amenities,
        categories: placeData.categories,
        coverImage: placeData.coverImage,
        status: placeData.status,
        submittedBy: mainUser,
      });

      // 2. Create Meals for this Place
      if (placeData.meals && placeData.meals.length > 0) {
        const mealsWithPlaceId = placeData.meals.map((meal) => ({
          ...meal,
          place: place._id,
          submittedBy: mainUser,
        }));
        await Meal.create(mealsWithPlaceId);
      }

      // 3. Force Recalculation of Price Range (Middleware triggers on save/delete, but bulk create might skip)
      // Actually, we are iterating, but Meal.create is static.
      // Let's manually trigger it to be safe.
      await Meal.computePriceRange(place._id as mongoose.Types.ObjectId);
    }

    console.log(chalk.cyan.inverse("Data Imported Successfully!"));
    process.exit();
  } catch (error) {
    console.error(chalk.red.inverse(`Error: ${error}`));
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Place.deleteMany();
    await Meal.deleteMany();
    await User.deleteMany();

    console.log(chalk.red.inverse("Data Destroyed!"));
    process.exit();
  } catch (error) {
    console.error(chalk.red.inverse(`Error: ${error}`));
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
