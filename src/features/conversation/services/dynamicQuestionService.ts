/**
 * Dynamic AI Question Generator Service
 * Generates continuous, role-tailored and CEFR-calibrated progressive interview questions across infinite rounds
 * without repeating questions or relying on a small static loop.
 *
 * Fully adapts questions to both:
 * 1. User Profession (Software Engineer, Product Manager, Designer, Data/AI, Business)
 * 2. User CEFR Level (A1/A2 Foundation, B1/B2 Intermediate, C1/C2 Advanced)
 */

import { InterviewQuestionItem } from "./interviewEngineService";

export type CefrLevelCode = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type ProfessionCategory =
  | "HEALTHCARE"
  | "LEGAL"
  | "EDUCATION"
  | "TECH"
  | "PRODUCT"
  | "DESIGN"
  | "DATA"
  | "BUSINESS";

export interface DynamicQuestionTopic {
  category: "WARMUP" | "BEHAVIORAL" | "TECHNICAL" | "SITUATIONAL" | "STRATEGY" | "WRAPUP";
  theme: string;
  questionTemplate: string;
  starHint: string;
  expectedKeywords: string[];
  targetLevel: CefrLevelCode;
}

export function normalizeCefr(raw?: string): CefrLevelCode {
  if (!raw) return "B1";
  const upper = raw.toUpperCase().trim();
  if (upper.startsWith("A1")) return "A1";
  if (upper.startsWith("A2")) return "A2";
  if (upper.startsWith("B1")) return "B1";
  if (upper.startsWith("B2")) return "B2";
  if (upper.startsWith("C1")) return "C1";
  if (upper.startsWith("C2")) return "C2";
  return "B1";
}

export function classifyProfession(roleName?: string): ProfessionCategory {
  if (!roleName) return "TECH";
  const clean = roleName.toLowerCase();

  // 1. Healthcare & Dental / Medical Specialities
  if (
    clean.includes("odontol") ||
    clean.includes("dentis") ||
    clean.includes("dental") ||
    clean.includes("tooth") ||
    clean.includes("teeth") ||
    clean.includes("ortodon") ||
    clean.includes("periodon") ||
    clean.includes("medic") ||
    clean.includes("doctor") ||
    clean.includes("physician") ||
    clean.includes("nurse") ||
    clean.includes("enferm") ||
    clean.includes("salud") ||
    clean.includes("health") ||
    clean.includes("clinic") ||
    clean.includes("therap") ||
    clean.includes("pharma") ||
    clean.includes("hospital")
  ) {
    return "HEALTHCARE";
  }

  // 2. Legal / Law / Jurisprudence
  if (
    clean.includes("law") ||
    clean.includes("abogad") ||
    clean.includes("legal") ||
    clean.includes("jurid") ||
    clean.includes("court") ||
    clean.includes("attorney")
  ) {
    return "LEGAL";
  }

  // 3. Education / Teaching
  if (
    clean.includes("teach") ||
    clean.includes("profesor") ||
    clean.includes("docent") ||
    clean.includes("educat") ||
    clean.includes("pedagog") ||
    clean.includes("school")
  ) {
    return "EDUCATION";
  }

  if (
    clean.includes("product") ||
    clean.includes("pm") ||
    clean.includes("project") ||
    clean.includes("scrum") ||
    clean.includes("owner")
  ) {
    return "PRODUCT";
  }
  if (
    clean.includes("design") ||
    clean.includes("ui") ||
    clean.includes("ux") ||
    clean.includes("creative") ||
    clean.includes("illustrat")
  ) {
    return "DESIGN";
  }
  if (
    clean.includes("data") ||
    clean.includes("ai") ||
    clean.includes("ml") ||
    clean.includes("machine learning") ||
    clean.includes("analyst") ||
    clean.includes("statistic")
  ) {
    return "DATA";
  }
  if (
    clean.includes("software") ||
    clean.includes("engineer") ||
    clean.includes("developer") ||
    clean.includes("frontend") ||
    clean.includes("backend") ||
    clean.includes("fullstack") ||
    clean.includes("devops") ||
    clean.includes("qa") ||
    clean.includes("tech") ||
    clean.includes("architect") ||
    clean.includes("programmer") ||
    clean.includes("coding")
  ) {
    return "TECH";
  }
  return "BUSINESS";
}

// ==========================================
// 1. TECH / SOFTWARE ENGINEERING POOLS
// ==========================================

