// backend/routes/pinecone.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/query", async (req, res) => {
  try {
    const { prompt, userId, topK } = req.body;
    console.log(
      `[pinecone/query] Received request: prompt=${prompt}, userId=${userId}, topK=${topK}`
    );

    if (!prompt || !userId) {
      console.error("[pinecone/query] Missing prompt or userId");
      return res.status(400).json({ error: "Missing prompt or userId" });
    }

    // Forward to Python server (use localhost)
    const response = await axios.post("http://localhost:6000/query", {
      prompt,
      userId,
      topK,
    });

    console.log("[pinecone/query] Python server response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(
      "[pinecone/query] Error querying Python server:",
      error.message
    );
    res.status(500).json({ error: "Failed to query Pinecone" });
  }
});

module.exports = router;
