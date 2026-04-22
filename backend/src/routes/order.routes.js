const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} = require('../controllers/order.controller');

// Import the real middleware from Brian's implementation
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// Create a new order (Sale) - Protected: Must be logged in
router.post('/', verifyToken, createOrder);

// Retrieve all orders - Protected: Must be logged in
router.get('/', verifyToken, getOrders);

// Retrieve a specific order by ID - Protected: Must be logged in
router.get('/:id', verifyToken, getOrderById);

// Update order status/details - Protected: Must be ADMIN or CASHIER
router.put('/:id', verifyToken, requireRole(['ADMIN', 'CASHIER']), updateOrder);

// Delete/cancel an order - Protected: Must be ADMIN ONLY
router.delete('/:id', verifyToken, requireRole(['ADMIN']), deleteOrder);

module.exports = router;