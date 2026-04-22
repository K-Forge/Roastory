const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['ADMIN', 'INVENTORY_MANAGER', 'CASHIER', 'CUSTOMER'],
    default: 'CUSTOMER'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);