const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

const router = express.Router();

// All inventory routes require ADMIN privileges
router.use(protect);
router.use(restrictTo('ADMIN'));

// Get all inventory
router.get('/', inventoryController.getInventory);

// Update specific product stock
router.patch('/:productId', inventoryController.updateStock);

module.exports = router;
