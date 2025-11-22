const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth");
const portfolioRoutes = require("./routes/portfolio");

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);

// Server
const PORT = process.env.PORT || 5000;

// Wait for DB before listening
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log("Server running on port " + PORT));
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
})();
