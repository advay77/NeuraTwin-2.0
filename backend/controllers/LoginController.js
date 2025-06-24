const redis = require("../helper/redisClient");
const { sendOTP } = require("../helper/mailer");
const { emailSchema } = require("../validators/LoginValidation");
// const { setAuthCookie, setTempCookie } = require("../helper/cookieUtils");

const handleLogin = async (req, res) => {
  try {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log(
        "❌ Email validation failed:",
        parsed.error.errors[0].message
      );
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { email } = parsed.data;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("🔐 Generated OTP:", otp);

    await redis.setex(`otp:${email}`, 300, otp);

    await sendOTP(email, otp);
    console.log(`✉️ OTP email sent to ${email}`);

    // res.cookie("temp_email", email, {
    //   // httpOnly: true,
    //   httpOnly: false,
    //   maxAge: 2 * 60 * 1000, // 2 minutes
    // });
    res.cookie("temp_email", email, {
      httpOnly: false, // Accessible by frontend JS
      secure: false, // For HTTP
      sameSite: "Lax", // For cross-site requests
      maxAge: 2 * 60 * 1000, // 2 minutes
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { handleLogin };
