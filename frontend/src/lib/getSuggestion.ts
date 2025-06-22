type Suggestion = {
  title: string
  icon: string
  href?: string
}

type Journal = {
  createdAt: string | Date
  text: string
}

type UserType = {
  personality?: {
    O?: number
    C?: number
    E?: number
    A?: number
    N?: number
    updatedAt?: string
  }
}

// Stable seeded shuffle using current date as seed
function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = seed % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    seed = (seed * 9301 + 49297) % 233280
  }
  return shuffled
}

export function getSuggestions(currentUser: UserType, journals: Journal[]): Suggestion[] {
  const suggestions: Suggestion[] = []

  const today = new Date().toDateString()
  const lastJournal = journals[0]
  const lastJournalDate = lastJournal ? new Date(lastJournal.createdAt).toDateString() : null

  const personality = currentUser?.personality
  const lastTestDate = personality?.updatedAt
  const daysSinceTest = lastTestDate
    ? (Date.now() - new Date(lastTestDate).getTime()) / (1000 * 60 * 60 * 24)
    : Infinity

  const hasPersonality =
    personality?.O !== undefined &&
    personality?.C !== undefined &&
    personality?.E !== undefined &&
    personality?.A !== undefined &&
    personality?.N !== undefined

  const baseSuggestions: Suggestion[] = [
    { title: "View Goals", icon: "🎯", href: "/home/goals" },
    { title: "Get Growth Tips", icon: "💬" },
    { title: "Customize Twin", icon: "🤖" },
    { title: "Build Routines", icon: "🕹️", href: "/home/routine" },
    { title: "Track Progress", icon: "📈", href: "/home/insights" },
  ]

  // Priority Suggestions
  if (!hasPersonality || daysSinceTest >= 7) {
    suggestions.push({
      title: "Personality Test",
      icon: "🧠",
      href: "/personality-test",
    })
  }

  if (lastJournalDate !== today) {
    suggestions.push({
      title: "Write Journal",
      icon: "📓",
      href: "/home/journal",
    })
  }

  // Shuffle base suggestions in a stable way
  const seed = new Date().getFullYear() * 10000 + (new Date().getMonth() + 1) * 100 + new Date().getDate()
  const randomBase = seededShuffle(baseSuggestions, seed)

  const remainingCount = 5 - suggestions.length
  suggestions.push(...randomBase.slice(0, remainingCount))

  return suggestions
}