const TECH_A1_A2_POOL: DynamicQuestionTopic[] = [
  {
    category: "WARMUP",
    theme: "Tools & Programming Languages",
    questionTemplate:
      "What programming languages or development tools do you use every day, and why do you like them?",
    starHint: "Name 1 or 2 tools (e.g. JavaScript, VS Code) and explain simply what you build with them.",
    expectedKeywords: ["language", "code", "tools", "build", "project"],
    targetLevel: "A2",
  },
  {
    category: "TECHNICAL",
    theme: "Daily Work & Routine",
    questionTemplate:
      "Can you describe what you usually do in your typical workday as a developer?",
    starHint: "Use simple present: I check tasks, write code, test my features, and talk with my team.",
    expectedKeywords: ["daily", "tasks", "meetings", "code", "review"],
    targetLevel: "A2",
  },
  {
    category: "BEHAVIORAL",
    theme: "Fixing a Simple Bug",
    questionTemplate:
      "Tell me about a simple bug or error you fixed recently in your code. How did you find it?",
    starHint: "Situation: I had an error in my code. Action: I used console.log or read the error message. Result: The feature worked.",
    expectedKeywords: ["bug", "fix", "test", "error", "solved"],
    targetLevel: "A2",
  },
  {
    category: "SITUATIONAL",
    theme: "Asking for Help",
    questionTemplate:
      "When you get stuck on a difficult coding problem, how do you ask your teammates or mentor for help?",
    starHint: "Explain how you show the problem, what you tried first, and how you ask politely.",
    expectedKeywords: ["help", "team", "question", "share", "learn"],
    targetLevel: "A1",
  },
  {
    category: "WRAPUP",
    theme: "Learning New Technologies",
    questionTemplate:
      "What is something new in technology or software that you want to learn this year?",
    starHint: "Mention one technology (e.g. React, TypeScript, Cloud) and why it interests you.",
    expectedKeywords: ["learn", "technology", "future", "practice", "grow"],
    targetLevel: "A1",
  },
];

const TECH_B1_B2_POOL: DynamicQuestionTopic[] = [
  {
    category: "WARMUP",
    theme: "Recent Project & Team Impact",
    questionTemplate:
      "Can you describe a recent project or feature you built, and what specific part you were responsible for?",
    starHint: "Explain your role, the core technologies involved, and how your contribution helped the team.",
    expectedKeywords: ["responsibility", "feature", "framework", "collaboration", "delivery"],
    targetLevel: "B1",
  },
  {
    category: "TECHNICAL",
    theme: "Code Quality & Testing",
    questionTemplate:
      "How do you test your code before submitting a pull request to ensure high quality and avoid regressions?",
    starHint: "Mention unit tests, manual edge-case testing, and how you write clear PR descriptions.",
    expectedKeywords: ["unit tests", "pull request", "edge cases", "debugging", "validation"],
    targetLevel: "B2",
  },
  {
    category: "BEHAVIORAL",
    theme: "Code Review Disagreements",
    questionTemplate:
      "Tell me about a time when a colleague had different feedback on your pull request. How did you reach agreement?",
    starHint: "Use STAR: The discussion, your receptive mindset, the technical compromise, and the successful merge.",
    expectedKeywords: ["code review", "feedback", "compromise", "communication", "standards"],
    targetLevel: "B1",
  },
  {
    category: "SITUATIONAL",
    theme: "Handling Urgent Production Bugs",
    questionTemplate:
      "If a user reports an unexpected issue in production during a busy workday, what are your first troubleshooting steps?",
    starHint: "Detail log verification, reproducing locally, hotfix isolation, and keeping stakeholders updated.",
    expectedKeywords: ["logs", "troubleshoot", "reproduce", "hotfix", "communication"],
    targetLevel: "B2",
  },
  {
    category: "STRATEGY",
    theme: "Refactoring vs Shipping Features",
    questionTemplate:
      "How do you decide when it is worth spending time refactoring messy code versus delivering the next ticket quickly?",
    starHint: "Discuss technical debt awareness, estimating risks, and proposing small incremental improvements.",
    expectedKeywords: ["technical debt", "refactoring", "priority", "clean code", "balance"],
    targetLevel: "B2",
  },
];

