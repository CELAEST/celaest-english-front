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
import { normalizeCefr, classifyProfession, CefrLevelCode, ProfessionCategory } from "../../conversation/services/dynamicQuestionService";
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

const WRITING_TASKS_POOL: WritingTaskItem[] = [
  // ==========================================
  // LEVEL A1 — BEGINNER (20 - 50 words)
  // ==========================================
  {
    id: "a1-tech-daily-delay",
    category: "MESSAGE",
    title: "Send a Slack note about the Daily Standup",
    description: "Write a short message to your team saying you will join the daily standup meeting 10 minutes late.",
    toneHint: "Direct, polite, concise",
    timeLimit: "8 min",
    minWords: 20,
    maxWords: 45,
    level: "A1",
    roleCategory: "TECH",
    starterPhrases: ["Hi team, I will be...", "Sorry for the delay, I have...", "See you at..."],
  },
  {
    id: "a1-tech-welcome-colleague",
    category: "MESSAGE",
    title: "Welcome a New Developer to the Team",
    description: "Send a friendly welcome message introducing yourself and offering help with the local setup.",
    toneHint: "Warm, welcoming, friendly",
    timeLimit: "8 min",
    minWords: 25,
    maxWords: 50,
    level: "A1",
    roleCategory: "TECH",
    starterPhrases: ["Welcome to the team!", "My name is... and I work on...", "Let me know if you need help."],
  },
  {
    id: "a1-pm-coffee-invite",
    category: "MESSAGE",
    title: "Invite a Teammate to a Quick Sync",
    description: "Write a short message inviting a coworker to a 5-minute coffee chat or sync about a task.",
    toneHint: "Friendly, casual, clear",
    timeLimit: "8 min",
    minWords: 20,
    maxWords: 45,
    level: "A1",
    roleCategory: "PRODUCT",
    starterPhrases: ["Hi! Do you have 5 minutes...", "Let's grab a quick coffee...", "Thanks!"],
  },
  {
    id: "a1-biz-thank-call",
    category: "EMAIL",
    title: "Thank a Client for a Call",
    description: "Write a brief email thanking a client for attending today's introductory meeting.",
    toneHint: "Polite, thankful, simple",
    timeLimit: "10 min",
    minWords: 25,
    maxWords: 50,
    level: "A1",
    roleCategory: "BUSINESS",
    starterPhrases: ["Thank you for your time today.", "It was great to speak with you.", "Have a nice day."],
  },
  {
    id: "a1-health-appointment-reminder",
    category: "MESSAGE",
    title: "Confirm a Routine Dental Checkup",
    description: "Send a brief reminder message to a patient confirming their scheduled dental cleaning tomorrow morning.",
    toneHint: "Polite, welcoming, clear",
    timeLimit: "8 min",
    minWords: 20,
    maxWords: 45,
    level: "A1",
    roleCategory: "HEALTHCARE",
    starterPhrases: ["Good morning, this is a reminder for...", "Your dental cleaning is scheduled for...", "Please confirm if you can make it."],
  },

  // ==========================================
  // LEVEL A2 — ELEMENTARY (35 - 75 words)
  // ==========================================
  {
    id: "a2-tech-pr-review-request",
    category: "EMAIL",
    title: "Request a Code Review for a Pull Request",
    description: "Ask a teammate to review your pull request, explaining briefly what changes you made.",
    toneHint: "Collaborative, clear, appreciative",
    timeLimit: "10 min",
    minWords: 35,
    maxWords: 75,
    level: "A2",
    roleCategory: "TECH",
    starterPhrases: ["Could you please review my pull request?", "I fixed the issue with...", "Here is the link..."],
  },
  {
    id: "a2-tech-minor-bug-report",
    category: "REPORT",
    title: "Report a Minor UI Bug to the Team",
    description: "Write a short bug report describing a broken button or text overflow on the staging server.",
    toneHint: "Factual, structured, brief",
    timeLimit: "10 min",
    minWords: 35,
    maxWords: 70,
    level: "A2",
    roleCategory: "TECH",
    starterPhrases: ["I found a minor bug on staging.", "When you click on..., it shows...", "Please check the screenshot."],
  },
  {
    id: "a2-pm-meeting-reschedule",
    category: "EMAIL",
    title: "Reschedule a Sprint Planning Session",
    description: "Inform the team that the planning meeting is moved by one hour due to a conflict.",
    toneHint: "Professional, apologetic, clear",
    timeLimit: "10 min",
    minWords: 35,
    maxWords: 75,
    level: "A2",
    roleCategory: "PRODUCT",
    starterPhrases: ["Please note our sprint planning is moved to...", "Sorry for the inconvenience.", "Let me know if this time works."],
  },
  {
    id: "a2-biz-confirm-delivery",
    category: "EMAIL",
    title: "Confirm Receipt of Documents",
    description: "Acknowledge receiving the signed contract from an external client and state the next step.",
    toneHint: "Courteous, reassuring, clear",
    timeLimit: "10 min",
    minWords: 35,
    maxWords: 70,
    level: "A2",
    roleCategory: "BUSINESS",
    starterPhrases: ["We have received the signed documents.", "Everything looks complete.", "We will proceed with..."],
  },
  {
    id: "a2-health-hygiene-instructions",
    category: "EMAIL",
    title: "Send Post-Cleaning Oral Hygiene Instructions",
    description: "Write a brief follow-up note to a patient thanking them for their visit and reminding them to brush gently twice daily and floss.",
    toneHint: "Encouraging, clear, informative",
    timeLimit: "10 min",
    minWords: 35,
    maxWords: 75,
    level: "A2",
    roleCategory: "HEALTHCARE",
    starterPhrases: ["Thank you for visiting our dental clinic today.", "To maintain healthy gums, please remember to...", "Feel free to call us if you experience sensitivity."],
  },

  // ==========================================
  // LEVEL B1 — INTERMEDIATE (60 - 140 words)
  // ==========================================
  {
    id: "b1-tech-client-project-update",
    category: "EMAIL",
    title: "Write an email to a client with a project update",
    description: "Use a professional tone to summarize this week's progress and the next milestone.",
    toneHint: "Professional, concise, solution-oriented",
    timeLimit: "15 min",
    minWords: 60,
    maxWords: 140,
    level: "B1",
    roleCategory: "TECH",
  },
  {
    id: "b1-tech-project-delay-notice",
    category: "EMAIL",
    title: "Announce a project delay and mitigation plan",
    description: "Inform a client the release will be delayed three days and explain the recovery plan.",
    toneHint: "Transparent, responsible, solution-focused",
    timeLimit: "15 min",
    minWords: 70,
    maxWords: 150,
    level: "B1",
    roleCategory: "TECH",
  },
  {
    id: "b1-pm-weekly-status-report",
    category: "REPORT",
    title: "Write a Weekly Status Report",
    description: "Summarize this week's progress, current blockers, and key goals for the coming sprint.",
    toneHint: "Structured, factual, scannable",
    timeLimit: "15 min",
    minWords: 70,
    maxWords: 150,
    level: "B1",
    roleCategory: "PRODUCT",
  },
  {
    id: "b1-biz-post-interview-followup",
    category: "EMAIL",
    title: "Write a Post-Interview Follow-Up Email",
    description: "Follow up after a job interview: thank the interviewer and reinforce your unique fit for the role.",
    toneHint: "Warm, grateful, confident",
    timeLimit: "12 min",
    minWords: 60,
    maxWords: 130,
    level: "B1",
    roleCategory: "BUSINESS",
  },
  {
    id: "b1-biz-decline-invitation",
    category: "EMAIL",
    title: "Decline a Business Invitation Diplomatically",
    description: "Politely decline a speaking or conference invitation while keeping the relationship warm.",
    toneHint: "Diplomatic, appreciative, brief",
    timeLimit: "12 min",
    minWords: 50,
    maxWords: 120,
    level: "B1",
    roleCategory: "BUSINESS",
  },
  {
    id: "b1-health-root-canal-followup",
    category: "EMAIL",
    title: "Post-Treatment Care Instructions After Endodontic Therapy",
    description: "Send a clinical follow-up email to a patient who had a root canal treatment today. Explain expected mild soreness, chewing precautions on that tooth, and when their permanent restoration crown will be placed.",
    toneHint: "Empathetic, reassuring, professional",
    timeLimit: "15 min",
    minWords: 60,
    maxWords: 140,
    level: "B1",
    roleCategory: "HEALTHCARE",
    starterPhrases: [
      "I hope you are resting comfortably after your root canal treatment.",
      "Mild sensitivity is normal for the next 48 hours as the tissue heals.",
      "Please avoid chewing hard foods on that side until your permanent crown is placed.",
    ],
  },
  {
    id: "b1-health-filling-care",
    category: "EMAIL",
    title: "Post-Operative Guidance for Composite Restorations",
    description: "Advise a patient on aftercare following tooth-colored composite restorations, noting sensitivity triggers and bite checks.",
    toneHint: "Clear, clinical, supportive",
    timeLimit: "14 min",
    minWords: 55,
    maxWords: 130,
    level: "B1",
    roleCategory: "HEALTHCARE",
    starterPhrases: [
      "Following your dental filling today, please keep these care tips in mind.",
      "Wait until the local anesthesia wears off completely before eating warm meals.",
      "Contact our office promptly if your bite feels high or uneven.",
    ],
  },

  // ==========================================
  // LEVEL B2 — UPPER INTERMEDIATE (80 - 180 words)
  // ==========================================
  {
    id: "b2-tech-sprint-retrospective-action",
    category: "EMAIL",
    title: "Summarize Sprint Retrospective Action Items",
    description: "Send an email to engineering outlining key lessons learned and agreed process improvements.",
    toneHint: "Collaborative, action-oriented, clear",
    timeLimit: "15 min",
    minWords: 80,
    maxWords: 170,
    level: "B2",
    roleCategory: "TECH",
  },
  {
    id: "b2-pm-feature-launch-announcement",
    category: "REPORT",
    title: "Draft an Internal Feature Release Announcement",
    description: "Detail new capabilities, customer impact, support documentation links, and thank contributors.",
    toneHint: "Celebratory, informative, professional",
    timeLimit: "18 min",
    minWords: 85,
    maxWords: 180,
    level: "B2",
    roleCategory: "PRODUCT",
  },
  {
    id: "b2-biz-cover-letter",
    category: "LETTER",
    title: "Write a Compelling Professional Cover Letter",
    description: "Apply for your target position, highlighting measurable accomplishments and role alignment.",
    toneHint: "Confident, persuasive, tailored",
    timeLimit: "20 min",
    minWords: 100,
    maxWords: 200,
    level: "B2",
    roleCategory: "BUSINESS",
  },
  {
    id: "b2-biz-supplier-negotiation",
    category: "EMAIL",
    title: "Negotiate Pricing with a SaaS Vendor",
    description: "Request better annual contract terms without compromising vendor relationship goodwill.",
    toneHint: "Tactful, firm, win-win oriented",
    timeLimit: "18 min",
    minWords: 80,
    maxWords: 180,
    level: "B2",
    roleCategory: "BUSINESS",
  },
  {
    id: "b2-health-treatment-plan-consultation",
    category: "EMAIL",
    title: "Comprehensive Dental Rehabilitation & Crown Proposal",
    description: "Summarize a comprehensive clinical consultation for a patient comparing direct composite buildup versus a porcelain crown, detailing longevity, structural integrity, and step-by-step phases.",
    toneHint: "Authoritative, educational, patient-centric",
    timeLimit: "18 min",
    minWords: 80,
    maxWords: 175,
    level: "B2",
    roleCategory: "HEALTHCARE",
    starterPhrases: [
      "Thank you for attending our comprehensive dental consultation today.",
      "Based on our digital scans and structural evaluation, we recommend...",
      "Phase one will focus on periodontal stabilization, followed by the crown restoration.",
    ],
  },
  {
    id: "b2-health-periodontal-maintenance",
    category: "REPORT",
    title: "Periodontal Health Maintenance & Pocket Depth Summary",
    description: "Prepare a clinical summary report for a patient detailing periodontal probing measurements, the benefits of ultrasonic scaling, and home care protocols.",
    toneHint: "Objective, encouraging, thorough",
    timeLimit: "18 min",
    minWords: 85,
    maxWords: 180,
    level: "B2",
    roleCategory: "HEALTHCARE",
    starterPhrases: [
      "Here is the clinical summary of your latest periodontal assessment.",
      "We observed notable reduction in bleeding on probing following deep scaling.",
      "To preserve bone support, 3-to-4-month periodontal maintenance visits are advised.",
    ],
  },

  // ==========================================
  // LEVEL C1 / C2 — ADVANCED & EXECUTIVE (120 - 280 words)
  // ==========================================
  {
    id: "c1-tech-incident-postmortem",
    category: "REPORT",
    title: "Write an Incident Post-Mortem",
    description: "Explain the root cause of a production outage, immediate mitigation steps, and preventative telemetry guards.",
    toneHint: "Blameless, precise, analytical",
    timeLimit: "20 min",
    minWords: 110,
    maxWords: 240,
    level: "C1",
    roleCategory: "TECH",
  },
  {
    id: "c1-tech-rfc-architectural-proposal",
    category: "PROPOSAL",
    title: "Draft an Architectural RFC",
    description: "Propose migrating from a monolithic architecture to asynchronous event-driven services with clear trade-offs.",
    toneHint: "Structured, technical, persuasive",
    timeLimit: "25 min",
    minWords: 120,
    maxWords: 280,
    level: "C1",
    roleCategory: "TECH",
  },
  {
    id: "c1-pm-internal-tool-proposal",
    category: "PROPOSAL",
    title: "Write an Executive Product Investment Proposal",
    description: "Convince leadership to invest in an internal design-to-code automation pipeline. Detail ROI and risk.",
    toneHint: "Executive, data-driven, compelling",
    timeLimit: "22 min",
    minWords: 120,
    maxWords: 260,
    level: "C1",
    roleCategory: "PRODUCT",
  },
  {
    id: "c1-biz-cross-functional-alignment",
    category: "MESSAGE",
    title: "Send a Senior Stakeholder Alignment Brief",
    description: "Update C-level leadership on multi-quarter expansion timeline, addressing cross-departmental friction.",
    toneHint: "Executive-ready, concise, proactive",
    timeLimit: "15 min",
    minWords: 100,
    maxWords: 220,
    level: "C1",
    roleCategory: "BUSINESS",
  },
  {
    id: "c1-health-cross-specialty-referral",
    category: "LETTER",
    title: "Clinical Referral Letter to an Oral and Maxillofacial Surgeon",
    description: "Draft a formal cross-specialty referral letter for a patient presenting with impacted third molars with intimate nerve proximity, including diagnostic CBCT findings and clinical rationale.",
    toneHint: "Rigorous, collegial, authoritative",
    timeLimit: "20 min",
    minWords: 110,
    maxWords: 240,
    level: "C1",
    roleCategory: "HEALTHCARE",
    starterPhrases: [
      "I am referring this patient for specialist evaluation regarding complex third molar extraction.",
      "Digital CBCT imaging demonstrates close proximity of the roots to the inferior alveolar canal.",
      "Thank you for providing your surgical assessment and coordination.",
    ],
  },
];

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
  /** Recently served task ids to avoid immediate repetition */
  private static recentTaskIds: string[] = [];

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
    const category = classifyProfession(roleName);

    // Filter by level tier
    let levelTasks = WRITING_TASKS_POOL.filter((t) => {
      if (level === "A1" || level === "A2") return t.level === "A1" || t.level === "A2";
      if (level === "B1" || level === "B2") return t.level === "B1" || t.level === "B2";
      return t.level === "C1" || t.level === "C2" || t.level === "B2";
    });

    if (levelTasks.length === 0) {
      levelTasks = WRITING_TASKS_POOL;
    }

    // Try finding tasks matching role category
    const roleTasks = levelTasks.filter((t) => t.roleCategory === category);
    return roleTasks.length > 0 ? roleTasks : levelTasks;
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
    const candidatePool = this.filterTasks(userCefr, roleName);
    const completed = this.getCompletedTaskIds();
    const uncompleted = candidatePool.filter((t) => !completed.includes(t.id));
    const pool = uncompleted.length > 0 ? uncompleted : candidatePool;
    const candidates = pool.filter((task) => !this.recentTaskIds.includes(task.id));
    const finalPool = candidates.length > 0 ? candidates : pool;
    const task = finalPool[Math.floor(Math.random() * finalPool.length)];

    if (!task.starterPhrases || task.starterPhrases.length === 0) {
      task.starterPhrases = getDefaultStarterPhrases(task.level, task.category);
    }

    this.recentTaskIds = [...this.recentTaskIds, task.id].slice(-6);
    return task;
  }

  /**
   * Returns a brand-new task guaranteed to be different from the given one
   */
  public static getNextTask(
    currentTaskId?: string,
    userCefr?: string,
    roleName?: string,
  ): WritingTaskItem {
    let task = this.getRandomTask(userCefr, roleName);
    if (currentTaskId && task.id === currentTaskId) {
      const candidatePool = this.filterTasks(userCefr, roleName);
      const completed = this.getCompletedTaskIds();
      const uncompleted = candidatePool.filter((t) => !completed.includes(t.id) && t.id !== currentTaskId);
      const pool = uncompleted.length > 0 ? uncompleted : candidatePool.filter((t) => t.id !== currentTaskId);
      const finalPool = pool.length > 0 ? pool : candidatePool;
      task = finalPool[Math.floor(Math.random() * finalPool.length)];
      this.recentTaskIds = [...this.recentTaskIds, task.id].slice(-6);
    }
    return task;
  }
}
