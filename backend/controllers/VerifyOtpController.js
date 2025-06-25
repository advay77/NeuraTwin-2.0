const User = require('../models/User');
const redis = require('../helper/redisClient');
const jwt = require('jsonwebtoken');

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      console.warn('  Missing email or OTP in request');
      return res.status(400).json({ error: 'Missing email or OTP' });
    }

    const redisOtp = await redis.get(`otp:${email}`);
    console.log('🔍 Fetched OTP from Redis:', redisOtp);

    if (!redisOtp) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (redisOtp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    await redis.del(`otp:${email}`);
    const existingUser = await User.findOne({ email });

    let token;
    let newUser;

    if (existingUser) {
      token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      newUser = false;
    } else {
      token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '10m',
      });
      newUser = true;
    }

    res.setHeader('auth-token', token);
    return res.status(200).json({
      success: true,
      newUser,
    });
  } catch (err) {
    console.error('❌ OTP verification failed:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { verifyOtp };
