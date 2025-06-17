const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB connected to DB: ${conn.connection.name}`);
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