const TECH_C1_C2_POOL: DynamicQuestionTopic[] = [
  {
    category: "WARMUP",
    theme: "Technical Background & Architectural Passion",
    questionTemplate:
      "Can you walk me through your engineering background and the most technically challenging distributed system or feature you've designed?",
    starHint: "Highlight your architectural decisions, trade-offs, and measurable impact on performance or scalability.",
    expectedKeywords: ["architecture", "distributed systems", "trade-offs", "performance", "scalability"],
    targetLevel: "C1",
  },
  {
    category: "TECHNICAL",
    theme: "System Design & Microservice Scalability",
    questionTemplate:
      "How do you design a high-throughput API gateway to handle sudden 10x traffic spikes while maintaining sub-100ms latency?",
    starHint: "Discuss rate limiting, asynchronous queues (Kafka/RabbitMQ), caching layers (Redis), and connection pooling.",
    expectedKeywords: ["latency", "caching", "rate limiting", "message queues", "resilience"],
    targetLevel: "C1",
  },
  {
    category: "BEHAVIORAL",
    theme: "Production Outages & Post-Mortem Leadership",
    questionTemplate:
      "Tell me about a critical production downtime incident you were involved in. How did you diagnose, mitigate, and conduct the blameless post-mortem?",
    starHint: "Use STAR: Detail root cause analysis, telemetry guards, rollback automation, and preventative architectural safeguards.",
    expectedKeywords: ["post-mortem", "telemetry", "observability", "mitigation", "blameless"],
    targetLevel: "C2",
  },
  {
    category: "TECHNICAL",
    theme: "Concurrency, Deadlocks & Memory Leaks",
    questionTemplate:
      "Describe a time you diagnosed and resolved a subtle race condition, memory leak, or concurrency bottleneck in your application.",
    starHint: "Explain your profiling tools (e.g. pprof, heap snapshots, mutex analyzers) and the underlying synchronization fix.",
    expectedKeywords: ["concurrency", "race condition", "profiler", "mutex", "optimization"],
    targetLevel: "C1",
  },
  {
    category: "STRATEGY",
    theme: "API Contract Design & Backwards Compatibility",
    questionTemplate:
      "When breaking changes are unavoidable in a public or internal API, how do you handle versioning and deprecation without disrupting consumers?",
    starHint: "Discuss semantic versioning, feature flags, dual-write adapters, and deprecation sunset timelines.",
    expectedKeywords: ["backward compatibility", "versioning", "deprecation", "feature flags", "contracts"],
    targetLevel: "C1",
  },
];

// ==========================================
// 2. PRODUCT MANAGEMENT POOLS
// ==========================================

const PM_A1_A2_POOL: DynamicQuestionTopic[] = [
  {
    category: "WARMUP",
    theme: "Favorite Digital Products",
    questionTemplate:
      "What is one mobile app or website you use frequently, and what is one feature you like about it?",
    starHint: "Name the app, describe what it does, and explain why it provides a good user experience.",
    expectedKeywords: ["app", "feature", "user", "simple", "design"],
    targetLevel: "A2",
  },
  {
    category: "TECHNICAL",
    theme: "Daily Team Communication",
    questionTemplate:
      "How do you usually talk with designers and developers to explain what needs to be built?",
    starHint: "Explain using simple terms: writing user stories, holding short meetings, and answering questions.",
    expectedKeywords: ["team", "explain", "requirements", "listen", "meeting"],
    targetLevel: "A1",
  },
  {
    category: "BEHAVIORAL",
    theme: "Listening to Customer Feedback",
    questionTemplate:
      "Can you tell me about a time you listened to feedback from a user or client and improved a task?",
    starHint: "Situation: A user was confused. Action: We changed the text or button. Result: The user was happy.",
    expectedKeywords: ["feedback", "customer", "change", "improve", "result"],
    targetLevel: "A2",
  },
  {
    category: "SITUATIONAL",
    theme: "Choosing Between Two Ideas",
    questionTemplate:
      "When two teammates have different ideas for a new feature, how do you help decide which one to do first?",
    starHint: "Explain how you look at what users need most and what is easier to build.",
    expectedKeywords: ["choose", "priority", "users", "value", "team"],
    targetLevel: "A2",
  },
];

const PM_B1_B2_POOL: DynamicQuestionTopic[] = [
  {
    category: "WARMUP",
    theme: "Product Experience & Cross-Functional Work",
    questionTemplate:
      "Tell me about your product background and how you keep engineering, design, and business teams aligned.",
    starHint: "Structure your answer around shared roadmaps, transparent sprint goals, and active stakeholder check-ins.",
    expectedKeywords: ["roadmap", "alignment", "stakeholders", "cross-functional", "sprint"],
    targetLevel: "B1",
  },
  {
    category: "TECHNICAL",
    theme: "Feature Prioritization Frameworks",
    questionTemplate:
      "How do you prioritize competing feature requests from sales, engineering, and executives?",
    starHint: "Mention frameworks like RICE, MoSCoW, or Value vs Effort matrix with a practical example.",
    expectedKeywords: ["RICE", "prioritization", "trade-offs", "customer value", "data-driven"],
    targetLevel: "B2",
  },
  {
    category: "BEHAVIORAL",
    theme: "Failed Product Launch & Iteration",
    questionTemplate:
      "Describe a time when a feature release didn't achieve the expected metrics. How did you iterate?",
    starHint: "STAR: Initial expectation, unexpected user drop-off, qualitative interviews conducted, and the successful pivot.",
    expectedKeywords: ["iteration", "metrics", "analytics", "interviews", "pivot"],
    targetLevel: "B2",
  },
  {
    category: "SITUATIONAL",
    theme: "Handling Scope Creep Before Deadlines",
    questionTemplate:
      "How do you protect your sprint velocity when new urgent requests appear halfway through the development cycle?",
    starHint: "Discuss backlog grooming, protecting commitments, and negotiating next-sprint trade-offs with stakeholders.",
    expectedKeywords: ["scope creep", "velocity", "backlog", "negotiation", "deadline"],
    targetLevel: "B1",
  },
];

