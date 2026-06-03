const express = require('express');
const { body, param } = require('express-validator');
const userController = require('../controllers/userController');

const router = express.Router();

// Validation chains
const validateUser = [
  body('name').notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
  body('email').isEmail().withMessage('Must be a valid email').isLength({ max: 150 })
];

const validateId = [
  param('id').isInt().withMessage('ID must be an integer')
];

// Routes
router.post('/', validateUser, userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', validateId, userController.getUserById);
router.put('/:id', [validateId, validateUser], userController.updateUser);
router.delete('/:id', validateId, userController.deleteUser);

module.exports = router;
