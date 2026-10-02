import { describe, it, expect } from "vitest";
import { MasterAiFeedbackEngine } from "../masterAiFeedbackEngine";
import { InterviewQuestionItem } from "../interviewEngineService";

describe("Beginner A1 Grammar Detection in MasterAiFeedbackEngine", () => {
  const dummyQuestion: InterviewQuestionItem = {
    id: 1,
    question: "How do you help a client in your job today?",
    category: "WARMUP",
    starHint: "Describe a basic daily customer scenario.",
    expectedKeywords: ["help", "client", "work"],
    targetLevel: "A1",
  };

  it("detects double verb error 'I am help' and preposition flaw 'to you how'", () => {
    const spoken = "I am help a client to you how I can help here";
    const result = MasterAiFeedbackEngine.evaluateTurn(spoken, dummyQuestion);

    expect(result.unclearOrErrorWords.length).toBeGreaterThanOrEqual(1);

    const amHelpError = result.unclearOrErrorWords.find((e) =>
      e.errorWord.toLowerCase().includes("i am help"),
    );
    expect(amHelpError).toBeDefined();
    expect(amHelpError?.correctWord).toContain("I help");
    expect(amHelpError?.explanation).toContain("Presente Simple");
    expect(amHelpError?.cefrLevel).toBe("A1");

    const tellToError = result.unclearOrErrorWords.find((e) =>
      e.errorWord.toLowerCase().includes("to you how"),
    );
    expect(tellToError).toBeDefined();
    expect(tellToError?.correctWord).toContain("explaining to you how");
  });

  it("detects 'I am work' and 'I am agree' as beginner double-verb errors", () => {
    const spoken = "In my office I am work every day and I am agree with my boss";
    const result = MasterAiFeedbackEngine.evaluateTurn(spoken, dummyQuestion);

    const errors = result.unclearOrErrorWords.map((e) => e.errorWord.toLowerCase());
    expect(errors.some((w) => w.includes("i am work"))).toBe(true);
  });

  it("detects 'after make', 'looking how', and 'for improve' in KPI response", () => {
    const kpiQuestion: InterviewQuestionItem = {
      id: 2,
      question: "How do you evaluate key performance indicators and operational metrics in your work as a Professional?",
      category: "TECHNICAL",
      starHint: "Metrics tracking",
      expectedKeywords: ["metrics", "kpi"],
      targetLevel: "B2",
    };
    const answer =
      "I evaluate key performance indicators and operational metrics by checking the feedback from the software and looking how the users interact with the application. I usually analyze the number of bugs, the response time, and the errors that the users are reporting. Also, I test the software after make changes to see if everything is working correctly. If I find a problem, I report it to the development team and we work together for improve the software.";

    const result = MasterAiFeedbackEngine.evaluateTurn(answer, kpiQuestion);

    const errorWords = result.unclearOrErrorWords.map((e) => e.errorWord.toLowerCase());
    expect(errorWords.some((w) => w.includes("after make"))).toBe(true);
    expect(errorWords.some((w) => w.includes("looking how"))).toBe(true);
    expect(errorWords.some((w) => w.includes("for improve"))).toBe(true);
  });

  it("detects 'A lot of things.' fragment and overuse of 'use' in tools response", () => {
    const toolsQuestion: InterviewQuestionItem = {
      id: 3,
      question: "What tools do you use daily in your job?",
      category: "TECHNICAL",
      starHint: "Daily stack",
      expectedKeywords: ["tools", "slack", "code"],
      targetLevel: "B1",
    };
    const answer =
      "A lot of things. At my job, I use many different tools every single day. First of all, I use Slack to communicate with my team because it allows us to send messages very quickly. We also use Visual Studio Code to write code, and we use GitHub to save and share our code with other people.";

    const result = MasterAiFeedbackEngine.evaluateTurn(answer, toolsQuestion);

    const errorWords = result.unclearOrErrorWords.map((e) => e.errorWord.toLowerCase());
    expect(errorWords.some((w) => w.includes("a lot of things"))).toBe(true);
    expect(errorWords.some((w) => w.includes("overuse of 'use'"))).toBe(true);
  });

  it("detects 'for drive', 'must to focus', 'in optimize', 'without loose', and 'personnels'", () => {
    const transformQuestion: InterviewQuestionItem = {
      id: 4,
      question: "How do you drive organizational transformation?",
      category: "STRATEGY",
      starHint: "Transformation strategy",
      expectedKeywords: ["transformation", "processes"],
      targetLevel: "B2",
    };
    const answer =
      "I consider that for drive organizational transformation, we must to focus in optimize our operative processes. Yesterday we implement a new software and it resulted very good for the team, because everyone worked hard for achieve the goals. Also, we need more personnels to manage the actual market demands without loose the quality";

    const result = MasterAiFeedbackEngine.evaluateTurn(answer, transformQuestion);

    const errorWords = result.unclearOrErrorWords.map((e) => e.errorWord.toLowerCase());
    expect(errorWords.some((w) => w.includes("for drive") || w.includes("for achieve"))).toBe(true);
    expect(errorWords.some((w) => w.includes("must to focus"))).toBe(true);
    expect(errorWords.some((w) => w.includes("focus in") || w.includes("in optimize"))).toBe(true);
    expect(errorWords.some((w) => w.includes("without loose") || w.includes("without lose"))).toBe(true);
    expect(errorWords.some((w) => w.includes("personnels"))).toBe(true);
  });

  it("detects all 5 distinct ESL errors in user's test sentence", () => {
    const question: InterviewQuestionItem = {
      id: 5,
      question: "Tell me about a challenging situation you faced recently.",
      category: "BEHAVIORAL",
      starHint: "STAR method",
      expectedKeywords: ["problem", "challenge"],
      targetLevel: "B1",
    };
    const answer =
      "Yesterday, I go to the store for buy some milk, but the supermarket was close and I can't bought nothing.";

    const result = MasterAiFeedbackEngine.evaluateTurn(answer, question);
    const errors = result.unclearOrErrorWords;

    expect(errors.length).toBeGreaterThanOrEqual(5);

    const corrWords = errors.map((e) => e.correctWord.toLowerCase());

    // 1. go -> went
    expect(corrWords.some((c) => c.includes("went"))).toBe(true);
    // 2. for buy -> to buy
    expect(corrWords.some((c) => c.includes("to buy"))).toBe(true);
    // 3. was close -> was closed
    expect(corrWords.some((c) => c.includes("was closed"))).toBe(true);
    // 4. can't bought -> couldn't buy
    expect(corrWords.some((c) => c.includes("couldn't buy"))).toBe(true);
    // 5. nothing -> anything
    expect(corrWords.some((c) => c.includes("anything"))).toBe(true);
  });
});
