// routes/goalRoutes.js
const express = require("express");
const router = express.Router();
const goalController = require("../controllers/GoalController");
const { verifyAuthToken } = require("../middlewares/AuthMiddleware");

router.use(verifyAuthToken); // Protect all routine routes

router.post("/create", goalController.createGoal);
// router.patch("/:goalId", goalController.updateGoal);
router.delete("/del/:goalId", goalController.deleteGoal);

router.get("/get-goals", goalController.getGoals);

router.patch("/update/:goalId", goalController.updateGoalProgress);

module.exports = router;
