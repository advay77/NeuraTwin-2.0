export function getPersonalityRetakeStatus(updatedAt: string) {
  if (!updatedAt) {
    return {
      canRetake: true,
      daysSinceUpdate: Infinity,
      daysLeft: 0,
    };
  }

  try {
    const lastUpdate = new Date(updatedAt);
    const now = new Date();

    if (isNaN(lastUpdate.getTime())) {
      throw new Error("Invalid date format");
    }

    const MS_IN_DAY = 1000 * 60 * 60 * 24;
    const daysSinceUpdate = Math.floor(
      (now.getTime() - lastUpdate.getTime()) / MS_IN_DAY
    );
    const canRetake = daysSinceUpdate >= 7;
    const daysLeft = Math.max(0, 7 - daysSinceUpdate);

    return {
      canRetake,
      daysSinceUpdate,
      daysLeft,
    };
  } catch (error) {
    console.error("Failed to calculate retake status:", error);
    return {
      canRetake: true,
      daysSinceUpdate: Infinity,
      daysLeft: 0,
    };
  }
}
