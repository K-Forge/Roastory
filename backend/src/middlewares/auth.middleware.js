const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  return process.env.JWT_SECRET;
};

/**
 * Middleware to verify JWT token from Authorization header
 */
const verifyToken = (req, res, next) => {
  // Extract token from 'Authorization: Bearer <token>' header
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Invalid token format.' });
  }

  try {
    const secret = getJwtSecret();
    // Verify the token
    const decoded = jwt.verify(token, secret);
    
    // Attach the decoded payload (user ID, role, etc) to the request object
    // This allows subsequent handlers/controllers to know who is making the request
    req.user = decoded;
    
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.', error: error.message });
  }
};

/**
 * Middleware to restrict access to specific roles
 * @param {Array} roles - Allowed roles (e.g., ['ADMIN', 'INVENTORY_MANAGER'])
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    // This middleware must be called AFTER verifyToken
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole
};
