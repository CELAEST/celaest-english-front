export interface DiagnosticQuestion {
  level: "A1-A2" | "B1-B2" | "C1-C2";
  levelBadge: string;
  question: string;
}

export const getDiagnosticQuestions = (
  profession?: string,
  baselineLevel: "A1" | "A2" | "B1" | "B2" = "B1"
): DiagnosticQuestion[] => {
  const role = profession && profession.trim() ? profession.trim() : null;

  if (baselineLevel === "A1") {
    return [
      {
        level: "A1-A2",
        levelBadge: "Level 1 • Gentle Welcome",
        question: role
          ? `Welcome! Let's start simple: what is your job as a ${role}, and where do you usually work?`
          : "Welcome! Let's start simple: what is your job, and where do you usually work?",
      },
      {
        level: "A1-A2",
        levelBadge: "Level 1 • Everyday Activities",
        question: role
          ? `Nice! What tools, equipment, or activities do you use or do every day as a ${role}?`
          : "Nice! What tools or activities do you use or do every day at work?",
      },
      {
        level: "B1-B2",
        levelBadge: "Level 2 • Personal Goals",
        question: role
          ? `Great! What is one thing in English you would like to practice most to help you as a ${role}?`
          : "Great! What is one thing in English you would like to practice most to help in your career?",
      },
    ];
  }

  if (baselineLevel === "A2") {
    return [
      {
        level: "A1-A2",
        levelBadge: "Level 1 • Routine & Tasks",
        question: role
          ? `Hello! Can you tell me what a typical day looks like in your work as a ${role}?`
          : "Hello! Can you tell me what a typical day looks like in your work?",
      },
      {
        level: "B1-B2",
        levelBadge: "Level 2 • Recent Experience",
        question: role
          ? `What was a specific task or project you worked on recently in your role as a ${role}?`
          : "What was a specific task or project you worked on recently?",
      },
      {
        level: "B1-B2",
        levelBadge: "Level 2 • Workplace Coordination",
        question: role
          ? `What is a common challenge you face in your job as a ${role}, and how do you handle it?`
          : "What is a common challenge you face in your job, and how do you handle it?",
      },
    ];
  }

  if (baselineLevel === "B2") {
    return [
      {
        level: "B1-B2",
        levelBadge: "Level 2 • Professional Execution",
        question: role
          ? `Welcome! As an experienced ${role}, how do you balance daily operational priorities with long-term quality?`
          : "Welcome! How do you balance daily operational priorities with long-term quality in your field?",
      },
      {
        level: "C1-C2",
        levelBadge: "Level 3 • Complex Problem Solving",
        question: role
          ? `Describe a complex or high-stakes challenge you resolved as a ${role}, and how you aligned different priorities to succeed.`
          : "Describe a complex or high-stakes challenge you resolved, and how you aligned different priorities to succeed.",
      },
      {
        level: "C1-C2",
        levelBadge: "Level 3 • Strategic Vision & Innovation",
        question: role
          ? `If you had the opportunity to lead a major transformation or innovation as a ${role}, what strategic changes would you champion and why?`
          : "If you had the opportunity to lead a major transformation or innovation in your field, what strategic changes would you champion and why?",
      },
    ];
  }

  // Default: B1 Working Fluency
  return [
    {
      level: "A1-A2",
      levelBadge: "Level 1 • Core Responsibilities",
      question: role
        ? `Tell me briefly about your role as a ${role} and the main responsibilities you handle.`
        : "Tell me briefly about your work role and the main responsibilities you handle.",
    },
    {
      level: "B1-B2",
      levelBadge: "Level 2 • Problem Solving & Teamwork",
      question: role
        ? `In your work as a ${role}, what was an unexpected challenge you faced and how did you resolve it?`
        : "Describe an unexpected challenge you encountered in your work and how you managed to resolve it.",
    },
    {
      level: "C1-C2",
      levelBadge: "Level 3 • Skill Evolution & Outlook",
      question: role
        ? `Looking ahead, what new skills or practices do you think will become essential in your field as a ${role}?`
        : "Looking ahead, what new skills or practices do you think will become essential in your field?",
    },
  ];
};
