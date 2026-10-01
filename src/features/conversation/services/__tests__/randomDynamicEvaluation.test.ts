import { describe, it, expect } from "vitest";
import { MasterAiFeedbackEngine } from "../masterAiFeedbackEngine";
import { InterviewQuestionItem } from "../interviewEngineService";

describe("Random Dynamic Evaluation & Non-Burned Feedback Quality Gate", () => {
  // Test 1: Medical Doctor / Pediatrician
  it("evaluates a Medical Doctor dynamically without leaking tech terminology", () => {
    const question: InterviewQuestionItem = {
      id: 101,
      category: "SITUATIONAL",
      question: "How do you handle an emergency case where a young patient is in critical distress?",
      starHint: "Describe immediate triage and clinical actions.",
      expectedKeywords: ["triage", "patient", "vital signs", "clinical"],
      targetLevel: "B1",
    };

    const spokenAnswer =
      "When an emergency happens, I am check the child immediately. We work for reduce the fever and looking how the patient reacts. If the symptoms are severe, we must to give IV fluids.";

    const result = MasterAiFeedbackEngine.evaluateTurn(spokenAnswer, question);

    // 1. Must catch specific ESL errors
    const errorWords = result.unclearOrErrorWords.map((e) => e.errorWord.toLowerCase());
    expect(errorWords.some((w) => w.includes("i am check"))).toBe(true);
    expect(errorWords.some((w) => w.includes("for reduce"))).toBe(true);
    expect(errorWords.some((w) => w.includes("looking how"))).toBe(true);
    expect(errorWords.some((w) => w.includes("must to"))).toBe(true);

    // 2. Multi-Domain Invariance: Zero software engineering leaks
    const model = result.improvedFullAnswer.toLowerCase();
    expect(model).not.toContain("microservice");
    expect(model).not.toContain("sprint");
    expect(model).not.toContain("pull request");
    expect(model).not.toContain("figma");
    expect(model).not.toContain("product manager");
    expect(model).not.toContain("auth0");

    // 3. Explanations in Spanish must be pedagogically clear
    for (const err of result.unclearOrErrorWords) {
      expect(err.explanation.length).toBeGreaterThan(15);
      expect(err.translationSpanish.length).toBeGreaterThan(5);
    }
  });

  // Test 2: Structural / Civil Engineer
  it("evaluates a Civil Engineer with realistic preposition and modal corrections", () => {
    const question: InterviewQuestionItem = {
      id: 202,
      category: "TECHNICAL",
      question: "Can you describe a situation where you had to evaluate structural integrity under severe weather conditions?",
      starHint: "Discuss safety standards and engineering diagnostics.",
      expectedKeywords: ["integrity", "load", "safety", "inspection"],
      targetLevel: "B2",
    };

    const spokenAnswer =
      "During the flood inspection, we evaluated the bridge foundation without loose stability. After make the stress tests, we realized that we focus in structural reinforcement, and we requested more personnels to secure the site.";

    const result = MasterAiFeedbackEngine.evaluateTurn(spokenAnswer, question);

    const errorWords = result.unclearOrErrorWords.map((e) => e.errorWord.toLowerCase());
    expect(errorWords.some((w) => w.includes("without loose"))).toBe(true);
    expect(errorWords.some((w) => w.includes("after make"))).toBe(true);
    expect(errorWords.some((w) => w.includes("focus in"))).toBe(true);
    expect(errorWords.some((w) => w.includes("personnels"))).toBe(true);

    // Check that corrected versions are standard English
    const correctWords = result.unclearOrErrorWords.map((e) => e.correctWord.toLowerCase());
    expect(correctWords.some((w) => w.includes("without losing"))).toBe(true);
    expect(correctWords.some((w) => w.includes("after making"))).toBe(true);
    expect(correctWords.some((w) => w.includes("focus on"))).toBe(true);
    expect(correctWords.some((w) => w.includes("personnel"))).toBe(true);
  });

  // Test 3: Executive Head Chef
  it("evaluates an Executive Chef, detecting casual fragment openings and repetition", () => {
    const question: InterviewQuestionItem = {
      id: 303,
      category: "WARMUP",
      question: "What tools and processes do you use in your daily workflow to keep the kitchen running smoothly?",
      starHint: "Mention equipment, prep systems, and staff coordination.",
      expectedKeywords: ["prep", "kitchen", "equipment", "coordination"],
      targetLevel: "B1",
    };

    const spokenAnswer =
      "A lot of things. At my restaurant, I use specialized knives every day. First of all, I use prep sheets to communicate with the kitchen staff, and we also use commercial ovens to cook the orders quickly. We work together for solve any food preparation delay.";

    const result = MasterAiFeedbackEngine.evaluateTurn(spokenAnswer, question);

    const errorWords = result.unclearOrErrorWords.map((e) => e.errorWord.toLowerCase());
    expect(errorWords.some((w) => w.includes("a lot of things"))).toBe(true);
    expect(errorWords.some((w) => w.includes("overuse of 'use'"))).toBe(true);
    expect(errorWords.some((w) => w.includes("for solve"))).toBe(true);

    // Improved answer should elevate vocabulary and eliminate fragment
    expect(result.improvedFullAnswer).not.toMatch(/^A lot of things\./i);
  });

  // Test 4: VP of Marketing (C1 Fluent - 0 Errors)
  it("evaluates a C1 Fluent executive without false positives or nitpicks", () => {
    const question: InterviewQuestionItem = {
      id: 404,
      category: "BEHAVIORAL",
      question: "How do you align multi-channel marketing campaigns with executive revenue targets?",
      starHint: "Discuss cross-functional collaboration and ROI measurement.",
      expectedKeywords: ["roi", "alignment", "revenue", "campaigns"],
      targetLevel: "C1",
    };

    const spokenAnswer =
      "I align our multi-channel marketing strategy by maintaining continuous cross-functional visibility with our executive committee. By tracking leading engagement metrics alongside downstream customer acquisition cost and customer lifetime value, my team ensures that every dollar allocated directly supports our quarterly revenue objectives.";

    const result = MasterAiFeedbackEngine.evaluateTurn(spokenAnswer, question);

    // Should detect zero errors for flawless speech
    expect(result.unclearOrErrorWords.length).toBe(0);
    expect(result.grammarScore).toBeGreaterThanOrEqual(88);
    expect(result.clarityScore).toBeGreaterThanOrEqual(88);
    expect(result.vocabularyScore).toBeGreaterThanOrEqual(85);
    expect(result.overallScore).toBeGreaterThanOrEqual(88);
    expect(result.keyStrengths.length).toBeGreaterThan(0);
  });

  // Test 5: User's exact mobile response #1 (KPI Evaluation)
  it("evaluates User Mobile KPI answer catching looking how, after make, and for improve", () => {
    const question: InterviewQuestionItem = {
      id: 505,
      category: "SITUATIONAL",
      question: "How do you evaluate key performance indicators and operational metrics in your work as a Professional?",
      starHint: "Discuss metrics, feedback loops, and continuous improvement.",
      expectedKeywords: ["kpi", "metrics", "feedback", "improve"],
      targetLevel: "B1",
    };

    const spokenAnswer =
      "I evaluate key performance indicators and operational metrics by checking the feedback from the software and looking how the users interact with the application. I usually analyze the number of bugs, the response time, and the errors that the users are reporting. Also, I test the software after make changes to see if everything is working correctly. If I find a problem, I report it to the development team and we work together for improve the software.";

    const result = MasterAiFeedbackEngine.evaluateTurn(spokenAnswer, question);

    const errorWords = result.unclearOrErrorWords.map((e) => e.errorWord.toLowerCase());
    expect(errorWords.some((w) => w.includes("looking how"))).toBe(true);
    expect(errorWords.some((w) => w.includes("after make"))).toBe(true);
    expect(errorWords.some((w) => w.includes("for improve"))).toBe(true);

    // Must have honest scoring reflecting 3 errors
    expect(result.grammarScore).toBeLessThanOrEqual(80);
    expect(result.grammarScore).toBeGreaterThanOrEqual(50);

    // Improved answer must polish these 3 areas
    expect(result.improvedFullAnswer.toLowerCase()).toContain("after making");
    expect(result.improvedFullAnswer.toLowerCase()).toContain("to improve");
  });

  // Test 6: User's exact mobile response #2 (Tools and Repetition)
  it("evaluates User Mobile Tools answer catching opening fragment and overuse of 'use'", () => {
    const question: InterviewQuestionItem = {
      id: 606,
      category: "WARMUP",
      question: "What tools do you use in your daily workflow?",
      starHint: "List tools and your collaboration methods.",
      expectedKeywords: ["tools", "workflow", "collaboration"],
      targetLevel: "B1",
    };

    const spokenAnswer =
      "A lot of things. At my job, I use many different tools every single day. First of all, I use Slack to communicate with my team because it allows us to send messages very quickly. We also use Visual Studio Code to write code, and we use GitHub to save and share our code with other people.";

    const result = MasterAiFeedbackEngine.evaluateTurn(spokenAnswer, question);

    const errorWords = result.unclearOrErrorWords.map((e) => e.errorWord.toLowerCase());
    expect(errorWords.some((w) => w.includes("a lot of things"))).toBe(true);
    expect(errorWords.some((w) => w.includes("overuse of 'use'"))).toBe(true);

    // The improved answer should elevate the opening fragment
    expect(result.improvedFullAnswer).not.toMatch(/^A lot of things\./i);
  });
});