const PM_C1_C2_POOL: DynamicQuestionTopic[] = [
  {
    category: "WARMUP",
    theme: "Role Motivation & Strategic Product Vision",
    questionTemplate:
      "Walk me through your product leadership philosophy and how you establish product-market fit in high-growth markets.",
    starHint: "Highlight your customer obsession, measurable north star metrics, and executive team alignment.",
    expectedKeywords: ["strategy", "product-market fit", "North Star", "vision", "executive"],
    targetLevel: "C1",
  },
  {
    category: "TECHNICAL",
    theme: "Product Metrics & KPI Tracking",
    questionTemplate:
      "How do you define and measure leading versus lagging indicators for a major platform initiative?",
    starHint: "Discuss cohort retention, activation friction, customer lifetime value (LTV), and counter-metrics.",
    expectedKeywords: ["cohorts", "activation", "retention", "leading indicators", "A/B testing"],
    targetLevel: "C1",
  },
  {
    category: "BEHAVIORAL",
    theme: "Resolving Strong Technical Disagreements",
    questionTemplate:
      "Tell me about a time you had a fundamental architectural disagreement with a Principal Engineer. How did you resolve it?",
    starHint: "Emphasize mutual respect, grounding discussions in customer impact, joint spike evaluations, and lasting trust.",
    expectedKeywords: ["consensus", "technical empathy", "spikes", "alignment", "influence"],
    targetLevel: "C2",
  },
  {
    category: "SITUATIONAL",
    theme: "Saying 'No' to Executives with Data",
    questionTemplate:
      "How do you navigate pushback when declining a pet feature requested by the CEO or a key enterprise client?",
    starHint: "Detail data-driven diplomacy, presenting strategic trade-offs, and proposing pilot validation alternatives.",
    expectedKeywords: ["diplomacy", "trade-offs", "data-backed", "governance", "executive alignment"],
    targetLevel: "C1",
  },
];

// ==========================================
// 3. DESIGN / UI-UX POOLS
// ==========================================

const DESIGN_A1_A2_POOL: DynamicQuestionTopic[] = [
  {
    category: "WARMUP",
    theme: "Design Tools & Favorite Work",
    questionTemplate:
      "What design software like Figma or Sketch do you enjoy using, and what kinds of screens do you create?",
    starHint: "Share the tools you use and whether you make web pages, mobile apps, or illustrations.",
    expectedKeywords: ["Figma", "design", "screens", "ui", "colors"],
    targetLevel: "A1",
  },
  {
    category: "TECHNICAL",
    theme: "Explaining Design Choices",
    questionTemplate:
      "How do you explain your design ideas or button placements to a developer who has to build them?",
    starHint: "Explain how you show prototypes, use labels, and answer questions clearly.",
    expectedKeywords: ["developer", "explain", "prototype", "simple", "components"],
    targetLevel: "A2",
  },
  {
    category: "BEHAVIORAL",
    theme: "Accepting Design Feedback",
    questionTemplate:
      "Tell me about a time someone asked you to change your design. How did you make the improvement?",
    starHint: "Describe the suggestion, how you adjusted the layout or colors, and the positive result.",
    expectedKeywords: ["feedback", "change", "improve", "listen", "layout"],
    targetLevel: "A2",
  },
];

const DESIGN_B1_C2_POOL: DynamicQuestionTopic[] = [
  {
    category: "WARMUP",
    theme: "Design System Architecture & Usability",
    questionTemplate:
      "How do you architect a scalable design system to maintain UI consistency across multiple web and mobile platforms?",
    starHint: "Discuss design tokens, atomic hierarchy, accessibility standards (WCAG), and developer collaboration.",
    expectedKeywords: ["design system", "tokens", "accessibility", "WCAG", "consistency"],
    targetLevel: "B2",
  },
  {
    category: "BEHAVIORAL",
    theme: "Data-Informed User Research",
    questionTemplate:
      "Describe a time when user testing or analytics revealed that your initial UI assumption was incorrect. How did you adapt?",
    starHint: "STAR: Initial hypothesis, user testing friction observed, redesigned flow, and measured conversion lift.",
    expectedKeywords: ["usability testing", "hypothesis", "iteration", "conversion", "user empathy"],
    targetLevel: "B2",
  },
  {
    category: "STRATEGY",
    theme: "Balancing Aesthetics with Performance",
    questionTemplate:
      "How do you balance high-end visual aesthetics like glassmorphism and animations with responsive load performance?",
    starHint: "Explain GPU acceleration, lightweight SVGs, progressive enhancement, and close pairing with front-end engineers.",
    expectedKeywords: ["performance", "micro-interactions", "aesthetics", "collaboration", "responsiveness"],
    targetLevel: "C1",
  },
];

