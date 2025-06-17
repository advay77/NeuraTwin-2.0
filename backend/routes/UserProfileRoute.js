const express = require("express");
const router = express.Router();
const { completeUserProfile } = require("../controllers/UserProfileController");

router.post("/complete-profile", completeUserProfile);

module.exports = router;
