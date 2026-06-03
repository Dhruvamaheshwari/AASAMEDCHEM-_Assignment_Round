const express = require('express');
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

const router = express.Router();

// All order routes require authentication
router.use(protect);

// Quotation flow
router.post('/quotation', orderController.createQuotation);
router.get('/my-quotations', orderController.getMyQuotations);

// Order flow
router.get('/my-orders', orderController.getMyOrders);
router.post('/:id/place', orderController.placeOrder);
router.get('/:id', orderController.getOrderDetails);

// Admin only routes
router.get('/', restrictTo('ADMIN'), orderController.getAllOrdersForAdmin);

module.exports = router;
