/** @format */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { protect } = require("./middleware/authMiddleware");
const { restrictTo } = require("./middleware/roleMiddleware");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const db = require("./config/db");

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // Allow localhost for local development
    // Allow any vercel.app domain for production/previews
    if (!origin || origin.includes('localhost') || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Auth Routes
app.use("/api/auth", authRoutes);

// Example of a Protected Route requiring SELLER or ADMIN role
app.get(
  "/api/seller-dashboard",
  protect,
  restrictTo("SELLER", "ADMIN"),
  (req, res) => {
    res.json({ message: "Welcome to the seller dashboard!", user: req.user });
  },
);

// --- PRODUCT CRUD ROUTES ---
app.use("/api/products", productRoutes);

// --- ORDER / QUOTATION ROUTES ---
app.use("/api/orders", orderRoutes);

// --- INVENTORY ROUTES ---
app.use("/api/inventory", inventoryRoutes);

// Health Check Route
app.get('/health', async (req, res, next) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ status: 'ok', db_time: result.rows[0].now });
  } catch (error) {
    next(error);
  }
});

// New pg.Pool MVC Routes
app.use('/api/v2/users', userRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
