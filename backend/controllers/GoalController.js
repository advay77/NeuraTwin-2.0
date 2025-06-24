const User = require("../models/User");

// Create a new goal
exports.createGoal = async (req, res) => {
  const { title, description, startDate, endDate, status } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newGoal = {
      title,
      description,
      startDate,
      endDate,
      status: status || "active",
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    user.goals.push(newGoal);
    await user.save();

    const createdGoal = user.goals[user.goals.length - 1];
    res.status(201).json({ message: "Goal created", goal: createdGoal });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating goal", error: err.message });
  }
};

// Update a goal
exports.updateGoal = async (req, res) => {
  const { goalId } = req.params;
  const userId = req.user.id;
  const updateData = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const goal = user.goals.id(goalId);
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    Object.assign(goal, updateData, { updatedAt: new Date() });
    await user.save();

    res.status(200).json({ message: "Goal updated", goal });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating goal", error: err.message });
  }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  const { goalId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.goals = user.goals.filter((goal) => goal._id.toString() !== goalId);
    await user.save();

    res.status(200).json({ message: "Goal deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting goal", error: err.message });
  }
};

// GET ALL GOALS
exports.getGoals = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ goals: user.goals });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching goals", error: err.message });
  }
};
// UPDATE OF PROGRESSS
exports.updateGoalProgress = async (req, res) => {
  const { goalId } = req.params;
  const userId = req.user.id;
  const { progress } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const goal = user.goals.id(goalId);
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    goal.progress = progress;
    goal.status = progress === 100 ? "completed" : goal.status;
    goal.updatedAt = new Date();

    await user.save();

    res.status(200).json({ message: "Goal progress updated", goal });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating goal progress", error: err.message });
  }
};
