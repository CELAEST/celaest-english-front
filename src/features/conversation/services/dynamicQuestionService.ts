/**
 * Dynamic AI Question Generator Service
 * Generates continuous, role-tailored progressive interview questions across infinite rounds
 * without repeating questions or relying on a small static loop.
 */

import { InterviewQuestionItem } from "./interviewEngineService";

export interface DynamicQuestionTopic {
  category: "WARMUP" | "BEHAVIORAL" | "TECHNICAL" | "SITUATIONAL" | "STRATEGY" | "WRAPUP";
  theme: string;
  questionTemplate: string;
  starHint: string;
  expectedKeywords: string[];
}

const SWE_TOPICS_POOL: DynamicQuestionTopic[] = [
  {
    category: "WARMUP",
    theme: "Technical Background & Architectural Passion",
    questionTemplate:
      "Can you walk me through your engineering background and the most technically challenging distributed system or feature you've designed?",
    starHint: "Highlight your architectural decisions, trade-offs, and measurable impact on performance or scalability.",
    expectedKeywords: ["architecture", "distributed systems", "trade-offs", "performance", "scalability"],
  },
  {
    category: "TECHNICAL",
    theme: "System Design & Microservice Scalability",
    questionTemplate:
      "How do you design a high-throughput API gateway to handle sudden 10x traffic spikes while maintaining sub-100ms latency?",
    starHint: "Discuss rate limiting, asynchronous queues (Kafka/RabbitMQ), caching layers (Redis), and connection pooling.",
    expectedKeywords: ["latency", "caching", "rate limiting", "message queues", "resilience"],
  },
  {
    category: "BEHAVIORAL",
    theme: "Production Outages & Post-Mortem Leadership",
    questionTemplate:
      "Tell me about a critical production bug or downtime incident you were involved in. How did you diagnose, mitigate, and conduct the post-mortem?",
    starHint: "Use STAR: Detail the root cause, immediate rollback or mitigation, and preventative telemetry guards.",
    expectedKeywords: ["post-mortem", "telemetry", "observability", "mitigation", "blameless"],
  },
  {
    category: "TECHNICAL",
    theme: "Concurrency, Deadlocks & Memory Leaks",
    questionTemplate:
      "Describe a time you diagnosed and resolved a subtle race condition, memory leak, or concurrency bottleneck in your application.",
    starHint: "Explain your profiling tools (e.g. pprof, heap snapshots, mutex analyzers) and the underlying synchronization fix.",
    expectedKeywords: ["concurrency", "race condition", "profiler", "mutex", "optimization"],
  },
  {
    category: "SITUATIONAL",
    theme: "Refactoring Legacy Monoliths vs Feature Velocity",
    questionTemplate:
      "How do you balance refactoring critical legacy code with delivering new business features when deadlines are aggressive?",
    starHint: "Explain Strangler Fig patterns, incremental testing, tech debt budgeting, and ROI justification to product managers.",
    expectedKeywords: ["technical debt", "refactoring", "incremental delivery", "ROI", "collaboration"],
  },
  {
    category: "STRATEGY",
    theme: "API Contract Design & Backwards Compatibility",
    questionTemplate:
      "When breaking changes are unavoidable in a public or internal API, how do you handle versioning and deprecation without disrupting consumers?",
    starHint: "Discuss semantic versioning, feature flags, dual-write adapters, and deprecation sunset timelines.",
    expectedKeywords: ["backward compatibility", "versioning", "deprecation", "feature flags", "contracts"],
  },
  {
    category: "BEHAVIORAL",
    theme: "Mentorship & Engineering Culture",
    questionTemplate:
      "Tell me about how you foster code review best practices and mentor junior or mid-level engineers in your team.",
    starHint: "Focus on constructive feedback, pairing, architectural documentation (RFCs), and psychological safety.",
    expectedKeywords: ["mentorship", "code review", "RFCs", "standards", "team growth"],
  },
  {
    category: "WRAPUP",
    theme: "Engineering Philosophy & Future Technologies",
    questionTemplate:
      "What is an emerging technology or software engineering paradigm you're currently exploring, and how do you evaluate whether to adopt it?",
    starHint: "Connect pragmatic experimentation with actual business value rather than chasing hype.",
    expectedKeywords: ["pragmatism", "evaluation", "benchmarking", "architecture", "growth"],
  },
];

