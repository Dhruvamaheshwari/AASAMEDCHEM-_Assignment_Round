const { validationResult } = require('express-validator');
const pgUserModel = require('../models/pgUserModel');

// @desc    Create a new user
// @route   POST /api/v2/users
const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email } = req.body;
    const newUser = await pgUserModel.createUser(name, email);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === '23505') { // unique violation
      return res.status(400).json({ error: 'Email already exists' });
    }
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/v2/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await pgUserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/v2/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await pgUserModel.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user
// @route   PUT /api/v2/users/:id
const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email } = req.body;
    const updatedUser = await pgUserModel.updateUser(req.params.id, name, email);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    if (error.code === '23505') { // unique violation
      return res.status(400).json({ error: 'Email already exists' });
    }
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/v2/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await pgUserModel.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
