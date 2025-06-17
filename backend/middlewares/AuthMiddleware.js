// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyAuthToken = async (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No auth token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id || decoded._id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
