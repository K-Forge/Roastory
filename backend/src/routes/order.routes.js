const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} = require('../controllers/order.controller');

// Create a new order (Sale)
router.post('/', createOrder);

// Retrieve all orders
router.get('/', getOrders);

// Retrieve a specific order by ID
router.get('/:id', getOrderById);

// Update order status/details
router.put('/:id', updateOrder);

// Delete/cancel an order
router.delete('/:id', deleteOrder);

module.exports = router;