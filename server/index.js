/** @format */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const authenticate = require("./middleware/auth");
const authorize = require("./middleware/roleCheck");

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "supersecret_fallback";

// POST /api/auth/register -> create SELLER, bcrypt hash
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user with SELLER role
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: "SELLER",
      },
    });

    res.status(201).json({
      message: "SELLER registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/login -> return JWT
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const Puser = await prisma.user.findUnique({ where: { email } });
    if (!Puser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, Puser.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token attaching the user's role and ID
    const token = jwt.sign(
      { id: Puser.id, email: Puser.email, role: Puser.role },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: Puser.id,
        name: Puser.name,
        email: Puser.email,
        role: Puser.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Example of a Protected Route requiring SELLER or ADMIN role
app.get(
  "/api/seller-dashboard",
  authenticate,
  authorize(["SELLER", "ADMIN"]),
  (req, res) => {
    res.json({ message: "Welcome to the seller dashboard!", user: req.user });
  },
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
