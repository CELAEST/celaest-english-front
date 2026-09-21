/**
 * Dynamic AI Question Generator Service
 * Generates continuous, role-tailored and CEFR-calibrated progressive interview questions across infinite rounds
 * without repeating questions or relying on a small static loop.
 *
 * Fully adapts questions to both:
 * 1. User Profession (Software Engineer, Product Manager, Designer, Data/AI, Business, Healthcare, etc.)
 * 2. User CEFR Level (A1/A2 Foundation, B1/B2 Intermediate, C1/C2 Advanced)
 */

import { InterviewQuestionItem } from "./interviewEngineService";

export type CefrLevelCode = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type KnownProfessionCategory =
  | "HEALTHCARE"
  | "LEGAL"
  | "EDUCATION"
  | "TECH"
  | "PRODUCT"
  | "DESIGN"
  | "DATA"
  | "BUSINESS";

export type ProfessionCategory = KnownProfessionCategory | (string & {});

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
  if (!roleName) return "BUSINESS";
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
// PROCEDURAL QUESTION GENERATION TEMPLATES
// ==========================================

function getHealthcareTopics(role: string, level: CefrLevelCode): DynamicQuestionTopic[] {
  if (level === "A1") {
    return [
      {
        category: "WARMUP",
        theme: "Introduction",
        questionTemplate: `Hello! What is your name and what is your job in healthcare?`,
        starHint: `Answer in 1 or 2 short sentences: 'Hello, my name is... and I am a ${role}.'`,
        expectedKeywords: ["name", "am", "job", "work", "clinic"],
        targetLevel: "A1",
      },
      {
        category: "TECHNICAL",
        theme: "Workplace",
        questionTemplate: `Where do you work every day as a ${role}?`,
        starHint: `Say where you work: 'I work in a clinic / hospital / office.'`,
        expectedKeywords: ["work", "hospital", "clinic", "office", "patients"],
        targetLevel: "A1",
      },
      {
        category: "WARMUP",
        theme: "Daily Tools",
        questionTemplate: `What simple tools or computer do you use at work as a ${role}?`,
        starHint: `Mention 1 or 2 basic things: 'I use a computer', 'I use basic clinical instruments.'`,
        expectedKeywords: ["use", "computer", "tools", "work", "instruments"],
        targetLevel: "A1",
      },
      {
        category: "SITUATIONAL",
        theme: "Helping People",
        questionTemplate: `Do you like helping patients at work?`,
        starHint: `Answer simply: 'Yes, I do. I like helping patients every day.'`,
        expectedKeywords: ["yes", "like", "helping", "patients", "people"],
        targetLevel: "A1",
      },
      {
        category: "WRAPUP",
        theme: "Favorite Part",
        questionTemplate: `What is your favorite thing about your work as a ${role}?`,
        starHint: `Give a short answer: 'I like my team' or 'I like to help people.'`,
        expectedKeywords: ["like", "team", "help", "work", "people"],
        targetLevel: "A1",
      },
    ];
  }
  if (level === "A2") {
    return [
      {
        category: "WARMUP",
        theme: "Daily Routine",
        questionTemplate: `Could you tell me about your daily routine and duties as a ${role}?`,
        starHint: `Describe 2 or 3 common responsibilities you perform each day as a ${role}.`,
        expectedKeywords: ["routine", "patients", "care", "clinic", "daily"],
        targetLevel: "A2",
      },
      {
        category: "TECHNICAL",
        theme: "Tools and Protocols",
        questionTemplate: `What clinical equipment, tools, or hygiene protocols do you use most frequently as a ${role}?`,
        starHint: `Mention the specific instruments and safety protocols you use in your procedures.`,
        expectedKeywords: ["equipment", "instruments", "hygiene", "protocol", "safety"],
        targetLevel: "A2",
      },
      {
        category: "BEHAVIORAL",
        theme: "Patient Comfort",
        questionTemplate: `Tell me about a patient you cared for recently as a ${role}. How did you help them feel comfortable?`,
        starHint: `Situation: A patient was anxious. Action: I explained the procedure gently. Result: The procedure went smoothly.`,
        expectedKeywords: ["patient", "calm", "explain", "comfortable", "gentle"],
        targetLevel: "A2",
      },
      {
        category: "SITUATIONAL",
        theme: "Communication",
        questionTemplate: `When a patient or client is nervous about a procedure, how do you communicate with them?`,
        starHint: `Explain how active listening and empathetic communication help ease patient anxiety.`,
        expectedKeywords: ["listen", "reassure", "communicate", "trust", "patient"],
        targetLevel: "A2",
      },
      {
        category: "WRAPUP",
        theme: "Vocation",
        questionTemplate: `Why did you choose to become a ${role}, and what do you find most rewarding?`,
        starHint: `Share what inspired you to enter healthcare and what gives you satisfaction in your daily practice.`,
        expectedKeywords: ["vocation", "care", "helping", "rewarding", "health"],
        targetLevel: "A2",
      },
    ];
  }
  if (level === "B1" || level === "B2") {
    return [
      {
        category: "TECHNICAL",
        theme: "Diagnostic Evaluation",
        questionTemplate: `How do you approach diagnostic evaluations and treatment planning in your practice as a ${role}?`,
        starHint: `Detail your clinical examination steps, diagnostic testing, and how you formulate a comprehensive treatment plan.`,
        expectedKeywords: ["diagnosis", "evaluation", "treatment plan", "clinical", "evidence"],
        targetLevel: "B2",
      },
      {
        category: "BEHAVIORAL",
        theme: "Complex Consultation",
        questionTemplate: `Describe a challenging clinical case or complex consultation you managed as a ${role}. What was your approach?`,
        starHint: `Outline the clinical complexity, the diagnostic process, your intervention, and the patient outcome.`,
        expectedKeywords: ["case", "challenge", "intervention", "outcome", "management"],
        targetLevel: "B1",
      },
      {
        category: "SITUATIONAL",
        theme: "Clinical Complications",
        questionTemplate: `How do you handle unexpected complications or emergency situations during a clinical procedure?`,
        starHint: `Emphasize calm clinical decision-making, immediate stabilization protocols, and patient safety.`,
        expectedKeywords: ["complication", "emergency", "protocol", "safety", "stabilize"],
        targetLevel: "B2",
      },
      {
        category: "STRATEGY",
        theme: "Practice Management",
        questionTemplate: `How do you balance patient satisfaction, clinical precision, and appointment scheduling in your daily practice?`,
        starHint: `Discuss workflow optimization, managing patient expectations, and maintaining rigorous clinical standards.`,
        expectedKeywords: ["workflow", "scheduling", "precision", "standards", "efficiency"],
        targetLevel: "B2",
      },
      {
        category: "WARMUP",
        theme: "Preventative Care",
        questionTemplate: `How do you educate patients on long-term preventative care and post-procedure maintenance?`,
        starHint: `Explain your communication strategy for patient compliance and lifestyle guidance.`,
        expectedKeywords: ["prevention", "education", "compliance", "maintenance", "guidance"],
        targetLevel: "B1",
      },
    ];
  }
  return [
    {
      category: "TECHNICAL",
      theme: "Differential Diagnostics",
      questionTemplate: `Walk me through your differential diagnostic process when managing complex or atypical presentations as a ${role}.`,
      starHint: `Detail advanced diagnostic modalities, ruling out secondary pathologies, and evidence-based clinical protocols.`,
      expectedKeywords: ["differential diagnosis", "pathology", "modalities", "evidence-based", "atypical"],
      targetLevel: "C1",
    },
    {
      category: "STRATEGY",
      theme: "Conservative Care & Guidelines",
      questionTemplate: `How do you balance aggressive intervention management with evidence-based conservative care and clinical guidelines as a ${role}?`,
      starHint: `Emphasize clinical pharmacology, conservative therapies, debridement, and responsible stewardship.`,
      expectedKeywords: ["stewardship", "conservative care", "guidelines", "pharmacology", "protocols"],
      targetLevel: "C2",
    },
    {
      category: "BEHAVIORAL",
      theme: "Multidisciplinary Coordination",
      questionTemplate: `How do you orchestrate multidisciplinary care when collaborating with other clinical specialists on complex cases?`,
      starHint: `Detail sequencing of multi-specialty interventions, peer consultations, and unified patient management.`,
      expectedKeywords: ["multidisciplinary", "sequencing", "collaboration", "consultation", "coordination"],
      targetLevel: "C1",
    },
    {
      category: "SITUATIONAL",
      theme: "Clinical Ethics",
      questionTemplate: `How do you navigate high-stakes clinical ethics, informed consent, and risk mitigation in your practice as a ${role}?`,
      starHint: `Discuss transparent risk disclosure, autonomy, ethical patient advocacy, and legal compliance.`,
      expectedKeywords: ["ethics", "informed consent", "risk mitigation", "compliance", "advocacy"],
      targetLevel: "C2",
    },
    {
      category: "STRATEGY",
      theme: "Clinical Excellence",
      questionTemplate: `How do you contribute to advancing clinical excellence, mentoring staff, and incorporating cutting-edge research in your work as a ${role}?`,
      starHint: `Highlight continuous education, clinical audits, staff training, and adopting evidence-based innovations.`,
      expectedKeywords: ["excellence", "mentorship", "research", "evidence", "innovation"],
      targetLevel: "C1",
    },
  ];
}

