const ChatHistory = require("../models/chatHistory");

// Save new chat
const saveChat = async (req, res) => {
  try {
    const { prompt, response } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!prompt || !response) {
      return res.status(400).json({
        success: false,
        message: "Prompt and response are required",
      });
    }

    const newChat = new ChatHistory({
      user: userId,
      prompt,
      response,
    });

    await newChat.save();

    res.status(201).json({
      success: true,
      message: "Chat saved successfully",
    });
  } catch (error) {
    console.error("Save chat error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save chat",
    });
  }
};

// Get recent chats for context (last 5 within 30 minutes)
const getRecentChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const recentChats = await ChatHistory.find({
      user: userId,
      createdAt: { $gte: thirtyMinutesAgo },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("prompt response createdAt");

    // Return in chronological order (oldest first)
    const chatsInOrder = recentChats.reverse();

    res.json({
      success: true,
      chats: chatsInOrder,
    });
  } catch (error) {
    console.error("Get recent chats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent chats",
    });
  }
};
module.exports = {
  saveChat,
  getRecentChats,
  // getChatHistory
};

// exports.saveChat = async (req, res) => {
//   try {
//     const { prompt, response } = req.body;
//     const userId = req.user.id;

//     if (!prompt || !response) {
//       return res
//         .status(400)
//         .json({ message: "Prompt and response are required." });
//     }

//     const chat = await ChatHistory.create({
//       user: userId,
//       prompt,
//       response,
//     });

//     res.status(201).json(chat);
//   } catch (err) {
//     console.error("Error saving chat:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getRecentChats = async (req, res) => {
//   try {
//     const userId = req.user.id; // from JWT middleware

//     const now = new Date();
//     const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);

//     const chats = await ChatHistory.find({
//       user: userId,
//       createdAt: { $gte: fiveMinAgo },
//     })
//       .sort({ createdAt: 1 }) // oldest to newest
//       .limit(5);

//     res.status(200).json(chats);
//   } catch (err) {
//     console.error("Error fetching recent chats:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
