const express = require('express');
const router = express.Router();
const {
  deactivateUser,
  getUserById,
  getUsers,
  updateUserRole
} = require('../controllers/user.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// All user management routes are restricted to ADMIN role
router.use(verifyToken, requireRole(['ADMIN']));

router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/:id/role', updateUserRole);
router.patch('/:id/deactivate', deactivateUser);

module.exports = router;
