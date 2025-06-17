// controllers/user.controller.js
const User = require("../models/User");

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    console.error("❌ Error during logout:", err);
    return res.status(500).json({ success: false, message: "Logout failed." });
  }
};
