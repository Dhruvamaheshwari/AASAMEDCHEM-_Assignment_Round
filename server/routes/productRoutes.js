const express = require('express');
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes (or basic protected depending on rules, user requested public for search)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin-only write operations
router.post('/', protect, restrictTo('ADMIN'), productController.createProduct);
router.put('/:id', protect, restrictTo('ADMIN'), productController.updateProduct);
router.delete('/:id', protect, restrictTo('ADMIN'), productController.deleteProduct);

module.exports = router;