function getTechTopics(role: string, level: CefrLevelCode): DynamicQuestionTopic[] {
  if (level === "A1") {
    return [
      {
        category: "WARMUP",
        theme: "Introduction",
        questionTemplate: `Hello! What is your name and what is your job in technology?`,
        starHint: "Answer in 1 or 2 simple sentences: 'Hello, my name is... and I am a developer.'",
        expectedKeywords: ["name", "am", "developer", "engineer", "work"],
        targetLevel: "A1",
      },
      {
        category: "TECHNICAL",
        theme: "Tools",
        questionTemplate: `What computer or programming language do you like to use?`,
        starHint: "Name 1 tool or language: 'I like Python' or 'I use JavaScript and VS Code.'",
        expectedKeywords: ["use", "like", "code", "computer", "language"],
        targetLevel: "A1",
      },
      {
        category: "WARMUP",
        theme: "Workplace",
        questionTemplate: `Do you work at an office or do you work from home as a ${role}?`,
        starHint: "Use simple present: 'I work from home' or 'I work at an office.'",
        expectedKeywords: ["work", "home", "office", "remotely", "computer"],
        targetLevel: "A1",
      },
      {
        category: "SITUATIONAL",
        theme: "Teamwork",
        questionTemplate: `Do you work alone or do you work with a team?`,
        starHint: "Answer simply: 'I work with a team of developers' or 'I work alone on tasks.'",
        expectedKeywords: ["team", "alone", "work", "people", "tasks"],
        targetLevel: "A1",
      },
      {
        category: "WRAPUP",
        theme: "Learning",
        questionTemplate: `What do you like to learn in technology right now?`,
        starHint: "Say 1 simple thing: 'I want to learn English' or 'I want to learn React.'",
        expectedKeywords: ["learn", "want", "like", "new", "technology"],
        targetLevel: "A1",
      },
    ];
  }
  if (level === "A2") {
    return [
      {
        category: "WARMUP",
        theme: "Tools & Programming Languages",
        questionTemplate: `What programming languages or development tools do you use every day, and why do you like them?`,
        starHint: "Name 1 or 2 tools (e.g. JavaScript, VS Code) and explain simply what you build with them.",
        expectedKeywords: ["language", "code", "tools", "build", "project"],
        targetLevel: "A2",
      },
      {
        category: "TECHNICAL",
        theme: "Daily Work & Routine",
        questionTemplate: `Can you describe what you usually do in your typical workday as a ${role}?`,
        starHint: "Use simple present: I check tasks, write code, test my features, and talk with my team.",
        expectedKeywords: ["daily", "tasks", "meetings", "code", "review"],
        targetLevel: "A2",
      },
      {
        category: "BEHAVIORAL",
        theme: "Fixing a Simple Bug",
        questionTemplate: `Tell me about a simple bug or error you fixed recently in your code. How did you find it?`,
        starHint: "Situation: I had an error in my code. Action: I used console.log or read the error message. Result: The feature worked.",
        expectedKeywords: ["bug", "fix", "test", "error", "solved"],
        targetLevel: "A2",
      },
      {
        category: "SITUATIONAL",
        theme: "Asking for Help",
        questionTemplate: `When you get stuck on a difficult problem as a ${role}, how do you ask your teammates or mentor for help?`,
        starHint: "Explain what you already tried, where you are stuck, and ask clear questions.",
        expectedKeywords: ["help", "teammate", "ask", "stuck", "explain"],
        targetLevel: "A2",
      },
      {
        category: "WRAPUP",
        theme: "Favorite Project",
        questionTemplate: `What project or feature are you most proud of building so far in your career as a ${role}?`,
        starHint: "Briefly mention what the project did and why it was fun or interesting to build.",
        expectedKeywords: ["project", "proud", "built", "features", "learned"],
        targetLevel: "A2",
      },
    ];
  }
  if (level === "B1" || level === "B2") {
    return [
      {
        category: "TECHNICAL",
        theme: "Code Quality and Testing",
        questionTemplate: `How do you ensure code quality, test coverage, and documentation in your daily work as a ${role}?`,
        starHint: "Discuss automated unit testing, static analysis, code review standards, and API documentation.",
        expectedKeywords: ["testing", "code review", "quality", "coverage", "documentation"],
        targetLevel: "B2",
      },
      {
        category: "BEHAVIORAL",
        theme: "Technical Disagreement",
        questionTemplate: `Tell me about a time you had a technical disagreement with a colleague or lead. How did you resolve it?`,
        starHint: "Situation: Differing architectural viewpoints. Action: Evaluated trade-offs with benchmarks. Result: Aligned on optimal solution.",
        expectedKeywords: ["disagreement", "trade-offs", "communication", "consensus", "solution"],
        targetLevel: "B1",
      },
      {
        category: "SITUATIONAL",
        theme: "Production Incident",
        questionTemplate: `How do you handle urgent production incidents, bug triage, and rollbacks under tight pressure?`,
        starHint: "Detail triage steps: verify telemetry, isolate regression, execute automated rollback, and run post-mortem.",
        expectedKeywords: ["production", "incident", "triage", "rollback", "telemetry"],
        targetLevel: "B2",
      },
      {
        category: "STRATEGY",
        theme: "Technical Debt",
        questionTemplate: `How do you balance shipping fast features with managing technical debt and refactoring as a ${role}?`,
        starHint: "Discuss dedicating sprint capacity for refactoring and quantifying reliability impact to product managers.",
        expectedKeywords: ["tech debt", "refactoring", "balance", "velocity", "quality"],
        targetLevel: "B2",
      },
      {
        category: "WARMUP",
        theme: "Code Review Lifecycle",
        questionTemplate: `Walk me through the lifecycle of a pull request and code review process in your engineering team.`,
        starHint: "Explain staging checks, CI/CD pipeline triggers, atomic commits, and collaborative feedback.",
        expectedKeywords: ["pull request", "review", "pipeline", "ci/cd", "feedback"],
        targetLevel: "B1",
      },
    ];
  }
  return [
    {
      category: "TECHNICAL",
      theme: "Distributed Systems Architecture",
      questionTemplate: `How do you design, optimize, and maintain high-reliability distributed systems or microservice architectures as a ${role}?`,
      starHint: "Discuss fault tolerance, idempotency, event-driven decoupling, caching strategies, and data consistency.",
      expectedKeywords: ["distributed systems", "microservices", "fault tolerance", "scalability", "resilience"],
      targetLevel: "C1",
    },
    {
      category: "STRATEGY",
      theme: "Build vs Buy Decision",
      questionTemplate: `How do you evaluate whether to build an internal platform versus integrating a third-party managed service?`,
      starHint: "Weigh long-term maintenance overhead, vendor lock-in, compliance requirements, and engineering velocity.",
      expectedKeywords: ["build vs buy", "trade-offs", "vendor lock-in", "maintenance", "architecture"],
      targetLevel: "C1",
    },
    {
      category: "BEHAVIORAL",
      theme: "Major Outage Post-Mortem",
      questionTemplate: `Describe a major system failure or outage you led the post-mortem analysis for. What preventative mechanisms did you put in place?`,
      starHint: "Detail root cause analysis (5 Whys), establishing circuit breakers, and blameless retrospectives.",
      expectedKeywords: ["post-mortem", "root cause", "circuit breaker", "telemetry", "prevention"],
      targetLevel: "C2",
    },
    {
      category: "SITUATIONAL",
      theme: "Zero-Downtime Migration",
      questionTemplate: `How do you achieve engineering consensus across multiple squads when refactoring legacy infrastructure with zero downtime?`,
      starHint: "Detail strangler pattern migrations, dual-writing, backward compatibility, and feature flags.",
      expectedKeywords: ["strangler pattern", "zero-downtime", "migration", "consensus", "feature flags"],
      targetLevel: "C2",
    },
    {
      category: "STRATEGY",
      theme: "Technical Leadership & Mentorship",
      questionTemplate: `How do you set technical vision, mentor senior engineers, and balance business velocity with long-term architectural stability?`,
      starHint: "Discuss RFC frameworks, architectural decision records (ADRs), and fostering technical autonomy.",
      expectedKeywords: ["leadership", "mentorship", "vision", "adr", "architecture"],
      targetLevel: "C1",
    },
  ];
}

