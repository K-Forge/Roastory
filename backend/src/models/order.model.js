const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER']
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Order', orderSchema);