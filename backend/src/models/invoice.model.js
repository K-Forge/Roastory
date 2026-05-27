const mongoose = require('mongoose');

// Sub-esquema para cada ítem de la factura — snapshot inmutable del momento de facturar
const invoiceItemSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  // Relación con la orden — unique garantiza que una orden solo tenga una factura
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  // Cliente al que pertenece la factura
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Número de factura legible, generado automáticamente: INV-2026-00001
  invoiceNumber: {
    type: String,
    unique: true,
    trim: true
  },
  // Copia de los productos en el momento de facturar (inmutable)
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  // IVA calculado (19% en Colombia)
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
  // Fecha de emisión — separada de createdAt para claridad fiscal
  issuedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Método estático para generar el número secuencial de factura
// Cuenta cuántas facturas existen en el año actual y suma 1
invoiceSchema.statics.generateInvoiceNumber = async function () {
  const year = new Date().getFullYear();
  const count = await this.countDocuments({
    invoiceNumber: new RegExp(`^INV-${year}-`)
  });
  const sequence = String(count + 1).padStart(5, '0');
  return `INV-${year}-${sequence}`;
};

module.exports = mongoose.model('Invoice', invoiceSchema);
