const User = require('../models/user.model');

const ALLOWED_ROLES = ['ADMIN', 'INVENTORY_MANAGER', 'CASHIER', 'CUSTOMER'];

const getUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments()
    ]);

    return res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        message: 'Invalid role value',
        allowedRoles: ALLOWED_ROLES
      });
    }

    if (req.user?.id === id && role !== 'ADMIN') {
      return res.status(400).json({ message: 'You cannot remove your own admin privileges' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User role updated successfully',
      user: updatedUser
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User deactivated successfully',
      user: updatedUser
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error deactivating user', error: error.message });
  }
};

module.exports = {
  deactivateUser,
  getUserById,
  getUsers,
  updateUserRole
};
