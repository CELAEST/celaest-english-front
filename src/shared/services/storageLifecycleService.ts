/**
 * StorageLifecycleService
 *
 * Central authority for browser localStorage hygiene, quota preservation,
 * and cross-session isolation.
 *
 * Prevents:
 * 1. QuotaExceededError (5MB browser limit breach via large unbounded JSON caches)
 * 2. Zombie / Stale Sessions (abandoned interviews, stale drafts from days ago)
 * 3. Cross-User Privacy Leaks (residual transcripts/drafts on logout)
 * 4. Profession / CEFR Desynchronization (lingering tasks from previous role)
 */

export class StorageLifecycleService {
  // Session TTL: 24 hours
  private static readonly MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000;
  // Maximum reading articles to keep in local storage
  public static readonly MAX_CACHED_ARTICLES = 8;
  // Maximum completed task IDs
  public static readonly MAX_COMPLETED_TASK_IDS = 30;

  /**
   * Runs non-blocking routine maintenance on app mount:
   * - Purges stale interview progress (> 24h)
   * - Trims oversized reading caches
   * - Trims completed task arrays
   * - Cleans legacy keys
   */
  public static performMountHygiene(): void {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return;

    try {
      this.cleanStaleInterview();
      this.trimReadingCache();
      this.trimCompletedTasks();
      this.cleanLegacyKeys();
    } catch {
      // Storage errors never crash the app
    }
  }

  /**
   * Cleans interview progress if older than TTL or if finished
   */
  public static cleanStaleInterview(): boolean {
    const raw = localStorage.getItem("celaest:interview-progress:v2") || localStorage.getItem("celaest:interview-progress:v1");
    if (!raw) return false;

    try {
      const parsed = JSON.parse(raw);
      const isExpired = !parsed.updatedAt || (Date.now() - parsed.updatedAt > this.MAX_SESSION_AGE_MS);
      const isFinished = typeof parsed.currentQuestionIndex === "number" &&
        parsed.sessionQuestions &&
        parsed.currentQuestionIndex >= parsed.sessionQuestions.length;

      if (isExpired || isFinished) {
        localStorage.removeItem("celaest:interview-progress:v2");
        localStorage.removeItem("celaest:interview-progress:v1");
        return true;
      }
    } catch {
      localStorage.removeItem("celaest:interview-progress:v2");
      localStorage.removeItem("celaest:interview-progress:v1");
      return true;
    }
    return false;
  }

  /**
   * Trims reading article cache to prevent QuotaExceededError
   */
  public static trimReadingCache(): void {
    const raw = localStorage.getItem("lingua_reading_articles_v2");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > this.MAX_CACHED_ARTICLES) {
        const trimmed = parsed.slice(0, this.MAX_CACHED_ARTICLES);
        localStorage.setItem("lingua_reading_articles_v2", JSON.stringify(trimmed));
      }
    } catch {
      localStorage.removeItem("lingua_reading_articles_v2");
    }
  }

  /**
   * Trims completed tasks list
   */
  public static trimCompletedTasks(): void {
    const raw = localStorage.getItem("lingua:writing_completed_tasks");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > this.MAX_COMPLETED_TASK_IDS) {
        const trimmed = parsed.slice(-this.MAX_COMPLETED_TASK_IDS);
        localStorage.setItem("lingua:writing_completed_tasks", JSON.stringify(trimmed));
      }
    } catch {
      localStorage.removeItem("lingua:writing_completed_tasks");
    }
  }

  /**
   * Purges transient feature state on logout (keeps device preferences and encrypted keys)
   */
  public static purgeOnLogout(): void {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return;

    const keysToRemove = [
      "lingua_access_token",
      "lingua_refresh_token",
      "lingua_user",
      "lingua_onboarding_completed",
      "celaest:interview-progress:v2",
      "celaest:interview-progress:v1",
      "celaest:interview:hasInteracted",
      "celaest:writing:draft",
      "celaest:writing:activeTask",
      "lingua:writing_active_submission",
      "lingua_reading_active_id_v2",
      "celaest:active-provider",
      "celaest:session:active-provider",
    ];

    keysToRemove.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {}
    });

    // Remove any session-scoped or legacy un-scoped provider keys
    try {
      const sessionKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith("celaest:session:provider-") || k.startsWith("celaest:provider-key:"))) {
          sessionKeys.push(k);
        }
      }
      sessionKeys.forEach((k) => localStorage.removeItem(k));
    } catch {}
  }

  /**
   * Cleans stale AI question/task caches when profession changes
   */
  public static purgeOnProfessionChange(newProfession: string): void {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return;
    const cleanNorm = newProfession.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_");

    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // Stale interview question caches for other professions
      if (key.startsWith("celaest:interview:ai_questions:v2:") && !key.includes(`:${cleanNorm}:`)) {
        toRemove.push(key);
      }
      // Stale writing task caches for other professions
      if (key.startsWith("celaest:writing:ai_batch_tasks:v2:") && !key.includes(`:${cleanNorm}:`)) {
        toRemove.push(key);
      }
    }

    toRemove.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });
  }

  /**
   * Cleans deprecated legacy keys
   */
  private static cleanLegacyKeys(): void {
    const legacyKeys = [
      "celaest:interview-progress:v1",
      "celaest_slot1_memory_img",
      "celaest_slot2_reading_img",
      "celaest_slot3_speaking_img",
    ];
    legacyKeys.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });
  }
}