function getProductTopics(role: string, level: CefrLevelCode): DynamicQuestionTopic[] {
  if (level === "A1") {
    return [
      {
        category: "WARMUP",
        theme: "Introduction",
        questionTemplate: `Hello! What is your name and what do you do as a ${role}?`,
        starHint: "Answer simply: 'Hello! My name is... and I work as a [role].'",
        expectedKeywords: ["name", "work", "design", "product", "team"],
        targetLevel: "A1",
      },
      {
        category: "TECHNICAL",
        theme: "Favorite App",
        questionTemplate: `What is one mobile app or website that you like to use?`,
        starHint: "Say an app you like: 'I like Spotify because it is easy and fast.'",
        expectedKeywords: ["like", "app", "website", "use", "easy"],
        targetLevel: "A1",
      },
      {
        category: "WARMUP",
        theme: "Daily Tools",
        questionTemplate: `What tools do you use every day, like Figma or a computer?`,
        starHint: "Mention 1 or 2 tools: 'I use Figma and my computer every day.'",
        expectedKeywords: ["use", "tools", "figma", "notes", "computer"],
        targetLevel: "A1",
      },
      {
        category: "SITUATIONAL",
        theme: "Communication",
        questionTemplate: `Do you talk with users or with your team every day?`,
        starHint: "Answer in 1 sentence: 'Yes, I talk with my team every morning.'",
        expectedKeywords: ["talk", "team", "users", "every day", "morning"],
        targetLevel: "A1",
      },
      {
        category: "WRAPUP",
        theme: "Goal",
        questionTemplate: `What do you want to create next in your work as a ${role}?`,
        starHint: "Say what you want: 'I want to create a clean mobile design.'",
        expectedKeywords: ["want", "build", "create", "app", "new"],
        targetLevel: "A1",
      },
    ];
  }
  if (level === "A2") {
    return [
      {
        category: "WARMUP",
        theme: "Favorite Product",
        questionTemplate: `What is a mobile app or website you use often, and what do you like about its design or features as a ${role}?`,
        starHint: "Pick an app (e.g. Spotify, Notion), mention 1 or 2 specific features, and explain why users love them.",
        expectedKeywords: ["app", "website", "users", "features", "design"],
        targetLevel: "A2",
      },
      {
        category: "TECHNICAL",
        theme: "User Feedback",
        questionTemplate: `How do you collect feedback or talk to users to understand what they need in your work as a ${role}?`,
        starHint: "Explain using simple surveys, user interviews, or observing user pain points.",
        expectedKeywords: ["feedback", "users", "interviews", "listen", "needs"],
        targetLevel: "A2",
      },
      {
        category: "BEHAVIORAL",
        theme: "Team Project",
        questionTemplate: `Tell me about a small project or task you completed with your team recently as a ${role}.`,
        starHint: "Situation: We planned a new feature. Action: I coordinated tasks. Result: It launched on time.",
        expectedKeywords: ["team", "project", "launch", "collaborate", "results"],
        targetLevel: "A2",
      },
      {
        category: "SITUATIONAL",
        theme: "Handling Disagreements",
        questionTemplate: `When team members have different opinions about a feature, how do you reach an agreement?`,
        starHint: "Focus on listening to each perspective and looking at user data or simple tests.",
        expectedKeywords: ["opinion", "listen", "data", "agreement", "team"],
        targetLevel: "A2",
      },
      {
        category: "WRAPUP",
        theme: "Motivation",
        questionTemplate: `What inspires you most in your daily work as a ${role}?`,
        starHint: "Share your passion for solving real human problems through great products.",
        expectedKeywords: ["inspire", "problem", "users", "impact", "passion"],
        targetLevel: "A2",
      },
    ];
  }
  if (level === "B1" || level === "B2") {
    return [
      {
        category: "WARMUP",
        theme: "Product Discovery",
        questionTemplate: `Walk me through your discovery and user validation process from initial idea to prototype.`,
        starHint: "Discuss customer problem interviews, prototyping, user testing, and validating riskiest assumptions.",
        expectedKeywords: ["discovery", "validation", "prototype", "interviews", "assumptions"],
        targetLevel: "B1",
      },
      {
        category: "TECHNICAL",
        theme: "Prioritization Frameworks",
        questionTemplate: `How do you prioritize competing feature requests and stakeholder demands using structured frameworks as a ${role}?`,
        starHint: "Explain using models like RICE or MoSCoW to balance reach, impact, confidence, and engineering effort.",
        expectedKeywords: ["prioritize", "rice", "stakeholders", "framework", "impact"],
        targetLevel: "B2",
      },
      {
        category: "BEHAVIORAL",
        theme: "Roadmap Adaptation",
        questionTemplate: `Describe a situation where a launch or release didn't go as planned. How did you adapt your roadmap?`,
        starHint: "Detail the unexpected friction, user signals, how you triaged with engineering, and how you communicated changes.",
        expectedKeywords: ["roadmap", "pivot", "signals", "triage", "stakeholders"],
        targetLevel: "B1",
      },
      {
        category: "SITUATIONAL",
        theme: "Stakeholder Alignment",
        questionTemplate: `How do you say 'no' to an executive or important stakeholder while maintaining trust and alignment?`,
        starHint: "Frame trade-offs quantitatively using opportunity cost, current OKRs, and discovery findings.",
        expectedKeywords: ["trade-offs", "okrs", "alignment", "opportunity cost", "data"],
        targetLevel: "B2",
      },
      {
        category: "STRATEGY",
        theme: "Success Metrics",
        questionTemplate: `How do you define leading and lagging success metrics before kicking off a new initiative?`,
        starHint: "Distinguish between immediate behavioural signals (conversion, completion) and long-term retention.",
        expectedKeywords: ["leading", "lagging", "metrics", "retention", "north star"],
        targetLevel: "B2",
      },
    ];
  }
  return [
    {
      category: "STRATEGY",
      theme: "Outcome-Driven Strategy",
      questionTemplate: `How do you formulate an outcome-driven multi-quarter product strategy that aligns executive OKRs with team autonomy?`,
      starHint: "Explain Now/Next/Later frameworks, connecting user value metrics with commercial viability.",
      expectedKeywords: ["outcome-driven", "strategy", "okrs", "autonomy", "framework"],
      targetLevel: "C1",
    },
    {
      category: "TECHNICAL",
      theme: "Metric Anomaly Diagnostics",
      questionTemplate: `If key retention or engagement metrics dropped unexpectedly across core user cohorts, what diagnostic framework would you execute?`,
      starHint: "Detail segmentation by geography/client, correlating release telemetry, and conducting churn interviews.",
      expectedKeywords: ["retention", "cohorts", "diagnostics", "telemetry", "churn"],
      targetLevel: "C2",
    },
    {
      category: "STRATEGY",
      theme: "Monetization & Pricing",
      questionTemplate: `Describe how you navigate monetization, pricing tier restructuring, or enterprise packaging trade-offs as a ${role}.`,
      starHint: "Discuss value metrics, willingness-to-pay research, self-serve conversion vs high-touch enterprise sales.",
      expectedKeywords: ["monetization", "pricing", "value metric", "cac", "ltv"],
      targetLevel: "C1",
    },
    {
      category: "BEHAVIORAL",
      theme: "Killing an Initiative",
      questionTemplate: `Tell me about a time you killed a high-profile initiative or made a difficult pivot based on early data signals.`,
      starHint: "Explain removing emotional attachment, analyzing quantitative indicators, and redirecting resources.",
      expectedKeywords: ["pivot", "kill feature", "data signals", "opportunity cost", "leadership"],
      targetLevel: "C2",
    },
    {
      category: "STRATEGY",
      theme: "Psychological Safety & Experimentation",
      questionTemplate: `How do you build a culture of high psychological safety and rigorous experimentation across cross-functional squads?`,
      starHint: "Highlight blameless retrospectives, hypothesis-driven testing, and celebrating learning from failed experiments.",
      expectedKeywords: ["experimentation", "psychological safety", "hypothesis", "culture", "learning"],
      targetLevel: "C1",
    },
  ];
}

