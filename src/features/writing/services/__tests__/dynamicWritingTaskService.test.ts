import { describe, it, expect, beforeEach } from "vitest";
import { DynamicWritingTaskService } from "../dynamicWritingTaskService";

describe("DynamicWritingTaskService - Profession and CEFR Level Adaptation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("filterTasks", () => {
    it("returns accessible A1/A2 tasks with low word limits for beginner users", () => {
      const tasks = DynamicWritingTaskService.filterTasks("A1", "Software Engineer");
      expect(tasks.length).toBeGreaterThan(0);
      tasks.forEach((t) => {
        expect(["A1", "A2"]).toContain(t.level);
        expect(t.minWords).toBeLessThanOrEqual(35);
        expect(t.maxWords).toBeLessThanOrEqual(75);
      });
    });

    it("returns high-level tasks like RFCs and Post-Mortems for C1/C2 engineers", () => {
      const tasks = DynamicWritingTaskService.filterTasks("C1", "Software Engineer");
      expect(tasks.length).toBeGreaterThan(0);
      const hasRfcOrPostmortem = tasks.some(
        (t) => t.id.includes("rfc") || t.id.includes("postmortem") || t.id.includes("incident"),
      );
      expect(hasRfcOrPostmortem).toBe(true);
      tasks.forEach((t) => {
        expect(["B2", "C1", "C2"]).toContain(t.level);
      });
    });

    it("returns product management tasks for PMs", () => {
      const tasks = DynamicWritingTaskService.filterTasks("B1", "Product Manager");
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks.some((t) => t.roleCategory === "PRODUCT")).toBe(true);
    });
  });

  describe("getRandomTask & getNextTask", () => {
    it("returns a task matching user CEFR level", () => {
      const task = DynamicWritingTaskService.getRandomTask("A2", "Software Engineer");
      expect(["A1", "A2"]).toContain(task.level);
      expect(task.starterPhrases).toBeDefined();
      expect(task.starterPhrases!.length).toBeGreaterThan(0);
    });

    it("serves a different task when requested", () => {
      const task1 = DynamicWritingTaskService.getRandomTask("B1", "Software Engineer");
      const task2 = DynamicWritingTaskService.getNextTask(task1.id, "B1", "Software Engineer");
      expect(task2.id).not.toBe(task1.id);
    });

    it("persists draft correctly without throwing", () => {
      DynamicWritingTaskService.saveDraft("task-123", "Hello world draft");
      expect(DynamicWritingTaskService.loadDraft("task-123")).toBe("Hello world draft");
      expect(DynamicWritingTaskService.loadDraft("other-task")).toBe("");
      DynamicWritingTaskService.clearDraft();
      expect(DynamicWritingTaskService.loadDraft("task-123")).toBe("");
    });
  });
});
