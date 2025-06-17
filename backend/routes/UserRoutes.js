// routes/user.routes.js
const express = require("express");
const router = express.Router();
const { getCurrentUser, logoutUser } = require("../controllers/UserController");
const { verifyAuthToken } = require("../middlewares/AuthMiddleware");

router.get("/me", verifyAuthToken, getCurrentUser);

router.post("/logout", logoutUser);

module.exports = router;
