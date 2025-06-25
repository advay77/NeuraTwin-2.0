// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyAuthToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No auth token provided.',
    });
  }

  const token = authHeader.split(' ')[1]; // Extract the token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id || decoded._id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'User not found.' });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};
