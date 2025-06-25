// controllers/user.controller.js
const User = require('../models/User');

exports.getCurrentUser = async (req, res) => {
  try {
    // JUST ADDED TO SEE IF IT WORKS-------------
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Please check your auth token or login again.',
      });
    }
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('❌ Error fetching user:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.setHeader('auth-token', '');
    return res
      .status(200)
      .json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    console.error('❌ Error during logout:', err);
    return res.status(500).json({ success: false, message: 'Logout failed.' });
  }
};
