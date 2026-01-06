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

    // 3. Create Places
    const places = await Place.create([
      {
        submittedBy: adminUser,
        name: "Ate Rica's Bacsilog",
        zoneMacro: "inside",
        zoneMicro: "Gate 1", // Just a sample
        amenities: ["Charging"],
        categories: ["Rice Meals"],
        status: "active",
        coverImage: "https://placehold.co/600x400/orange/white?text=Bacsilog",
      },
      {
        submittedBy: adminUser,
        name: "Jollibee",
        zoneMacro: "outside",
        zoneMicro: "Gate 1",
        amenities: ["Aircon", "Wifi"],
        categories: ["Fast Food", "Chicken"],
        status: "active",
        coverImage: "https://placehold.co/600x400/red/white?text=Jollibee",
      },
      {
        submittedBy: adminUser,
        name: "Dimsum Treats",
        zoneMacro: "outside",
        zoneMicro: "Dapitan",
        amenities: ["Aircon"],
        categories: ["Siomai", "Rice Meals"],
        status: "active",
        coverImage: "https://placehold.co/600x400/green/white?text=Dimsum",
      },
    ]);

    console.log("Places Imported...");

    // 4. Create Meals
    // Note: prices might range.
    await Meal.create([
      {
        submittedBy: adminUser,
        place: places[0]._id, // Bacsilog
        title: "Original Bacsilog",
        priceRegular: 69,
        isApproved: true,
      },
      {
        submittedBy: adminUser,
        place: places[0]._id,
        title: "Tapsilog",
        priceRegular: 85,
        isApproved: true,
      },
      {
        submittedBy: adminUser,
        place: places[1]._id, // Jollibee
        title: "1pc Chickenjoy w/ Rice",
        priceRegular: 89,
        isApproved: true,
      },
      {
        submittedBy: adminUser,
        place: places[2]._id, // Dimsum
        title: "Siomai Rice",
        priceRegular: 35,
        isApproved: true,
      },
    ]);

    console.log("Meals Imported...");

    // 5. Trigger Re-Calculation Explicitly
    // This ensures that even if the hooks didn't finish in time, we force the update now.
    await Meal.computePriceRange(places[0]._id); // Bacsilog
    await Meal.computePriceRange(places[1]._id); // Jollibee
    await Meal.computePriceRange(places[2]._id); // Dimsum
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
