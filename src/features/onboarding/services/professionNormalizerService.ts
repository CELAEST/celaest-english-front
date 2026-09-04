/**
 * Service: ProfessionNormalizerService
 * Cleans, corrects typos, and normalizes user profession inputs into
 * professional English titles for personalized AI learning features.
 */

const COMMON_CORRECTIONS: Record<string, string> = {
  // Software / Tech
  "sofware": "Software",
  "softwar": "Software",
  "software": "Software",
  "enginer": "Engineer",
  "engineer": "Engineer",
  "ingineer": "Engineer",
  "ingeniero": "Engineer",
  "developer": "Developer",
  "dev": "Developer",
  "programer": "Programmer",
  "programmer": "Programmer",
  "fronted": "Frontend",
  "frontend": "Frontend Developer",
  "backend": "Backend Developer",
  "fullstack": "Full Stack Developer",
  "full-stack": "Full Stack Developer",
  "qa": "QA Engineer",
  "devops": "DevOps Engineer",
  "data scientist": "Data Scientist",
  "data analyst": "Data Analyst",
  "product manager": "Product Manager",
  "scrum master": "Scrum Master",

  // Design / Creative
  "desinger": "Designer",
  "designer": "Designer",
  "diseñador": "Designer",
  "ui/ux": "UI/UX Designer",
  "ux/ui": "UI/UX Designer",
  "architect": "Architect",
  "arquitecto": "Architect",

  // Medical / Healthcare
  "doctor": "Doctor",
  "medic": "Medical Doctor",
  "medico": "Medical Doctor",
  "médico": "Medical Doctor",
  "nurse": "Nurse",
  "enfermero": "Nurse",
  "enfermera": "Nurse",
  "dentist": "Dentist",
  "dentista": "Dentist",
  "odontologo": "Dentist",
  "odontólogo": "Dentist",
  "odontologa": "Dentist",
  "odontóloga": "Dentist",
  "odontologia": "Dentistry",
  "odontología": "Dentistry",
  "ortodoncista": "Orthodontist",
  "periodoncista": "Periodontist",
  "endodoncista": "Endodontist",
  "psicologist": "Psychologist",
  "psychologist": "Psychologist",
  "psicologo": "Psychologist",
  "psicólogo": "Psychologist",

  // Business / Management / Finance
  "accountant": "Accountant",
  "contable": "Accountant",
  "lawyer": "Lawyer",
  "abogado": "Lawyer",
  "marketing": "Marketing Specialist",
  "sales": "Sales Executive",
  "consultant": "Consultant",
  "manager": "Manager",
  "administrador": "Business Administrator",
  "administrator": "Business Administrator",

  // Education / Student
  "student": "Student",
  "estudiante": "Student",
  "teacher": "Teacher",
  "profesor": "Teacher",
};

export class ProfessionNormalizerService {
  /**
   * Normalizes and cleans a user-provided profession or specialty string.
   */
  public static normalize(rawInput: string): string {
    if (!rawInput || typeof rawInput !== "string") {
      return "Software & Technology";
    }

    let cleaned = rawInput.trim();
    if (!cleaned) return "Software & Technology";

    // Strip conversational prefixes in English & Spanish
    cleaned = cleaned.replace(/^(i am a|i'm a|i am an|i'm an|i work as a|i work as an|i work in|soy|trabajo como|trabajo en)\s+/i, "");
    cleaned = cleaned.trim();

    const lower = cleaned.toLowerCase();

    // Check direct dictionary match
    if (COMMON_CORRECTIONS[lower]) {
      return COMMON_CORRECTIONS[lower];
    }

    // Word-by-word correction for compound titles (e.g. "sofware enginer" -> "Software Engineer")
    const words = lower.split(/\s+/);
    const correctedWords = words.map((w) => {
      const cleanWord = w.replace(/[^a-zA-Z0-9/-]/g, "");
      if (COMMON_CORRECTIONS[cleanWord]) {
        return COMMON_CORRECTIONS[cleanWord];
      }
      // Capitalize first letter
      return w.charAt(0).toUpperCase() + w.slice(1);
    });

    const result = correctedWords.join(" ").trim();
    return result || "Software & Technology";
  }
}