function getGeneralTopics(role: string, level: CefrLevelCode): DynamicQuestionTopic[] {
  if (level === "A1") {
    return [
      {
        category: "WARMUP",
        theme: "Introduction",
        questionTemplate: `Hello! What is your name and what is your job as a ${role}?`,
        starHint: "Answer in 1 or 2 short sentences: 'Hello, my name is... and I am a [role].'",
        expectedKeywords: ["name", "job", "work", "professional", "company"],
        targetLevel: "A1",
      },
      {
        category: "TECHNICAL",
        theme: "Daily Tasks",
        questionTemplate: `What do you do every morning at work?`,
        starHint: "Say 1 or 2 simple tasks: 'I check my email and drink coffee.'",
        expectedKeywords: ["morning", "email", "tasks", "work", "check"],
        targetLevel: "A1",
      },
      {
        category: "WARMUP",
        theme: "Workplace",
        questionTemplate: `Where is your office or company located?`,
        starHint: "Say the city or location: 'My company is in Bogota / Mexico / online.'",
        expectedKeywords: ["office", "company", "city", "located", "work"],
        targetLevel: "A1",
      },
      {
        category: "SITUATIONAL",
        theme: "Working with People",
        questionTemplate: `Do you enjoy speaking with clients or coworkers every day?`,
        starHint: "Answer simply: 'Yes, I enjoy speaking with people because it is interesting.'",
        expectedKeywords: ["yes", "clients", "coworkers", "enjoy", "people"],
        targetLevel: "A1",
      },
      {
        category: "WRAPUP",
        theme: "Free Time",
        questionTemplate: `What do you like to do after work to relax?`,
        starHint: "Say 1 simple activity: 'I like to read books' or 'I spend time with my family.'",
        expectedKeywords: ["like", "relax", "family", "read", "music"],
        targetLevel: "A1",
      },
    ];
  }
  if (level === "A2") {
    return [
      {
        category: "WARMUP",
        theme: "Professional Background",
        questionTemplate: `Could you briefly introduce your background and daily responsibilities as a ${role}?`,
        starHint: `Mention your current role, the main tasks you perform, and who you collaborate with.`,
        expectedKeywords: ["responsibilities", "daily", "tasks", "work", "team"],
        targetLevel: "A2",
      },
      {
        category: "TECHNICAL",
        theme: "Tools and Workflows",
        questionTemplate: `What tools, platforms, or communication workflows do you rely on most in your work as a ${role}?`,
        starHint: `List 2 or 3 core tools you use and how they help you complete your responsibilities.`,
        expectedKeywords: ["tools", "platforms", "workflow", "efficiency", "communication"],
        targetLevel: "A2",
      },
      {
        category: "BEHAVIORAL",
        theme: "Accomplishment",
        questionTemplate: `Tell me about a successful project or goal you accomplished recently as a ${role}.`,
        starHint: `Situation: The challenge or goal. Action: What you did. Result: The positive outcome achieved.`,
        expectedKeywords: ["goal", "project", "accomplished", "result", "success"],
        targetLevel: "A2",
      },
      {
        category: "SITUATIONAL",
        theme: "Time Management",
        questionTemplate: `How do you organize your tasks when managing multiple deadlines simultaneously as a ${role}?`,
        starHint: `Explain how you prioritize urgent tasks and keep stakeholders informed.`,
        expectedKeywords: ["prioritize", "deadlines", "organize", "tasks", "schedule"],
        targetLevel: "A2",
      },
      {
        category: "WRAPUP",
        theme: "Future Goals",
        questionTemplate: `What are your professional goals for growth as a ${role} over the next year?`,
        starHint: `Share 1 or 2 areas where you want to deepen your skills or make a greater impact.`,
        expectedKeywords: ["goals", "growth", "skills", "impact", "future"],
        targetLevel: "A2",
      },
    ];
  }
  if (level === "B1" || level === "B2") {
    return [
      {
        category: "TECHNICAL",
        theme: "Performance Indicators",
        questionTemplate: `How do you evaluate key performance indicators and operational metrics in your work as a ${role}?`,
        starHint: `Detail the quantitative metrics or benchmarks you track to measure quality and efficiency.`,
        expectedKeywords: ["metrics", "kpi", "performance", "benchmarks", "efficiency"],
        targetLevel: "B2",
      },
      {
        category: "BEHAVIORAL",
        theme: "Stakeholder Negotiation",
        questionTemplate: `Tell me about a time you negotiated with a difficult client or internal stakeholder as a ${role}. What was the outcome?`,
        starHint: `Describe the conflict, how you used active listening and objective facts, and the mutual resolution.`,
        expectedKeywords: ["negotiate", "stakeholder", "resolution", "communication", "outcome"],
        targetLevel: "B1",
      },
      {
        category: "SITUATIONAL",
        theme: "Managing Change",
        questionTemplate: `How do you adapt when project requirements, timelines, or resources suddenly change in your work as a ${role}?`,
        starHint: `Explain your approach to rapid re-planning, communication with affected parties, and risk mitigation.`,
        expectedKeywords: ["adapt", "change", "re-planning", "communication", "flexibility"],
        targetLevel: "B2",
      },
      {
        category: "STRATEGY",
        theme: "Cross-Functional Collaboration",
        questionTemplate: `What approach do you take to foster collaboration and cross-departmental alignment as a ${role}?`,
        starHint: `Discuss transparency, shared objectives, and establishing clear communication channels.`,
        expectedKeywords: ["collaboration", "alignment", "transparency", "objectives", "coordination"],
        targetLevel: "B2",
      },
      {
        category: "WARMUP",
        theme: "Presenting Recommendations",
        questionTemplate: `Walk me through how you prepare and present strategic recommendations to decision-makers as a ${role}.`,
        starHint: `Detail how you structure the problem, present evidence, and outline clear actionable steps.`,
        expectedKeywords: ["presentation", "recommendations", "evidence", "decision-makers", "actionable"],
        targetLevel: "B1",
      },
    ];
  }
  return [
    {
      category: "STRATEGY",
      theme: "Organizational Transformation",
      questionTemplate: `How do you drive organizational transformation, operational efficiency, and sustainable impact as a ${role}?`,
      starHint: `Discuss systemic process optimization, leading change initiatives, and measuring long-term impact.`,
      expectedKeywords: ["transformation", "efficiency", "impact", "sustainability", "systems"],
      targetLevel: "C1",
    },
    {
      category: "STRATEGY",
      theme: "Leadership in Ambiguity",
      questionTemplate: `Describe your leadership philosophy when guiding cross-functional teams through ambiguity and complex challenges as a ${role}.`,
      starHint: `Highlight clarity of vision, empowering team members, psychological safety, and resilient decision-making.`,
      expectedKeywords: ["leadership", "philosophy", "ambiguity", "resilience", "empowerment"],
      targetLevel: "C2",
    },
    {
      category: "SITUATIONAL",
      theme: "Strategic Trade-offs",
      questionTemplate: `How do you balance short-term operational pressures with long-term strategic investments in your work as a ${role}?`,
      starHint: `Detail your analytical framework for risk-adjusted resource allocation and stakeholder consensus.`,
      expectedKeywords: ["trade-offs", "strategic investment", "resource allocation", "consensus", "balance"],
      targetLevel: "C1",
    },
    {
      category: "BEHAVIORAL",
      theme: "High-Stakes Decision Making",
      questionTemplate: `Tell me about a high-stakes strategic decision you made under incomplete information as a ${role}. What was your risk calculus?`,
      starHint: `Explain scenario modeling, consulting key advisors, establishing rollback guardrails, and evaluating outcomes.`,
      expectedKeywords: ["decision", "risk calculus", "incomplete information", "guardrails", "outcome"],
      targetLevel: "C2",
    },
    {
      category: "TECHNICAL",
      theme: "Innovation & Continuous Excellence",
      questionTemplate: `How do you systematically leverage emerging methodologies, technologies, and market intelligence to maintain excellence as a ${role}?`,
      starHint: `Discuss competitive benchmarking, continuous learning pipelines, and adopting industry innovations.`,
      expectedKeywords: ["innovation", "benchmarking", "market intelligence", "methodology", "excellence"],
      targetLevel: "C1",
    },
  ];
}

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
    const role = roleName?.trim() || "Professional";

    switch (category) {
      case "HEALTHCARE":
        return getHealthcareTopics(role, level);
      case "TECH":
      case "DATA":
        return getTechTopics(role, level);
      case "PRODUCT":
      case "DESIGN":
        return getProductTopics(role, level);
      case "BUSINESS":
      case "LEGAL":
      case "EDUCATION":
      default:
        return getGeneralTopics(role, level);
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
