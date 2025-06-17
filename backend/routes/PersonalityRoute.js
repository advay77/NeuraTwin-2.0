const express = require("express");
const router = express.Router();
const { updatePersonality } = require("../controllers/PersonalityController");
const { verifyAuthToken } = require("../middlewares/AuthMiddleware");

router.post("/update", verifyAuthToken, updatePersonality);

module.exports = router;
