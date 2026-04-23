const express = require('express');
const router = express.Router();
const { register, login, getProfile, getAdminData } = require('../controllers/auth.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// @route   POST /api/auth/register
// @desc    Register a new user and hash password with Bcrypt
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get user profile (Protected route)
// @access  Private
router.get('/me', verifyToken, getProfile);

// @route   GET /api/auth/admin
// @desc    Get admin specific data (Protected & Role Restricted)
// @access  Private (ADMIN only)
router.get('/admin', verifyToken, requireRole(['ADMIN']), getAdminData);

module.exports = router;