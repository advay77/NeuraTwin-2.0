const User = require("../models/User");

const updatePersonality = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure auth middleware sets this
    const { O, C, E, A, N } = req.body;

    if ([O, C, E, A, N].some((score) => typeof score !== "number")) {
      return res
        .status(400)
        .json({ error: "All OCEAN scores must be numbers." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const now = new Date();

    // Update personality scores
    user.personality.O = O;
    user.personality.C = C;
    user.personality.E = E;
    user.personality.A = A;
    user.personality.N = N;
    user.personality.updatedAt = now;

    // Add to personality history
    user.personality.history.push({
      date: now,
      scores: { O, C, E, A, N },
    });

    await user.save();

    res.status(200).json({ message: "Personality updated successfully." });
  } catch (error) {
    console.error("Error updating personality:", error);
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = {
  updatePersonality,
};
