// routes/routineRoutes.js
const express = require("express");
const router = express.Router();
const routineController = require("../controllers/routineController");
const { verifyAuthToken } = require("../middlewares/AuthMiddleware");

router.use(verifyAuthToken); // Protect all routine routes

router.post("/create-routine", routineController.createRoutine);
router.get("/get-routine", routineController.getRoutines);
router.patch("/toggle/:id", routineController.toggleCompletion);
// routes/routineRoutes.js
router.patch("/reset-daily", routineController.resetRoutinesForNewDay);

module.exports = router;
