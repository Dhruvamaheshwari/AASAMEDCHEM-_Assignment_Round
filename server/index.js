/** @format */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { protect } = require("./middleware/authMiddleware");
const { restrictTo } = require("./middleware/roleMiddleware");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const db = require("./config/db");

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

// GET /api/products (Public or Protected based on your needs, making it public for search/filtering)
app.get("/api/products", async (req, res) => {
  try {
    const { search } = req.query;
    const products = await prisma.product.findMany({
      where:
        search ?
          {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/products (ADMIN only)
app.post(
  "/api/products",
  protect,
  restrictTo("ADMIN"),
  async (req, res) => {
    try {
      const { name, sku, description, baseUnit, basePrice, stockQuantity } =
        req.body;
      const product = await prisma.product.create({
        data: {
          name,
          sku,
          description,
          baseUnit,
          basePrice,
          stockQuantity: stockQuantity || 0,
        },
      });
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// PUT /api/products/:id (ADMIN only)
app.put(
  "/api/products/:id",
  protect,
  restrictTo("ADMIN"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, sku, description, baseUnit, basePrice, stockQuantity } =
        req.body;
      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          name,
          sku,
          description,
          baseUnit,
          basePrice,
          stockQuantity,
        },
      });
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// DELETE /api/products/:id (ADMIN only)
app.delete(
  "/api/products/:id",
  protect,
  restrictTo("ADMIN"),
  async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.product.delete({
        where: { id: parseInt(id) },
      });
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

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
