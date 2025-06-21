const ChatHistory = require("../models/chatHistory");

// Save a chat entry
exports.saveChat = async (req, res) => {
  try {
    const { prompt, response } = req.body;
    const userId = req.user.id;

    if (!prompt || !response) {
      return res
        .status(400)
        .json({ message: "Prompt and response are required." });
    }

    const chat = await ChatHistory.create({
      user: userId,
      prompt,
      response,
    });

    res.status(201).json(chat);
  } catch (err) {
    console.error("Error saving chat:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRecentChats = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware

    const now = new Date();
    const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const chats = await ChatHistory.find({
      user: userId,
      createdAt: { $gte: fiveMinAgo },
    })
      .sort({ createdAt: 1 }) // oldest to newest
      .limit(5);

    res.status(200).json(chats);
  } catch (err) {
    console.error("Error fetching recent chats:", err);
    res.status(500).json({ message: "Server error" });
  }
};
