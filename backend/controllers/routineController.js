const Routine = require("../models/Routine");
exports.createRoutine = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const userId = req.user.id;

    const routine = await Routine.create({
      userId,
      title,
      description,
      priority,
    });

    res.status(201).json({ routine });
  } catch (err) {
    res.status(500).json({ message: "Error creating routine", err });
  }
};

exports.getRoutines = async (req, res) => {
  try {
    const routines = await Routine.find({ userId: req.user.id });
    res.json({ routines });
  } catch (err) {
    res.status(500).json({ message: "Error fetching routines", err });
  }
};

exports.toggleCompletion = async (req, res) => {
  try {
    const { id } = req.params;

    const routine = await Routine.findOne({ _id: id, userId: req.user.id });
    if (!routine) return res.status(404).json({ message: "Not found" });

    routine.completed = !routine.completed;
    await routine.save();

    res.json({ routine });
  } catch (err) {
    res.status(500).json({ message: "Error toggling completion", err });
  }
};

// controllers/routineController.js
exports.resetRoutinesForNewDay = async (req, res) => {
  try {
    const userId = req.user.id;

    await Routine.updateMany(
      { userId, completed: true },
      { $set: { completed: false } }
    );

    res.json({ message: "All routines reset for the new day." });
  } catch (err) {
    res.status(500).json({ message: "Failed to reset routines", err });
  }
};
// DELETE ROUTINE FOR USER ---------------------
exports.deleteRoutine = async (req, res) => {
  const { routineId } = req.params;
  const userId = req.user.id;

  try {
    const deleted = await Routine.findOneAndDelete({ _id: routineId, userId });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Routine not found or unauthorized" });
    }

    res.status(200).json({ message: "Routine deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete routine", error: err.message });
  }
};
// UPDATE ROUTINE FOR USER ----------------------
exports.updateRoutine = async (req, res) => {
  const { routineId } = req.params;
  const userId = req.user.id;
  const { title, description, priority } = req.body;

  try {
    const updated = await Routine.findOneAndUpdate(
      { _id: routineId, userId },
      {
        title,
        description,
        priority,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Routine not found or unauthorized" });
    }

    res.status(200).json({ message: "Routine updated", routine: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update routine", error: err.message });
  }
};
