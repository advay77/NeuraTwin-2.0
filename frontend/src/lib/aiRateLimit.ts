// utils/aiRateLimit.ts

const LIMIT = 2;

export function checkAndIncrementAICount(userId: string): boolean {
  const today = new Date().toISOString().slice(0, 10); // e.g., "2025-06-21"
  const key = `ai_calls_${userId}_${today}`;
  const current = parseInt(localStorage.getItem(key) || "0", 10);

  if (current >= LIMIT) {
    return false;
  }

  localStorage.setItem(key, (current + 1).toString());
  return true;
}

export function getRemainingAICount(userId: string): number {
  const today = new Date().toISOString().slice(0, 10);
  const key = `ai_calls_${userId}_${today}`;
  const current = parseInt(localStorage.getItem(key) || "0", 10);
  return Math.max(0, LIMIT - current);
}

