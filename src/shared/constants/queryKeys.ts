/**
 * Master Query Key factory for the English application.
 * Ensures consistent cache invalidation and deduplication.
 */

export const QUERY_KEYS = {
  reading: {
    all: ["reading"] as const,
    articles: (level: string) => ["reading", "articles", level] as const,
    article: (id: string) => ["reading", "article", id] as const,
    wordLookup: (word: string) => ["reading", "word", word] as const,
  },
  memory: {
    all: ["memory"] as const,
    cards: (category?: string) => ["memory", "cards", category || "all"] as const,
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
    profile: ["settings", "profile"] as const,
    providers: ["settings", "ai-providers"] as const,
  },
};
