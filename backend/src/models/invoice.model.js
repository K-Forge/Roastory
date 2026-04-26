const mongoose = require('mongoose');



const invoiceSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invoiceNumber: {
    type: String,
    unique: true,
    trim: true
  },
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER']
  },
  status: {
    type: String,
    enum: ['ISSUED', 'PAID', 'VOIDED'],
    default: 'ISSUED'
  },
  issuedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});


invoiceSchema.statics.generateInvoiceNumber = async function () {
  const year = new Date().getFullYear();
  const count = await this.countDocuments({
    invoiceNumber: new RegExp(`^INV-${year}-`)
  });
  const sequence = String(count + 1).padStart(5, '0');
  return `INV-${year}-${sequence}`;
};

module.exports = mongoose.model('Invoice', invoiceSchema);
