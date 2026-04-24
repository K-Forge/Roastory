const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// NOTE: As per the project schedule, Sebastián is responsible for defining 
// the User schema/model. We import it here assuming he will create it.
const User = require('../models/user.model');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the new user with hashed password
    const newUser = new User({
      name,
      email,
      password: passwordHash,
      role: 'CUSTOMER'
    });

    await newUser.save();

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: newUser._id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password with Bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT Token
    const payload = {
      id: user._id,
      role: user.role
    };
    
    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    const token = jwt.sign(payload, secret, { expiresIn: '1d' });

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    let userDetails = null;
    try {
      // Fallback in case Sebastian hasn't pushed User model yet
      userDetails = await User.findById(req.user.id).select('-password');
    } catch (dbError) {
      console.warn("Fallback: User model not ready, using JWT payload");
    }
    res.status(200).json({
      message: 'Access granted to protected route',
      user: userDetails || req.user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
};

const getAdminData = async (req, res) => {
  res.status(200).json({
    message: 'Welcome to the VIP Admin lounge',
    adminId: req.user.id,
    role: req.user.role
  });
};

module.exports = {
  getAdminData,
  getProfile,
  register,
  login
};
