const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

// @route   POST /api/auth/register
// @desc    Register a new user and hash password with Bcrypt
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT token
// @access  Public
router.post('/login', login);

module.exports = router;