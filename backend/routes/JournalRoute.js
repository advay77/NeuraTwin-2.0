// routes/JournalRoute.js
const express = require("express");
const router = express.Router();

const {
  createJournal,
  getJournals,
} = require("../controllers/JournalController");
const { verifyAuthToken } = require("../middlewares/AuthMiddleware");

router.post("/add-journal", verifyAuthToken, createJournal);
router.get("/history", verifyAuthToken, getJournals);

module.exports = router;