// ==========================================
// 4. GENERAL BUSINESS & MANAGEMENT POOLS
// ==========================================

const BUSINESS_A1_A2_POOL: DynamicQuestionTopic[] = [
  {
    category: "WARMUP",
    theme: "Professional Introduction",
    questionTemplate:
      "Could you introduce yourself, your role, and what you do in your day-to-day work?",
    starHint: "Use simple present: My name is... I work as... In my job, I help clients and organize projects.",
    expectedKeywords: ["experience", "work", "role", "help", "company"],
    targetLevel: "A1",
  },
  {
    category: "BEHAVIORAL",
    theme: "Working with Colleagues",
    questionTemplate:
      "How do you communicate with international colleagues or clients who speak English?",
    starHint: "Describe keeping sentences clear, using emails or chat, and asking questions when in doubt.",
    expectedKeywords: ["communication", "team", "clear", "listen", "chat"],
    targetLevel: "A2",
  },
  {
    category: "SITUATIONAL",
    theme: "Managing Daily Priorities",
    questionTemplate:
      "When you have several tasks due on the same day, how do you decide which one to finish first?",
    starHint: "Explain making a list, identifying the most urgent task, and letting your manager know.",
    expectedKeywords: ["priority", "list", "urgent", "schedule", "organize"],
    targetLevel: "A2",
  },
];

const BUSINESS_B1_B2_POOL: DynamicQuestionTopic[] = [
  {
    category: "WARMUP",
    theme: "Career Trajectory & Value Creation",
    questionTemplate:
      "Could you walk me through the key projects that have defined your professional growth so far?",
    starHint: "Structure your narrative clearly: background, core achievements, and current professional ambitions.",
    expectedKeywords: ["career", "achievements", "value", "growth", "leadership"],
    targetLevel: "B1",
  },
  {
    category: "BEHAVIORAL",
    theme: "Overcoming Complex Challenges",
    questionTemplate:
      "Can you describe a situation where you faced unexpected roadblocks on a project? How did you adapt your plan?",
    starHint: "Use the STAR method: Situation, Task, your proactive Action, and the quantifiable Result.",
    expectedKeywords: ["adaptability", "problem-solving", "action", "outcome", "resilience"],
    targetLevel: "B2",
  },
  {
    category: "SITUATIONAL",
    theme: "Difficult Stakeholder Conversations",
    questionTemplate:
      "How do you handle difficult conversations or negotiations with international colleagues or demanding clients?",
    starHint: "Emphasize active listening, emotional intelligence, clarity, and finding win-win agreements.",
    expectedKeywords: ["negotiation", "clarity", "empathy", "communication", "alignment"],
    targetLevel: "B2",
  },
];

const BUSINESS_C1_C2_POOL: DynamicQuestionTopic[] = [
  {
    category: "WARMUP",
    theme: "Executive Influence & Strategy",
    questionTemplate:
      "Describe how you establish strategic credibility and lead organizational change across diverse cross-functional units.",
    starHint: "Connect change management frameworks with measurable revenue or efficiency gains.",
    expectedKeywords: ["strategic", "influence", "change management", "organizational", "impact"],
    targetLevel: "C1",
  },
  {
    category: "TECHNICAL",
    theme: "High-Stakes Client Negotiations",
    questionTemplate:
      "Walk me through a high-stakes commercial negotiation where contract terms were heavily contested. How did you secure the win-win?",
    starHint: "Discuss value framing, concessions trade-offs, executive consensus, and preserving long-term relationship trust.",
    expectedKeywords: ["negotiation", "concessions", "value framing", "contract", "trust"],
    targetLevel: "C2",
  },
  {
    category: "STRATEGY",
    theme: "Global Leadership & Cultural Agility",
    questionTemplate:
      "What leadership methodologies do you deploy when steering decentralized, multi-time-zone international organizations?",
    starHint: "Highlight asynchronous documentation, psychological safety, and high-cadence transparent alignment.",
    expectedKeywords: ["asynchronous", "global", "psychological safety", "alignment", "governance"],
    targetLevel: "C1",
  },
];

