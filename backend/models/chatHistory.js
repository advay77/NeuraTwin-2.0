const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
