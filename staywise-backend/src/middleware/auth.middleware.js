const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Authenticate user using JWT
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization denied. No token provided.' });
    }
    
    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }
    
    if (!user.active) {
      return res.status(401).json({ message: 'User account is deactivated.' });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Check if user has required role
 * @param {Array} roles - Array of allowed roles
 */
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  };
};

/**
 * Check if user belongs to the same hotel as the resource
 * Used for hotel-specific routes where the hotelId is in the request params
 */
const checkHotelAccess = async (req, res, next) => {
  try {
    // Skip check for superadmin
    if (req.user.role === 'superadmin') {
      return next();
    }
    
    const hotelId = req.params.hotelId || req.body.hotelRef || req.query.hotelId;
    
    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID is required' });
    }
    
    // Check if user belongs to the specified hotel
    if (!req.user.hotelRef || req.user.hotelRef.toString() !== hotelId.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this hotel' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  authenticate,
  authorize,
  checkHotelAccess
}; 