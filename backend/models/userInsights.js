const mongoose = require("mongoose");

const userInsightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    enum: ["journal", "prompt", "OCEAN"],
    required: true,
  },

  // Shared Fields
  tone: {
    type: String, // e.g., "positive", "reflective", "anxious"
  },
  summary: {
    type: String,
  },

  // Journal & Prompt
  keywords: [String], // optional for prompt too (same as topics)

  // Prompt-specific
  prompt: String,
  aiResponse: String,

  // OCEAN-specific
  traits: [String], // e.g., ["empathetic", "disciplined", "introverted"]

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserInsight", userInsightSchema);