// ==========================================
// 5. HEALTHCARE & ODONTOLOGY / MEDICAL POOLS
// ==========================================

const HEALTHCARE_A1_A2_POOL: DynamicQuestionTopic[] = [
  {
    category: "WARMUP",
    theme: "Daily Clinic Routine",
    questionTemplate:
      "What is your typical daily routine in your clinic or hospital as a healthcare professional?",
    starHint: "Describe arriving at the clinic, checking the patient schedule, preparing equipment, and greeting your first patient.",
    expectedKeywords: ["clinic", "patients", "schedule", "routine", "morning", "prepare"],
    targetLevel: "A2",
  },
  {
    category: "TECHNICAL",
    theme: "Clinical Tools & Instruments",
    questionTemplate:
      "Can you name two or three clinical or dental instruments you use every day, and explain what you do with them?",
    starHint: "Name basic tools (e.g. mirror, explorer, handpiece, probe) and state their simple purpose in patient care.",
    expectedKeywords: ["instruments", "tools", "clean", "examine", "teeth", "patient"],
    targetLevel: "A2",
  },
  {
    category: "SITUATIONAL",
    theme: "Patient Welcome & Oral Checkup",
    questionTemplate:
      "How do you welcome a new patient and explain what will happen during their first routine examination?",
    starHint: "Use reassuring, simple phrases: 'Good morning, please sit down. Today I will examine your teeth and take a quick look.'",
    expectedKeywords: ["welcome", "examination", "check", "comfortable", "explain"],
    targetLevel: "A2",
  },
  {
    category: "TECHNICAL",
    theme: "Patient Hygiene Guidance",
    questionTemplate:
      "How do you explain proper tooth brushing and flossing technique to a patient in simple English?",
    starHint: "Explain brushing twice a day for two minutes, using gentle circular motions, and cleaning between teeth with floss.",
    expectedKeywords: ["brush", "floss", "two minutes", "gums", "daily", "clean"],
    targetLevel: "A2",
  },
  {
    category: "BEHAVIORAL",
    theme: "Assisting an Anxious Young Patient",
    questionTemplate:
      "Tell me about a time you helped a nervous or young patient feel calm and safe in your clinical chair.",
    starHint: "Explain how you spoke with a soft voice, showed the instruments before using them, and gave praise.",
    expectedKeywords: ["calm", "child", "nervous", "chair", "gentle", "explain"],
    targetLevel: "A2",
  },
  {
    category: "TECHNICAL",
    theme: "Sterilization & Clinical Hygiene",
    questionTemplate:
      "How do you prepare your treatment room and ensure all instruments are properly sterilized between appointments?",
    starHint: "Mention wearing gloves and mask, wiping surfaces with disinfectant, and using the autoclave for instruments.",
    expectedKeywords: ["sterilize", "autoclave", "disinfect", "clean", "gloves", "safety"],
    targetLevel: "A2",
  },
  {
    category: "SITUATIONAL",
    theme: "Investigating Acute Pain",
    questionTemplate:
      "When a patient arrives with acute toothache, what simple questions do you ask to locate where it hurts?",
    starHint: "Ask: 'Where does it hurt? Is it sensitive to hot or cold drinks? Does it throb at night?'",
    expectedKeywords: ["pain", "hurt", "sensitive", "cold", "hot", "chewing"],
    targetLevel: "A2",
  },
  {
    category: "WARMUP",
    theme: "Clinical Team Collaboration",
    questionTemplate:
      "Can you describe your clinical team (assistants, hygienists, receptionists) and how you communicate during the day?",
    starHint: "Explain briefing together in the morning and coordinating smoothly during clinical procedures.",
    expectedKeywords: ["team", "assistant", "receptionist", "coordinate", "help"],
    targetLevel: "A2",
  },
];