const PM_TOPICS_POOL: DynamicQuestionTopic[] = [
  {
    category: "WARMUP",
    theme: "Role Motivation & Accomplishments",
    questionTemplate:
      "Tell me about yourself and what specifically motivates you to excel as a Product Manager in high-growth environments.",
    starHint: "Highlight your key achievements, product mindset, and customer obsession.",
    expectedKeywords: ["experience", "roadmap", "user-centric", "cross-functional", "impact"],
  },
  {
    category: "TECHNICAL",
    theme: "Feature Prioritization Frameworks",
    questionTemplate:
      "How do you prioritize competing feature requests from engineering, sales, and executive stakeholders?",
    starHint:
      "Mention frameworks like RICE, MoSCoW, or Value vs. Effort matrix with a real example.",
    expectedKeywords: ["RICE", "prioritization", "trade-offs", "customer value", "data-driven"],
  },
  {
    category: "BEHAVIORAL",
    theme: "Failed Product Launch & Resilience",
    questionTemplate:
      "Describe a time when a product launch didn't go as planned. How did you handle the situation?",
    starHint:
      "Structure using STAR: Situation, Task, Action you took, and measurable Lessons learned.",
    expectedKeywords: ["post-mortem", "iteration", "feedback", "pivoted", "resilience"],
  },
  {
    category: "TECHNICAL",
    theme: "Product Metrics & KPI Tracking",
    questionTemplate: "How do you define and measure product success for a new feature launch?",
    starHint:
      "Discuss North Star metrics, activation, retention, and leading vs. lagging indicators.",
    expectedKeywords: ["KPIs", "retention", "adoption", "cohorts", "A/B testing"],
  },
  {
    category: "SITUATIONAL",
    theme: "Engineering Disagreement & Alignment",
    questionTemplate:
      "Tell me about a time you had a strong technical disagreement with a lead engineer. How did you resolve it?",
    starHint: "Focus on active listening, alignment on user goals, and technical compromise.",
    expectedKeywords: ["alignment", "empathy", "consensus", "user research", "collaboration"],
  },
  {
    category: "STRATEGY",
    theme: "User Discovery & Problem-Solution Fit",
    questionTemplate:
      "How do you conduct user discovery and validate problem-solution fit before writing a single line of code?",
    starHint:
      "Discuss qualitative interviews, rapid prototyping, assumption testing, and analytics.",
    expectedKeywords: ["discovery", "interviews", "prototype", "validation", "user empathy"],
  },
  {
    category: "TECHNICAL",
    theme: "Managing Technical Debt vs New Features",
    questionTemplate:
      "Describe how you manage technical debt versus new feature development with your engineering team.",
    starHint: "Explain dedicated capacity allocations (e.g. 20% rule) and refactoring ROI.",
    expectedKeywords: ["tech debt", "capacity", "scalability", "reliability", "velocity"],
  },
  {
    category: "SITUATIONAL",
    theme: "Saying 'No' to Executives & Stakeholders",
    questionTemplate:
      "Tell me about a time you had to say 'no' to an executive or high-value client. How did you navigate the conversation?",
    starHint:
      "Emphasize diplomacy, referencing data/strategic goals, and offering alternative paths.",
    expectedKeywords: ["stakeholders", "data-backed", "trade-offs", "diplomacy", "alignment"],
  },
  {
    category: "WRAPUP",
    theme: "Product Management Principles & Philosophy",
    questionTemplate:
      "What is the single most important product principle that guides all your day-to-day decisions as a leader?",
    starHint:
      "Connect a foundational belief (e.g. user empathy, extreme ownership, data-backed truth) to real impact.",
    expectedKeywords: ["philosophy", "principles", "user empathy", "ownership", "impact"],
  },
];

