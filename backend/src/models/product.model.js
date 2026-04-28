const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
    maxlength: 150
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: ['COFFEE', 'BOOK', 'PASTRY', 'OTHER'],
    uppercase: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true
  },
  author: {
    type: String,
    trim: true,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', category: 1 });

module.exports = mongoose.model('Product', productSchema);