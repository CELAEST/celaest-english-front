import { describe, it, expect, beforeEach } from "vitest";
import { StorageLifecycleService } from "../storageLifecycleService";

describe("StorageLifecycleService - Safe LocalStorage Hygiene", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("removes expired interview session older than 24 hours", () => {
    const expiredState = {
      version: 2,
      roleName: "Engineer",
      currentQuestionIndex: 2,
      userTranscript: "Old transcript",
      updatedAt: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
    };
    localStorage.setItem("celaest:interview-progress:v2", JSON.stringify(expiredState));

    const cleaned = StorageLifecycleService.cleanStaleInterview();
    expect(cleaned).toBe(true);
    expect(localStorage.getItem("celaest:interview-progress:v2")).toBeNull();
  });

  it("preserves active interview session within 24 hours", () => {
    const freshState = {
      version: 2,
      roleName: "Engineer",
      currentQuestionIndex: 2,
      sessionQuestions: [{}, {}, {}, {}, {}],
      userTranscript: "Fresh transcript",
      updatedAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    };
    localStorage.setItem("celaest:interview-progress:v2", JSON.stringify(freshState));

    const cleaned = StorageLifecycleService.cleanStaleInterview();
    expect(cleaned).toBe(false);
    expect(localStorage.getItem("celaest:interview-progress:v2")).not.toBeNull();
  });

  it("trims reading article cache when exceeding limit", () => {
    const articles = Array.from({ length: 15 }, (_, i) => ({
      id: `art-${i}`,
      title: `Article ${i}`,
      content: "Sample content",
    }));
    localStorage.setItem("lingua_reading_articles_v2", JSON.stringify(articles));

    StorageLifecycleService.trimReadingCache();

    const stored = JSON.parse(localStorage.getItem("lingua_reading_articles_v2") || "[]");
    expect(stored.length).toBe(StorageLifecycleService.MAX_CACHED_ARTICLES);
    expect(stored[0].id).toBe("art-0");
  });

  it("trims completed tasks when exceeding limit", () => {
    const tasks = Array.from({ length: 50 }, (_, i) => `task-${i}`);
    localStorage.setItem("lingua:writing_completed_tasks", JSON.stringify(tasks));

    StorageLifecycleService.trimCompletedTasks();

    const stored = JSON.parse(localStorage.getItem("lingua:writing_completed_tasks") || "[]");
    expect(stored.length).toBe(StorageLifecycleService.MAX_COMPLETED_TASK_IDS);
    expect(stored[stored.length - 1]).toBe("task-49");
  });

  it("purges user session data on logout", () => {
    localStorage.setItem("lingua_access_token", "jwt-token");
    localStorage.setItem("lingua_user", JSON.stringify({ email: "test@celaest.com" }));
    localStorage.setItem("celaest:writing:draft", JSON.stringify({ content: "draft" }));
    localStorage.setItem("celaest:interview-progress:v2", JSON.stringify({ index: 1 }));

    // Non-transient device preferences that must be preserved
    localStorage.setItem("celaest:mentor_voice", "en-US-AriaNeural");

    StorageLifecycleService.purgeOnLogout();

    expect(localStorage.getItem("lingua_access_token")).toBeNull();
    expect(localStorage.getItem("lingua_user")).toBeNull();
    expect(localStorage.getItem("celaest:writing:draft")).toBeNull();
    expect(localStorage.getItem("celaest:interview-progress:v2")).toBeNull();
    expect(localStorage.getItem("celaest:mentor_voice")).toBe("en-US-AriaNeural");
  });

  it("cleans stale AI question caches when profession changes", () => {
    localStorage.setItem("celaest:interview:ai_questions:v2:dentist:b1", JSON.stringify([{ id: 1 }]));
    localStorage.setItem("celaest:interview:ai_questions:v2:lawyer:b1", JSON.stringify([{ id: 2 }]));

    StorageLifecycleService.purgeOnProfessionChange("lawyer");

    // Dentist questions should be purged
    expect(localStorage.getItem("celaest:interview:ai_questions:v2:dentist:b1")).toBeNull();
    // Lawyer questions should be kept
    expect(localStorage.getItem("celaest:interview:ai_questions:v2:lawyer:b1")).not.toBeNull();
  });
});
