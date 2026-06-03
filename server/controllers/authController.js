const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret_fallback";

const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
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
    next(error);
  }
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

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
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // In JWT, logout is mostly handled client-side by deleting the token.
    // If using cookies, we could clear it here.
    res.json({ message: "Logout successful. Please remove token on client side." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout
};
