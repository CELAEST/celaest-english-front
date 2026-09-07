/**
 * Dynamic AI Writing Task Generator Service
 * Rotates through a diverse pool of professional writing tasks so every
 * practice round presents a different scenario.
 *
 * Fully adapted by:
 * 1. CEFR Proficiency Level (A1, A2, B1, B2, C1, C2)
 * 2. User Profession (TECH, PRODUCT, DESIGN, DATA, BUSINESS)
 */

import { WritingSubmission } from "../../../domain/entities/WritingSubmission";
import { normalizeCefr, CefrLevelCode, ProfessionCategory } from "../../conversation/services/dynamicQuestionService";
import { AiWritingTaskGenerator } from "./aiWritingTaskGenerator";

export interface WritingTaskItem {
  id: string;
  category: "EMAIL" | "LETTER" | "REPORT" | "PROPOSAL" | "REVIEW" | "MESSAGE";
  title: string;
  description: string;
  toneHint: string;
  timeLimit: string;
  minWords: number;
  maxWords: number;
  level: CefrLevelCode;
  roleCategory: ProfessionCategory;
  starterPhrases?: string[];
}

export function getDefaultStarterPhrases(level: CefrLevelCode, _category?: string): string[] {
  switch (level) {
    case "A1":
      return [
        "Hi, I am writing to let you know that...",
        "Could you please help me with...",
        "Today I finished working on...",
        "Please let me know if this works.",
      ];
    case "A2":
      return [
        "Regarding the matter we discussed earlier, ...",
        "I would like to confirm that...",
        "We completed the review after verifying the details...",
        "Feel free to reach out if you have questions.",
      ];
    case "B1":
      return [
        "Following up on our recent discussion, ...",
        "In order to proceed with the next steps, I suggest...",
        "Please find the requested details and status update below...",
      ];
    case "B2":
      return [
        "Based on our evaluation, we propose...",
        "Taking into account the timeline and key requirements, ...",
        "To address the points raised during our consultation, ...",
      ];
    case "C1":
    case "C2":
      return [
        "Conducting a comprehensive assessment of the situation reveals...",
        "Our analysis demonstrates that the optimal approach is to...",
        "In accordance with established professional standards and protocols, ...",
      ];
    default:
      return [
        "Regarding the consultation we conducted earlier, ...",
        "I have updated the records with the latest status...",
        "Feel free to reach out if you have further questions.",
      ];
  }
}

const COMPLETED_TASKS_KEY = "lingua:writing_completed_tasks";
const ACTIVE_TASK_STORAGE_KEY = "celaest:writing:activeTask";
const DRAFT_STORAGE_KEY = "celaest:writing:draft";

interface StoredDraft {
  taskId: string;
  content: string;
}

export class DynamicWritingTaskService {
  private static getCompletedTaskIds(): string[] {
    try {
      if (typeof window === "undefined") return [];
      const raw = window.localStorage.getItem(COMPLETED_TASKS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private static markTaskCompleted(taskId: string): void {
    try {
      if (typeof window === "undefined" || !taskId) return;
      const current = this.getCompletedTaskIds();
      if (!current.includes(taskId)) {
        const updated = [...current, taskId];
        window.localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updated));
      }
    } catch {
      // Storage unavailable
    }
  }

  public static persistActiveTask(task: WritingTaskItem): void {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(ACTIVE_TASK_STORAGE_KEY, JSON.stringify(task));
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Returns matching tasks filtered by CEFR tier and profession category.
   */
  public static filterTasks(userCefr?: string, roleName?: string): WritingTaskItem[] {
    const level = normalizeCefr(userCefr);
    return AiWritingTaskGenerator.getCachedOrSeedBatch(roleName || "Professional", level);
  }

  /**
   * Returns the current active task. It is persisted in localStorage so a page
   * reload ALWAYS shows the same task until the user answers it.
   */
  public static getActiveTask(userCefr?: string, roleName?: string): WritingTaskItem {
    const targetCefr = normalizeCefr(userCefr || "B1");
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem(ACTIVE_TASK_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as WritingTaskItem;
          if (parsed && parsed.id && parsed.level === targetCefr) {
            const phrases =
              parsed.starterPhrases && parsed.starterPhrases.length > 0
                ? parsed.starterPhrases
                : getDefaultStarterPhrases(parsed.level, parsed.category);
            return { ...parsed, starterPhrases: phrases };
          }
        }
      }
    } catch {
      // Storage unavailable
    }
    const fresh = AiWritingTaskGenerator.getCachedOrSeedTask(roleName || "Professional", targetCefr);
    if (!fresh.starterPhrases || fresh.starterPhrases.length === 0) {
      fresh.starterPhrases = getDefaultStarterPhrases(fresh.level, fresh.category);
    }
    this.persistActiveTask(fresh);
    return fresh;
  }

