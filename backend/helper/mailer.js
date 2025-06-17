const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"NeuraTwin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Your NeuraTwin Magic Code",
    html: `
      <div style="font-family: sans-serif;">
        <h2>Your OTP is: <span style="color: #6366f1;">${otp}</span></h2>
        <p>This code is valid for <strong>2 minutes</strong>.</p>
        <p>Please do not share it with anyone.</p>
      </div>
    `,
  });
};

module.exports = { sendOTP };
