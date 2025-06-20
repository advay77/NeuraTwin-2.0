const mongoose = require("mongoose");

// const journalSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   text: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }, // Timestamp of when the journal was created
// });

// module.exports = mongoose.model("Journal", journalSchema);

const journalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  aiInsights: {
    mood: String,
    tone: String,
    summary: String,
  },
  // embedding: [Number],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Journal", journalSchema);
