/**
 * Dynamic AI Writing Task Generator Service
 * Rotates through a diverse pool of professional writing tasks so every
 * practice round presents a different scenario. Mirrors the pattern used by
 * the conversation feature (DynamicQuestionService).
 */

export interface WritingTaskItem {
  id: string;
  category: "EMAIL" | "LETTER" | "REPORT" | "PROPOSAL" | "REVIEW" | "MESSAGE";
  title: string;
  description: string;
  toneHint: string;
  timeLimit: string;
  minWords: number;
  maxWords: number;
}

const WRITING_TASKS_POOL: WritingTaskItem[] = [
  {
    id: "client-project-update",
    category: "EMAIL",
    title: "Write an email to a client",
    description: "Use a professional tone and explain a project update.",
    toneHint: "Professional, concise, solution-oriented",
    timeLimit: "18 min",
    minWords: 80,
    maxWords: 180,
  },
  {
    id: "complaint-refund",
    category: "EMAIL",
    title: "Write a complaint email",
    description: "Report a defective product you bought online and request a refund or replacement.",
    toneHint: "Firm but polite, fact-based",
    timeLimit: "15 min",
    minWords: 70,
    maxWords: 160,
  },
  {
    id: "apology-delayed-delivery",
    category: "EMAIL",
    title: "Write an apology email",
    description: "Apologize to a customer for a delayed delivery and offer a concrete solution.",
    toneHint: "Empathetic, accountable, proactive",
    timeLimit: "15 min",
    minWords: 70,
    maxWords: 150,
  },
  {
    id: "cover-letter",
    category: "LETTER",
    title: "Write a cover letter",
    description: "Apply for your dream job and highlight your strongest qualifications and motivation.",
    toneHint: "Confident, persuasive, tailored",
    timeLimit: "20 min",
    minWords: 120,
    maxWords: 250,
  },
  {
    id: "post-interview-followup",
    category: "EMAIL",
    title: "Write a follow-up email",
    description: "Follow up after a job interview: thank the interviewer and reinforce your interest.",
    toneHint: "Warm, grateful, concise",
    timeLimit: "12 min",
    minWords: 60,
    maxWords: 140,
  },
  {
    id: "raise-meeting-request",
    category: "EMAIL",
    title: "Request a meeting with your manager",
    description: "Ask your manager for a meeting to discuss a salary raise, justifying your request.",
    toneHint: "Respectful, well-reasoned",
    timeLimit: "15 min",
    minWords: 70,
    maxWords: 160,
  },
  {
    id: "project-delay-notice",
    category: "EMAIL",
    title: "Announce a project delay",
    description: "Inform a client the project will be delayed one week and propose a recovery plan.",
    toneHint: "Transparent, responsible, solution-focused",
    timeLimit: "15 min",
    minWords: 80,
    maxWords: 170,
  },
  {
    id: "weekly-status-report",
    category: "REPORT",
    title: "Write a short status report",
    description: "Summarize this week's progress, current blockers and next steps for your team.",
    toneHint: "Structured, factual, scannable",
    timeLimit: "20 min",
    minWords: 100,
    maxWords: 220,
  },
  {
    id: "internal-tool-proposal",
    category: "PROPOSAL",
    title: "Write a project proposal",
    description: "Convince your leadership team to invest in a new internal tool. Include benefits and costs.",
    toneHint: "Executive, data-driven, compelling",
    timeLimit: "22 min",
    minWords: 120,
    maxWords: 260,
  },
  {
    id: "product-review",
    category: "REVIEW",
    title: "Write a product review",
    description: "Review a product you recently bought: pros, cons and your final verdict.",
    toneHint: "Balanced, descriptive, honest",
    timeLimit: "12 min",
    minWords: 80,
    maxWords: 180,
  },
  {
    id: "recruiter-linkedin",
    category: "MESSAGE",
    title: "Write a LinkedIn message",
    description: "Reach out to a recruiter about a position you are interested in and sell your profile.",
    toneHint: "Short, engaging, professional",
    timeLimit: "10 min",
    minWords: 50,
    maxWords: 120,
  },
  {
    id: "decline-invitation",
    category: "EMAIL",
    title: "Decline a business invitation",
    description: "Politely decline a business event invitation while keeping the relationship warm.",
    toneHint: "Diplomatic, appreciative, brief",
    timeLimit: "12 min",
    minWords: 50,
    maxWords: 130,
  },
  {
    id: "resignation-letter",
    category: "LETTER",
    title: "Write a resignation letter",
    description: "Announce your resignation professionally, express gratitude and offer a transition plan.",
    toneHint: "Gracious, professional, forward-looking",
    timeLimit: "15 min",
    minWords: 80,
    maxWords: 180,
  },
  {
    id: "supplier-negotiation",
    category: "EMAIL",
    title: "Negotiate with a supplier",
    description: "Ask a supplier for better pricing conditions without damaging the relationship.",
    toneHint: "Tactful, firm, win-win oriented",
    timeLimit: "18 min",
    minWords: 80,
    maxWords: 180,
  },
];

