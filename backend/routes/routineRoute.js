// routes/routineRoutes.js
const express = require("express");
const router = express.Router();
const routineController = require("../controllers/routineController");
const { verifyAuthToken } = require("../middlewares/AuthMiddleware");

router.use(verifyAuthToken); // Protect all routine routes

router.post("/create-routine", routineController.createRoutine);
router.get("/get-routine", routineController.getRoutines);
router.patch("/toggle/:id", routineController.toggleCompletion);

router.patch("/reset-daily", routineController.resetRoutinesForNewDay);
router.delete("/delete/:routineId", routineController.deleteRoutine);
router.put("/update/:routineId", routineController.updateRoutine);

module.exports = router;
