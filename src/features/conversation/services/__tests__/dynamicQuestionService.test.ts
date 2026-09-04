import { describe, it, expect } from "vitest";
import {
  DynamicQuestionService,
  normalizeCefr,
  classifyProfession,
} from "../dynamicQuestionService";

describe("DynamicQuestionService - Profession and CEFR Level Adaptation", () => {
  describe("normalizeCefr", () => {
    it("normalizes common CEFR formats accurately", () => {
      expect(normalizeCefr("A1")).toBe("A1");
      expect(normalizeCefr("A1 — Beginner")).toBe("A1");
      expect(normalizeCefr("a2 - elementary")).toBe("A2");
      expect(normalizeCefr("B1")).toBe("B1");
      expect(normalizeCefr("b2 upper intermediate")).toBe("B2");
      expect(normalizeCefr("C1 Advanced")).toBe("C1");
      expect(normalizeCefr("c2 mastery")).toBe("C2");
      expect(normalizeCefr(undefined)).toBe("B1");
      expect(normalizeCefr("")).toBe("B1");
      expect(normalizeCefr("unknown")).toBe("B1");
    });
  });

  describe("classifyProfession", () => {
    it("correctly identifies tech roles", () => {
      expect(classifyProfession("Software Engineer")).toBe("TECH");
      expect(classifyProfession("Frontend Developer")).toBe("TECH");
      expect(classifyProfession("Backend Engineer")).toBe("TECH");
      expect(classifyProfession("Fullstack Dev")).toBe("TECH");
      expect(classifyProfession("DevOps Engineer")).toBe("TECH");
      expect(classifyProfession("QA Engineer")).toBe("TECH");
    });

    it("correctly identifies product roles", () => {
      expect(classifyProfession("Product Manager")).toBe("PRODUCT");
      expect(classifyProfession("Technical PM")).toBe("PRODUCT");
      expect(classifyProfession("Scrum Master")).toBe("PRODUCT");
      expect(classifyProfession("Product Owner")).toBe("PRODUCT");
    });

    it("correctly identifies design roles", () => {
      expect(classifyProfession("UI/UX Designer")).toBe("DESIGN");
      expect(classifyProfession("Product Designer")).toBe("PRODUCT"); // PM check first or Product Designer
      expect(classifyProfession("Graphic Designer")).toBe("DESIGN");
    });

    it("correctly identifies data roles", () => {
      expect(classifyProfession("Data Scientist")).toBe("DATA");
      expect(classifyProfession("Data Analyst")).toBe("DATA");
      expect(classifyProfession("Machine Learning Engineer")).toBe("DATA");
    });

    it("falls back to business for general roles", () => {
      expect(classifyProfession("Accountant")).toBe("BUSINESS");
      expect(classifyProfession("Marketing Specialist")).toBe("BUSINESS");
      expect(classifyProfession("Sales Executive")).toBe("BUSINESS");
      expect(classifyProfession("Executive Director")).toBe("BUSINESS");
    });
  });

  describe("getQuestionForIndex - Adaptive Questions", () => {
    it("returns accessible, beginner-friendly questions for A1/A2 software engineers", () => {
      const q = DynamicQuestionService.getQuestionForIndex(0, "Software Engineer", "A1");
      expect(q).toBeDefined();
      expect(q.targetLevel).toBe("A2");
      expect(q.question).toContain("What programming languages or development tools");
      // Must NOT contain intimidating C2 jargon
      expect(q.question.toLowerCase()).not.toContain("distributed system");
      expect(q.question.toLowerCase()).not.toContain("microservice");
      expect(q.question.toLowerCase()).not.toContain("race condition");
    });

    it("returns high-level architectural questions for C1/C2 software engineers", () => {
      const q = DynamicQuestionService.getQuestionForIndex(0, "Software Engineer", "C1");
      expect(q).toBeDefined();
      expect(q.targetLevel).toBe("C1");
      expect(q.question).toContain("distributed system");
    });

    it("returns customer-centric beginner questions for A1/A2 Product Managers", () => {
      const q = DynamicQuestionService.getQuestionForIndex(0, "Product Manager", "A2");
      expect(q).toBeDefined();
      expect(q.question).toContain("mobile app or website");
      expect(q.question.toLowerCase()).not.toContain("rice");
      expect(q.question.toLowerCase()).not.toContain("lagging indicators");
    });

    it("returns prioritization framework questions for B2 Product Managers", () => {
      const q = DynamicQuestionService.getQuestionForIndex(1, "Product Manager", "B2");
      expect(q).toBeDefined();
      expect(q.question).toContain("prioritize competing feature requests");
    });

    it("generates a continuous round batch with valid ids and rounds", () => {
      const batch = DynamicQuestionService.getRoundQuestions(1, "Software Engineer", "B1");
      expect(batch).toHaveLength(5);
      expect(batch[0].round).toBe(1);
      expect(batch[4].round).toBe(1);
      expect(batch[0].id).toBe(1);
      expect(batch[4].id).toBe(5);
    });

    it("handles round 2 indexing properly", () => {
      const batch = DynamicQuestionService.getRoundQuestions(2, "Software Engineer", "B1");
      expect(batch).toHaveLength(5);
      expect(batch[0].round).toBe(2);
      expect(batch[0].id).toBe(6);
    });
  });
});