const MAX_RECENT_TASKS = 6;
const ACTIVE_TASK_STORAGE_KEY = "celaest:writing:activeTask";
const DRAFT_STORAGE_KEY = "celaest:writing:draft";

interface StoredDraft {
  taskId: string;
  content: string;
}

export class DynamicWritingTaskService {
  /** Recently served task ids (most recent last) to avoid immediate repetition */
  private static recentTaskIds: string[] = [];

  private static persistActiveTask(task: WritingTaskItem): void {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(ACTIVE_TASK_STORAGE_KEY, JSON.stringify(task));
    } catch {
      // Storage unavailable (private mode / quota): fall back to in-memory rotation
    }
  }

  /**
   * Returns the current active task. It is persisted in localStorage so a page
   * reload ALWAYS shows the same task until the user answers it.
   */
  public static getActiveTask(): WritingTaskItem {
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem(ACTIVE_TASK_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as WritingTaskItem;
          if (parsed?.id && WRITING_TASKS_POOL.some((t) => t.id === parsed.id)) {
            this.recentTaskIds = [...this.recentTaskIds, parsed.id].slice(-MAX_RECENT_TASKS);
            return parsed;
          }
        }
      }
    } catch {
      // Corrupted payload: fall through and serve a fresh task
    }

    const task = this.getRandomTask();
    this.persistActiveTask(task);
    return task;
  }

  /**
   * Call after the user answers: serves AND persists a brand-new task
   * guaranteed to be different from the answered one
   */
  public static completeTaskAndNext(answeredTaskId: string): WritingTaskItem {
    const next = this.getNextTask(answeredTaskId);
    this.persistActiveTask(next);
    return next;
  }

  /**
   * Persists the draft for the given task so a page reload never loses progress.
   * An empty content removes the stored draft.
   */
  public static saveDraft(taskId: string, content: string): void {
    try {
      if (typeof window === "undefined") return;
      if (!content.trim()) {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        return;
      }
      const draft: StoredDraft = { taskId, content };
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Storage unavailable: draft simply won't persist
    }
  }

  /**
   * Returns the stored draft only if it belongs to the given (active) task
   */
  public static loadDraft(taskId: string): string {
    try {
      if (typeof window === "undefined") return "";
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return "";
      const parsed = JSON.parse(raw) as StoredDraft;
      if (parsed?.taskId !== taskId) return "";
      return typeof parsed.content === "string" ? parsed.content : "";
    } catch {
      return "";
    }
  }

  public static clearDraft(): void {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // noop
    }
  }

  /**
   * Returns a random task, preferring tasks not served recently
   */
  public static getRandomTask(): WritingTaskItem {
    const candidates = WRITING_TASKS_POOL.filter(
      (task) => !this.recentTaskIds.includes(task.id)
    );
    const pool = candidates.length > 0 ? candidates : WRITING_TASKS_POOL;
    const task = pool[Math.floor(Math.random() * pool.length)];

    this.recentTaskIds = [...this.recentTaskIds, task.id].slice(-MAX_RECENT_TASKS);
    return task;
  }

  /**
   * Returns a brand-new task guaranteed to be different from the given one
   */
  public static getNextTask(currentTaskId?: string): WritingTaskItem {
    let task = this.getRandomTask();
    if (currentTaskId && task.id === currentTaskId) {
      const alternatives = WRITING_TASKS_POOL.filter((t) => t.id !== currentTaskId);
      task = alternatives[Math.floor(Math.random() * alternatives.length)];
      this.recentTaskIds = [...this.recentTaskIds, task.id].slice(-MAX_RECENT_TASKS);
    }
    return task;
  }
}
