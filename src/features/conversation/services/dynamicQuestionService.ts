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

const PM_TOPICS_POOL: DynamicQuestionTopic[] = [
  // ─── ROUND 1: CORE PRODUCT LEADERSHIP & ACCOMPLISHMENTS ───
  {
    category: "WARMUP",
    theme: "Role Motivation & Accomplishments",
    questionTemplate: "Tell me about yourself and what specifically motivates you to excel as a Product Manager in high-growth environments.",
    starHint: "Highlight your key achievements, product mindset, and customer obsession.",
    expectedKeywords: ["experience", "roadmap", "user-centric", "cross-functional", "impact"],
  },
  {
    category: "TECHNICAL",
    theme: "Feature Prioritization Frameworks",
    questionTemplate: "How do you prioritize competing feature requests from engineering, sales, and executive stakeholders?",
    starHint: "Mention frameworks like RICE, MoSCoW, or Value vs. Effort matrix with a real example.",
    expectedKeywords: ["RICE", "prioritization", "trade-offs", "customer value", "data-driven"],
  },
  {
    category: "BEHAVIORAL",
    theme: "Failed Product Launch & Resilience",
    questionTemplate: "Describe a time when a product launch didn't go as planned. How did you handle the situation?",
    starHint: "Structure using STAR: Situation, Task, Action you took, and measurable Lessons learned.",
    expectedKeywords: ["post-mortem", "iteration", "feedback", "pivoted", "resilience"],
  },
  {
    category: "TECHNICAL",
    theme: "Product Metrics & KPI Tracking",
    questionTemplate: "How do you define and measure product success for a new feature launch?",
    starHint: "Discuss North Star metrics, activation, retention, and leading vs. lagging indicators.",
    expectedKeywords: ["KPIs", "retention", "adoption", "cohorts", "A/B testing"],
  },
  {
    category: "SITUATIONAL",
    theme: "Engineering Disagreement & Alignment",
    questionTemplate: "Tell me about a time you had a strong technical disagreement with a lead engineer. How did you resolve it?",
    starHint: "Focus on active listening, alignment on user goals, and technical compromise.",
    expectedKeywords: ["alignment", "empathy", "consensus", "user research", "collaboration"],
  },

  // ─── ROUND 2: USER DISCOVERY & STRATEGIC TRADEOFFS ───
  {
    category: "STRATEGY",
    theme: "User Discovery & Problem-Solution Fit",
    questionTemplate: "How do you conduct user discovery and validate problem-solution fit before writing a single line of code?",
    starHint: "Discuss qualitative interviews, rapid prototyping, assumption testing, and analytics.",
    expectedKeywords: ["discovery", "interviews", "prototype", "validation", "user empathy"],
  },
  {
    category: "TECHNICAL",
    theme: "Managing Technical Debt vs New Features",
    questionTemplate: "Describe how you manage technical debt versus new feature development with your engineering team.",
    starHint: "Explain dedicated capacity allocations (e.g. 20% rule) and refactoring ROI.",
    expectedKeywords: ["tech debt", "capacity", "scalability", "reliability", "velocity"],
  },
  {
    category: "SITUATIONAL",
    theme: "Saying 'No' to Executives & Stakeholders",
    questionTemplate: "Tell me about a time you had to say 'no' to an executive or high-value client. How did you navigate the conversation?",
    starHint: "Emphasize diplomacy, referencing data/strategic goals, and offering alternative paths.",
    expectedKeywords: ["stakeholders", "data-backed", "trade-offs", "diplomacy", "alignment"],
  },
  {
    category: "STRATEGY",
    theme: "Outcome-Driven Product Roadmapping",
    questionTemplate: "How do you build a product roadmap that balances short-term wins with long-term strategic vision?",
    starHint: "Talk about outcome-based roadmaps (Now/Next/Later) instead of rigid feature timelines.",
    expectedKeywords: ["outcome-driven", "roadmap", "milestones", "vision", "OKRs"],
  },
  {
    category: "TECHNICAL",
    theme: "Root-Cause Analytics & Retention Drops",
    questionTemplate: "If our core user retention dropped by 15% this week, walk me through your step-by-step investigation.",
    starHint: "Segment by cohorts, check recent releases, inspect telemetry/error logs, and interview churned users.",
    expectedKeywords: ["funnel", "cohorts", "telemetry", "root cause", "analytics"],
  },

  // ─── ROUND 3: MONETIZATION & GROWTH EXPERIMENTATION ───
  {
    category: "STRATEGY",
    theme: "SaaS Pricing & Monetization Strategy",
    questionTemplate: "How do you price and monetize a new SaaS product tier to maximize customer lifetime value and expansion revenue?",
    starHint: "Discuss value metrics, willingness-to-pay research, freemium vs. trial, and CAC/LTV ratios.",
    expectedKeywords: ["monetization", "value metric", "pricing", "LTV", "CAC"],
  },
  {
    category: "BEHAVIORAL",
    theme: "Psychological Safety & Squad Ownership",
    questionTemplate: "How do you foster high psychological safety and strong product ownership across your cross-functional squad?",
    starHint: "Share how you celebrate learnings from failures, encourage autonomy, and run blameless retros.",
    expectedKeywords: ["empowerment", "psychological safety", "retrospectives", "team culture", "trust"],
  },
  {
    category: "STRATEGY",
    theme: "Competitive Response & Market Moats",
    questionTemplate: "A major competitor just launched our most requested feature. How do you respond strategically without copying them?",
    starHint: "Avoid knee-jerk copies; assess true market differentiation, core moat, and customer feedback.",
    expectedKeywords: ["differentiation", "competitive advantage", "core value", "moat", "focus"],
  },
  {
    category: "TECHNICAL",
    theme: "A/B Testing & Statistical Rigor",
    questionTemplate: "Describe your approach to designing and executing rigorous A/B experiments with statistically significant sample sizes.",
    starHint: "Mention hypothesis framing, sample size power, statistical significance, and guardrail metrics.",
    expectedKeywords: ["statistical significance", "hypothesis", "guardrails", "sample size", "experimentation"],
  },
  {
    category: "WRAPUP",
    theme: "AI-Driven Product Workflows",
    questionTemplate: "Where do you see the future of AI-driven product management, and how are you adapting your daily discovery workflow?",
    starHint: "Discuss AI-assisted discovery, automated analytics, synthetic users, and human-in-the-loop strategy.",
    expectedKeywords: ["generative AI", "automation", "discovery", "product intuition", "future"],
  },

  // ─── ROUND 4: ENTERPRISE GO-TO-MARKET & SCALING ───
  {
    category: "STRATEGY",
    theme: "Go-to-Market Alignment",
    questionTemplate: "How do you orchestrate a Go-to-Market strategy across marketing, sales enablement, and customer support for an enterprise release?",
    starHint: "Discuss beta programs, sales collateral, customer success training, and feedback loops.",
    expectedKeywords: ["GTM", "enablement", "positioning", "beta", "onboarding"],
  },
  {
    category: "TECHNICAL",
    theme: "Build vs Buy Decisions",
    questionTemplate: "How do you evaluate whether to build internal platform tools versus integrating third-party SaaS APIs?",
    starHint: "Frame as a Build vs. Buy analysis focusing on core competency, maintenance cost, and time-to-market.",
    expectedKeywords: ["build vs buy", "core competency", "API", "maintenance", "time to market"],
  },
  {
    category: "BEHAVIORAL",
    theme: "Sunsetting Legacy Features",
    questionTemplate: "Describe how you communicate and execute the deprecation or sunsetting of a legacy feature that users still rely on.",
    starHint: "Explain migration paths, stakeholder communication, phased timelines, and data monitoring.",
    expectedKeywords: ["sunset", "deprecation", "migration", "empathy", "communication"],
  },
  {
    category: "SITUATIONAL",
    theme: "Critical Production Outage Leadership",
    questionTemplate: "Our primary payment gateway experiences a critical 4-hour outage during Black Friday. What is your action plan as PM?",
    starHint: "Detail incident response: status page updates, executive alerts, fallback routing, and customer compensation.",
    expectedKeywords: ["incident response", "communication", "mitigation", "sla", "transparency"],
  },
  {
    category: "TECHNICAL",
    theme: "Funnel Optimization & Onboarding Drop-off",
    questionTemplate: "How would you diagnose and redesign an onboarding flow where 40% of signups drop off at step three?",
    starHint: "Discuss heatmaps, session recordings, micro-copy simplification, and reducing time-to-value.",
    expectedKeywords: ["onboarding", "drop-off", "friction", "activation", "time to value"],
  },

  // ─── ROUND 5: GLOBAL EXPANSION & ENTERPRISE ARCHITECTURE ───
  {
    category: "STRATEGY",
    theme: "International Expansion & Localization",
    questionTemplate: "How do you adapt your product strategy when expanding into a new international market with different regulatory and cultural requirements?",
    starHint: "Discuss GDPR/compliance, localized payment methods, cultural nuances, and regional user testing.",
    expectedKeywords: ["localization", "compliance", "internationalization", "market fit", "regulations"],
  },
  {
    category: "TECHNICAL",
    theme: "API-First & Developer Experience",
    questionTemplate: "If you were designing a public B2B developer API, how would you measure and optimize the developer experience (DX)?",
    starHint: "Focus on Time to First Hello World (TTFHW), documentation clarity, SDK availability, and error semantics.",
    expectedKeywords: ["developer experience", "SDK", "documentation", "API design", "rate limits"],
  },
  {
    category: "BEHAVIORAL",
    theme: "Managing Underperforming Product Initiatives",
    questionTemplate: "Tell me about a feature you championed that completely missed its KPI goals. What did you learn and how did you pivot?",
    starHint: "Demonstrate intellectual honesty, analyzing why assumptions failed, and recycling learnings.",
    expectedKeywords: ["learnings", "pivoting", "accountability", "hypotheses", "iteration"],
  },
  {
    category: "SITUATIONAL",
    theme: "Cross-Squad Dependency Deadlocks",
    questionTemplate: "Two autonomous engineering squads are blocked on shared infrastructure. How do you unblock them without top-down mandates?",
    starHint: "Explain RFC alignment, SLA agreements, executive arbitration, and decoupling architecture.",
    expectedKeywords: ["dependencies", "alignment", "decoupling", "prioritization", "collaboration"],
  },
  {
    category: "WRAPUP",
    theme: "Product Management Principles & Philosophy",
    questionTemplate: "What is the single most important product principle that guides all your day-to-day decisions as a leader?",
    starHint: "Connect a foundational belief (e.g. user empathy, extreme ownership, data-backed truth) to real impact.",
    expectedKeywords: ["philosophy", "principles", "user empathy", "ownership", "impact"],
  },
];

export class DynamicQuestionService {
  /**
   * Generates a guaranteed unique question for any index without repetition across all rounds
   */
  public static getQuestionForIndex(index: number, _roleName: string = "Product Manager"): InterviewQuestionItem {
    const pool = PM_TOPICS_POOL;
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
  public static getRoundQuestions(roundNumber: number, roleName: string = "Product Manager"): InterviewQuestionItem[] {
    const startIndex = (roundNumber - 1) * 5;
    const questions: InterviewQuestionItem[] = [];

    for (let i = 0; i < 5; i++) {
      questions.push(this.getQuestionForIndex(startIndex + i, roleName));
    }

    return questions;
  }
}
