const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} = require('../controllers/order.controller');

// TODO: Import Brian's middleware when merging
// const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
// NOTE: I am adding temporary placeholders here so your code works locally and doesn't break until the merge.
const verifyToken = (req, res, next) => next(); 
const requireRole = (role) => (req, res, next) => next();

// Create a new order (Sale) - Protected: Must be logged in

// Retrieve all orders - Protected: Must be logged in
router.get('/', getOrders);

// Retrieve a specific order by ID - Protected: Must be logged in
router.get('/:id', getOrderById);

// Update order status/details - Protected: Must be ADMIN or CASHIER
router.put('/:id', verifyToken, requireRole('ADMIN'), updateOrder);

// Delete/cancel an order - Protected: Must be ADMIN ONLY
router.delete('/:id', verifyToken, requireRole('ADMIN'), deleteOrder);

module.exports = router;