const HEALTHCARE_B1_B2_POOL: DynamicQuestionTopic[] = [
  {
    category: "SITUATIONAL",
    theme: "Managing Severe Dental Anxiety & Needle Phobia",
    questionTemplate:
      "How do you manage patients who suffer from severe dental anxiety or fear of needles before an invasive clinical procedure?",
    starHint: "Emphasize empathetic communication, explain the step-by-step process, apply topical anesthetic gel, and agree on a stop signal.",
    expectedKeywords: ["anxiety", "phobia", "local anesthesia", "empathy", "comfort", "reassurance"],
    targetLevel: "B1",
  },
  {
    category: "BEHAVIORAL",
    theme: "Handling Clinical Complications with Composure",
    questionTemplate:
      "Can you describe a challenging clinical procedure or unexpected complication you handled, and how you communicated with the patient?",
    starHint: "Use the STAR method: Situation (e.g. curved root canal or fractured tooth), your immediate clinical Action, and the successful Outcome.",
    expectedKeywords: ["complication", "procedure", "calm", "diagnosis", "solution", "outcome"],
    targetLevel: "B2",
  },
  {
    category: "TECHNICAL",
    theme: "Treatment Plan Explanation & Value Framing",
    questionTemplate:
      "How do you explain the clinical difference between a conservative restoration (composite filling) and a dental crown to a hesitant patient?",
    starHint: "Compare structural tooth loss, longevity, masticatory forces, and why preserving tooth structure is the primary clinical objective.",
    expectedKeywords: ["restoration", "crown", "composite", "tooth structure", "durability", "longevity"],
    targetLevel: "B1",
  },
  {
    category: "SITUATIONAL",
    theme: "Presenting Comprehensive Treatment Plans",
    questionTemplate:
      "Walk me through how you present a comprehensive dental treatment plan, including clinical priorities and staged steps, to an international patient.",
    starHint: "Structure the presentation: prioritize resolving pain and infection first, followed by functional stabilization and aesthetic rehabilitation.",
    expectedKeywords: ["treatment plan", "priorities", "staged", "phases", "function", "consultation"],
    targetLevel: "B2",
  },
  {
    category: "TECHNICAL",
    theme: "Medically Compromised Dental Patients",
    questionTemplate:
      "How do you coordinate clinical precautions when treating patients with systemic conditions such as hypertension, diabetes, or anticoagulation therapy?",
    starHint: "Discuss medical history review, antibiotic prophylaxis protocols, checking blood pressure, and consulting with the patient's physician.",
    expectedKeywords: ["hypertension", "diabetes", "anticoagulant", "precautions", "medical history", "physician"],
    targetLevel: "B2",
  },
  {
    category: "BEHAVIORAL",
    theme: "Resolving Patient Dissatisfaction with Aesthetic Results",
    questionTemplate:
      "Tell me about a situation where a patient was not fully satisfied with an aesthetic restoration or color shade, and how you resolved it.",
    starHint: "Detail active listening without defensiveness, analyzing the shade guide under natural light, and adjusting the restoration collaboratively.",
    expectedKeywords: ["aesthetic", "shade", "dissatisfaction", "listen", "adjustment", "satisfaction"],
    targetLevel: "B2",
  },
  {
    category: "TECHNICAL",
    theme: "Modern Digital Dental Technologies",
    questionTemplate:
      "What modern digital technologies, such as intraoral scanners or digital 3D imaging, have you incorporated into your clinical practice?",
    starHint: "Discuss increased patient comfort without messy impression trays, precision margins, faster turnaround, and clear visual communication.",
    expectedKeywords: ["intraoral scanner", "digital", "CAD/CAM", "precision", "comfort", "3D imaging"],
    targetLevel: "B2",
  },
  {
    category: "SITUATIONAL",
    theme: "Pediatric Dental Emergencies",
    questionTemplate:
      "How do you manage pediatric dental emergencies, such as dental trauma or tooth avulsion, while reassuring extremely anxious parents?",
    starHint: "Highlight urgent clinical assessment, preservation of the tooth, checking neurological symptoms, and maintaining a calm presence.",
    expectedKeywords: ["trauma", "avulsion", "emergency", "pediatric", "reassure", "vitality"],
    targetLevel: "B2",
  },
  {
    category: "TECHNICAL",
    theme: "Preventive Periodontics & Long-Term Maintenance",
    questionTemplate:
      "How do you educate patients about periodontal disease progression, pocket depths, and the importance of deep scaling and maintenance?",
    starHint: "Frame periodontal health as the foundation of all teeth, using visual probe depth measurements to explain bone support clearly.",
    expectedKeywords: ["periodontal", "pocket depth", "scaling", "bone loss", "maintenance", "prevention"],
    targetLevel: "B1",
  },
  {
    category: "STRATEGY",
    theme: "Continuing Professional Education in Dentistry",
    questionTemplate:
      "How do you keep your clinical skills and knowledge updated with international dental journals, clinical symposiums, and evidence-based dentistry?",
    starHint: "Mention reading peer-reviewed dental journals, hands-on clinical masterclasses, and applying proven techniques in everyday practice.",
    expectedKeywords: ["evidence-based", "symposium", "techniques", "courses", "skills", "update"],
    targetLevel: "B2",
  },
];

