const Order = require('../models/order.model');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount, status, paymentMethod } = req.body;

    const newOrder = new Order({
      customer,
      items,
      totalAmount,
      status: status || 'PENDING',
      paymentMethod
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Retrieve all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email') // Will populate user details once User model exists
      .populate('items.product', 'name price'); // Will populate product details

    res.status(200).json({
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving orders',
      error: error.message
    });
  }
};

// Retrieve a specific order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('customer', 'name email')
      .populate('items.product', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving order',
      error: error.message
    });
  }
};

// Update an order (e.g., change status)
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentMethod } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { status, paymentMethod } },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating order',
      error: error.message
    });
  }
};

// Delete or cancel an order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Instead of completely deleting, we could change status to 'CANCELLED',
    // but a DELETE endpoint generally removes the resource or hard-cancels it.
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting order',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};