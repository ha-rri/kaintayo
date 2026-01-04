const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const path = require("path");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static Assets (Local Images Backup)
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/places", require("./routes/placeRoutes"));
app.use("/api/v1/meals", require("./routes/mealRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

// Error Handler
const { errorHandler } = require("./middleware/errorMiddleware");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Basic Route
app.get("/", (req, res) => {
  res.send("KainTayo API is running...");
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
