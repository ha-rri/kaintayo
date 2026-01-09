import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { securityMiddleware } from "./middleware/securityMiddleware.js";

// Routes Imports
import authRoutes from "./routes/authRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security Middleware
app.use(helmet()); // Security Headers

// Rate Limiting (Global: 100 requests per 10 mins)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(securityMiddleware); // Prevent NoSQL Injection

// Static Assets (Local Images Backup)
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/places", placeRoutes);
app.use("/api/v1/meals", mealRoutes);
app.use("/api/v1/admin", adminRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Basic Route
app.get("/", (req: Request, res: Response) => {
  res.send("KainTayo API is running...");
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