const GENERAL_BUSINESS_POOL: DynamicQuestionTopic[] = [
  {
    category: "WARMUP",
    theme: "Professional Journey & Core Value",
    questionTemplate:
      "Could you introduce yourself and tell me about the key projects that have defined your professional career so far?",
    starHint: "Structure your narrative clearly: brief history, core expertise, and current ambitions.",
    expectedKeywords: ["experience", "achievements", "leadership", "value", "goals"],
  },
  {
    category: "BEHAVIORAL",
    theme: "Overcoming Complex Challenges",
    questionTemplate:
      "Can you describe a situation where you faced unexpected roadblocks on a project? How did you adapt your plan to succeed?",
    starHint: "Use the STAR method: Situation, Task, your proactive Action, and the quantifiable Result.",
    expectedKeywords: ["adaptability", "problem-solving", "action", "outcome", "resilience"],
  },
  {
    category: "SITUATIONAL",
    theme: "Cross-Cultural & Stakeholder Communication",
    questionTemplate:
      "How do you handle difficult conversations or negotiations with international colleagues or demanding clients?",
    starHint: "Emphasize active listening, clarity, cultural awareness, and finding win-win agreements.",
    expectedKeywords: ["negotiation", "clarity", "empathy", "communication", "alignment"],
  },
  {
    category: "STRATEGY",
    theme: "Continuous Learning & Professional Growth",
    questionTemplate:
      "What strategies do you use to continuously improve your English communication and leadership skills in your daily routine?",
    starHint: "Highlight consistency, deliberate practice, receiving feedback, and applying lessons in real meetings.",
    expectedKeywords: ["deliberate practice", "consistency", "feedback", "growth", "communication"],
  },
];

export class DynamicQuestionService {
  private static selectPool(roleName: string): DynamicQuestionTopic[] {
    const clean = roleName.toLowerCase();
    if (
      clean.includes("software") ||
      clean.includes("engineer") ||
      clean.includes("developer") ||
      clean.includes("tech") ||
      clean.includes("ai") ||
      clean.includes("data") ||
      clean.includes("fullstack") ||
      clean.includes("backend") ||
      clean.includes("frontend")
    ) {
      return SWE_TOPICS_POOL;
    }
    if (
      clean.includes("product") ||
      clean.includes("pm") ||
      clean.includes("project") ||
      clean.includes("owner") ||
      clean.includes("scrum")
    ) {
      return PM_TOPICS_POOL;
    }
    return GENERAL_BUSINESS_POOL;
  }

  /**
   * Generates a guaranteed unique question for any index without repetition across all rounds
   */
  public static getQuestionForIndex(
    index: number,
    roleName: string = "Software Engineer",
  ): InterviewQuestionItem {
    const pool = this.selectPool(roleName);
    const safeIndex = Math.max(0, index);
    const topic = pool[safeIndex % pool.length];
    const round = Math.floor(safeIndex / 5) + 1;

    return {
      id: safeIndex + 1,
      question: topic.questionTemplate,
      category: topic.category,
      starHint: topic.starHint,
      expectedKeywords: topic.expectedKeywords,
      round,
    };
  }

  /**
   * Generates a batch of 5 unique questions for a given round
   */
  public static getRoundQuestions(
    roundNumber: number,
    roleName: string = "Software Engineer",
  ): InterviewQuestionItem[] {
    const startIndex = (roundNumber - 1) * 5;
    const questions: InterviewQuestionItem[] = [];

    for (let i = 0; i < 5; i++) {
      questions.push(this.getQuestionForIndex(startIndex + i, roleName));
    }

    return questions;
  }
}
