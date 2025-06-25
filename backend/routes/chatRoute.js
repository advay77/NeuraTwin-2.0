const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { verifyAuthToken } = require("../middlewares/AuthMiddleware");

router.post("/save", verifyAuthToken, chatController.saveChat);
router.get("/recent", verifyAuthToken, chatController.getRecentChats);

module.exports = router;
