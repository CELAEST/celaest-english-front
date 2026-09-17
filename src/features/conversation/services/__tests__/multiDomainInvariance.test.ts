import { describe, it, expect } from "vitest";
import { ProfessionNormalizerService } from "../../../onboarding/services/professionNormalizerService";
import {
  classifyProfession,
  DynamicQuestionService,
} from "../dynamicQuestionService";
import { UniversalLinguisticParser } from "../universalLinguisticParser";
import { MasterAiFeedbackEngine } from "../masterAiFeedbackEngine";

describe("Multi-Domain Invariance & Anti-Hardcoded Gate", () => {
  describe("ProfessionNormalizerService", () => {
    it("never defaults empty or missing input to 'Software & Technology'", () => {
      expect(ProfessionNormalizerService.normalize("")).toBe("Professional");
      expect(ProfessionNormalizerService.normalize("   ")).toBe("Professional");
      // @ts-expect-error testing invalid input types
      expect(ProfessionNormalizerService.normalize(null)).toBe("Professional");
    });

    it("correctly normalizes diverse non-tech professions", () => {
      expect(ProfessionNormalizerService.normalize("odontologa")).toBe("Dentist");
      expect(ProfessionNormalizerService.normalize("abogado")).toBe("Lawyer");
      expect(ProfessionNormalizerService.normalize("medico")).toBe("Medical Doctor");
      expect(ProfessionNormalizerService.normalize("profesora")).toBe("Teacher");
      expect(ProfessionNormalizerService.normalize("biólogo marino")).toBe("Marine Biologist");
      expect(ProfessionNormalizerService.normalize("sumiller")).toBe("Sommelier");
      expect(ProfessionNormalizerService.normalize("arqueólogo")).toBe("Archaeologist");
      expect(ProfessionNormalizerService.normalize("apicultor")).toBe("Beekeeper");
      expect(ProfessionNormalizerService.normalize("astrofísico")).toBe("Astrophysicist");
      expect(ProfessionNormalizerService.normalize("carpintero")).toBe("Carpenter");
      expect(ProfessionNormalizerService.normalize("cocinero")).toBe("Chef");
    });

    it("normalizes professions asynchronously via normalizeAsync", async () => {
      const result = await ProfessionNormalizerService.normalizeAsync("carpintero");
      expect(result).toBe("Carpenter");

      const chef = await ProfessionNormalizerService.normalizeAsync("cocinero");
      expect(chef).toBe("Chef");

      const luthier = await ProfessionNormalizerService.normalizeAsync("luthier");
      expect(luthier).toBe("Luthier");
    });
  });

  describe("classifyProfession & DynamicQuestionService", () => {
    it("defaults empty roleName to 'BUSINESS' instead of 'TECH'", () => {
      expect(classifyProfession(undefined)).toBe("BUSINESS");
      expect(classifyProfession("")).toBe("BUSINESS");
    });

    it("never produces software engineering questions for non-tech professionals", () => {
      const nonTechRoles = [
        "Dentist",
        "Corporate Lawyer",
        "Pediatrician",
        "High School Teacher",
        "Marine Biologist",
        "Sommelier",
        "Archaeologist",
        "Beekeeper",
        "Astrophysicist",
      ];
      const bannedTerms = ["pull request", "code review", "ci/cd", "refactoring", "microservice", "tech debt"];

      for (const role of nonTechRoles) {
        for (let i = 0; i < 6; i++) {
          const q = DynamicQuestionService.getQuestionForIndex(i, role, "B2");
          const fullQuestionText = `${q.question} ${q.starHint} ${q.expectedKeywords.join(" ")}`.toLowerCase();

          for (const banned of bannedTerms) {
            expect(fullQuestionText).not.toContain(banned);
          }
        }
      }
    });
  });

  describe("UniversalLinguisticParser & Feedback Neutrality", () => {
    it("never injects 'Product Manager' hardcoded feedback into general discovery answers", () => {
      const currentQ = {
        id: 1,
        category: "BEHAVIORAL" as const,
        question: "Tell me about a time you consulted with users or clients.",
        starHint: "Focus on user needs.",
        expectedKeywords: ["discovery", "users", "needs"],
      };

      const result = UniversalLinguisticParser.parse(
        "I think it is waste of time to talk with the users before starting.",
        currentQ,
      );

      for (const err of result.unclearOrErrorWords) {
        expect(err.explanation.toLowerCase()).not.toContain("product manager");
        expect(err.translationSpanish.toLowerCase()).not.toContain("product manager");
      }
    });

    it("never mentions 'Product Manager' in MasterAiFeedbackEngine strategic advice", () => {
      const currentQ = {
        id: 2,
        category: "SITUATIONAL" as const,
        question: "How do you prioritize competing requests from multiple departments?",
        starHint: "Discuss prioritization criteria.",
        expectedKeywords: ["prioritize", "urgency", "impact"],
      };

      const result = MasterAiFeedbackEngine.evaluateTurn(
        "I just organize the requests in my calendar.",
        currentQ,
      );

      for (const err of result.unclearOrErrorWords) {
        expect(err.explanation.toLowerCase()).not.toContain("product manager");
      }
    });
  });
});
