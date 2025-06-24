const User = require("../models/User");
const redis = require("../helper/redisClient");
const jwt = require("jsonwebtoken");
const { setAuthCookie, setTempCookie } = require("../helper/cookieUtils");
const verifyOtp = async (req, res) => {
  try {
    const email = req.cookies?.temp_email; // Fetch email from cookie
    const { otp } = req.body;

    console.log("📩 Incoming OTP verification request:", { email, otp });

    if (!email || !otp) {
      console.warn("⚠️ Missing email or OTP in request");
      return res.status(400).json({ error: "Missing email or OTP" });
    }

    const redisOtp = await redis.get(`otp:${email}`);
    console.log("🔍 Fetched OTP from Redis:", redisOtp);

    if (!redisOtp) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (redisOtp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    await redis.del(`otp:${email}`);

    res.clearCookie("temp_email", {
      httpOnly: true,
    });

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      setAuthCookie(res, token);
      console.log("🍪 Auth cookie set for existing user");

      return res.status(200).json({ success: true, newUser: false });
    } else {
      const tempToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "10m",
      });
      setTempCookie(res, tempToken);
      console.log("🍪 Temp cookie set for new user");

      return res.status(200).json({ success: true, newUser: true });
    }
  } catch (err) {
    console.error("❌ OTP verification failed:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { verifyOtp };