  /**
   * Saves a draft for a specific task
   */
  public static saveDraft(taskId: string, content: string): void {
    try {
      if (typeof window === "undefined") return;
      const draft: StoredDraft = { taskId, content };
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Loads the draft for a specific task
   */
  public static loadDraft(taskId: string): string {
    try {
      if (typeof window === "undefined") return "";
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return "";
      const draft = JSON.parse(raw) as StoredDraft;
      if (draft?.taskId === taskId && typeof draft.content === "string") {
        return draft.content;
      }
      return "";
    } catch {
      return "";
    }
  }

  /**
   * Clears any saved draft
   */
  public static clearDraft(): void {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // noop
    }
  }

  /**
   * Persists active submission state
   */
  public static saveActiveSubmission(
    submission: WritingSubmission,
    modalOpen: boolean,
    savedErrorIds: string[] = [],
  ): void {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(
        "lingua:writing_active_submission",
        JSON.stringify({ submission, savedErrorIds, modalOpen }),
      );
    } catch {
      // noop
    }
  }

  /**
   * Restores active submission state
   */
  public static loadActiveSubmission(): {
    submission: WritingSubmission;
    savedErrorIds: string[];
    modalOpen: boolean;
  } | null {
    try {
      if (typeof window === "undefined") return null;
      const raw = window.localStorage.getItem("lingua:writing_active_submission");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.submission?.id) {
        return {
          submission: parsed.submission,
          savedErrorIds: Array.isArray(parsed.savedErrorIds) ? parsed.savedErrorIds : [],
          modalOpen: Boolean(parsed.modalOpen),
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Clears stored submission state
   */
  public static clearActiveSubmission(): void {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem("lingua:writing_active_submission");
    } catch {
      // noop
    }
  }

  /**
   * Call after the user answers: marks the task completed, and serves AND persists
   * a brand-new uncompleted task.
   */
  public static completeTaskAndNext(
    answeredTaskId: string,
    userCefr?: string,
    roleName?: string,
  ): WritingTaskItem {
    if (answeredTaskId) {
      this.markTaskCompleted(answeredTaskId);
    }
    const next = this.getNextTask(answeredTaskId, userCefr, roleName);
    this.persistActiveTask(next);
    return next;
  }

  /**
   * Returns a random task, prioritizing tasks matching the user's level and profession
   */
  public static getRandomTask(userCefr?: string, roleName?: string): WritingTaskItem {
    const level = normalizeCefr(userCefr);
    const task = AiWritingTaskGenerator.getCachedOrSeedTask(roleName || "Professional", level);
    if (!task.starterPhrases || task.starterPhrases.length === 0) {
      task.starterPhrases = getDefaultStarterPhrases(task.level, task.category);
    }
    return task;
  }

  /**
   * Returns a brand-new task guaranteed to be different from the given one
   */
  public static getNextTask(
    _currentTaskId?: string,
    userCefr?: string,
    roleName?: string,
  ): WritingTaskItem {
    const level = normalizeCefr(userCefr);
    const batch = AiWritingTaskGenerator.getCachedOrSeedBatch(roleName || "Professional", level);
    const filtered = batch.filter((t) => t.id !== _currentTaskId);
    const next = filtered.length > 0 ? filtered[0] : batch[0];
    this.persistActiveTask(next);
    return next;
  }
}