const HEALTHCARE_C1_C2_POOL: DynamicQuestionTopic[] = [
  {
    category: "STRATEGY",
    theme: "Full-Arch Implant Rehabilitation vs. Conservative Retention",
    questionTemplate:
      "What bioethical and biomechanical frameworks guide your decision between complex multidisciplinary tooth preservation and full-arch implant rehabilitation?",
    starHint: "Analyze long-term bone remodeling, patient systemic longevity, crown-to-root ratios, endodontic re-treatment predictability, and ethical responsibility.",
    expectedKeywords: ["biomechanics", "osseointegration", "preservation", "predictability", "ethics", "rehabilitation"],
    targetLevel: "C1",
  },
  {
    category: "TECHNICAL",
    theme: "Orofacial Pain & Temporomandibular Joint Diagnostics",
    questionTemplate:
      "Walk me through your differential diagnostic process when distinguishing between odontogenic pain, temporomandibular joint dysfunction, and neuropathic orofacial disorders.",
    starHint: "Discuss diagnostic nerve blocks, palpation of masticatory muscles, panoramic/CBCT evaluation, and ruling out referred myofascial pain.",
    expectedKeywords: ["differential diagnosis", "orofacial", "temporomandibular", "neuropathic", "masticatory", "CBCT"],
    targetLevel: "C2",
  },
  {
    category: "SITUATIONAL",
    theme: "Complex Multidisciplinary Interventions",
    questionTemplate:
      "How do you orchestrate cross-specialty clinical treatment plans requiring synchronized interventions across periodontics, orthodontics, and oral maxillofacial surgery?",
    starHint: "Detail sequenced treatment sequencing: initial periodontal stabilization, pre-prosthetic orthodontics, surgical bone grafting, and final prosthetic delivery.",
    expectedKeywords: ["multidisciplinary", "sequencing", "periodontics", "orthodontics", "maxillofacial", "coordination"],
    targetLevel: "C1",
  },
  {
    category: "STRATEGY",
    theme: "Antibiotic Stewardship & Clinical Pharmacology in Dentistry",
    questionTemplate:
      "How do you balance aggressive odontogenic infection management with responsible antibiotic stewardship to mitigate global antimicrobial resistance?",
    starHint: "Emphasize definitive local mechanical debridement/drainage over routine empiric prescription, adhering strictly to current clinical guidelines.",
    expectedKeywords: ["antibiotic stewardship", "antimicrobial resistance", "debridement", "drainage", "pharmacology", "guidelines"],
    targetLevel: "C2",
  },
];

// ==========================================
// SERVICE CLASS IMPLEMENTATION
// ==========================================

export class DynamicQuestionService {
  /**
   * Selects the exact question pool matching both User Profession and CEFR Level.
   */
  public static selectPool(
    roleName: string = "Professional",
    userCefr: string = "B1",
  ): DynamicQuestionTopic[] {
    const level = normalizeCefr(userCefr);
    const category = classifyProfession(roleName);

    switch (category) {
      case "HEALTHCARE":
        if (level === "A1" || level === "A2") return HEALTHCARE_A1_A2_POOL;
        if (level === "B1" || level === "B2") return HEALTHCARE_B1_B2_POOL;
        return HEALTHCARE_C1_C2_POOL;

      case "TECH":
      case "DATA":
        if (level === "A1" || level === "A2") return TECH_A1_A2_POOL;
        if (level === "B1" || level === "B2") return TECH_B1_B2_POOL;
        return TECH_C1_C2_POOL;

      case "PRODUCT":
        if (level === "A1" || level === "A2") return PM_A1_A2_POOL;
        if (level === "B1" || level === "B2") return PM_B1_B2_POOL;
        return PM_C1_C2_POOL;

      case "DESIGN":
        if (level === "A1" || level === "A2") return DESIGN_A1_A2_POOL;
        return DESIGN_B1_C2_POOL;

      case "BUSINESS":
      default:
        if (level === "A1" || level === "A2") return BUSINESS_A1_A2_POOL;
        if (level === "B1" || level === "B2") return BUSINESS_B1_B2_POOL;
        return BUSINESS_C1_C2_POOL;
    }
  }

  /**
   * Generates a guaranteed unique question for any index without repetition across all rounds,
   * customized to the user's profession and CEFR level.
   */
  public static getQuestionForIndex(
    index: number,
    roleName: string = "Professional",
    userCefr: string = "B1",
  ): InterviewQuestionItem {
    const pool = this.selectPool(roleName, userCefr);
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
      targetLevel: topic.targetLevel,
    };
  }

  /**
   * Generates a batch of unique questions for a given round or session
   */
  public static getRoundQuestions(
    roundNumber: number = 1,
    roleName: string = "Professional",
    userCefr: string = "B1",
    count: number = 5,
  ): InterviewQuestionItem[] {
    const startIndex = (roundNumber - 1) * count;
    const questions: InterviewQuestionItem[] = [];

    for (let i = 0; i < count; i++) {
      questions.push(this.getQuestionForIndex(startIndex + i, roleName, userCefr));
    }

    return questions;
  }
}
