/**
 * Master Query Key factory for the English application.
 * Ensures consistent cache invalidation and deduplication.
 */

export const QUERY_KEYS = {
  reading: {
    all: ["reading"] as const,
    articles: (level: string, profession?: string) =>
      profession && profession.toLowerCase() !== "professional" && profession.toLowerCase() !== "general"
        ? (["reading", "articles", level, profession.toLowerCase()] as const)
        : (["reading", "articles", level] as const),
    article: (id: string) => ["reading", "article", id] as const,
    wordLookup: (word: string) => ["reading", "word", word] as const,
  },
  memory: {
    all: ["memory"] as const,
    cards: (category?: string, userId?: string) =>
      userId
        ? (["memory", "cards", userId, category || "all"] as const)
        : (["memory", "cards", category || "all"] as const),
  },
  conversation: {
    all: ["conversation"] as const,
    session: (id: string) => ["conversation", "session", id] as const,
  },
  writing: {
    all: ["writing"] as const,
    submissions: ["writing", "submissions"] as const,
  },
  settings: {
    profile: (userId?: string) =>
      userId
        ? (["settings", "profile", userId] as const)
        : (["settings", "profile"] as const),
    providers: ["settings", "ai-providers"] as const,
  },
};
