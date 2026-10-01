import { ReadingArticle } from "../../../domain/entities/ReadingArticle";

/**
 * Universal High-Fidelity Seed Articles (0ms Instant Mount)
 *
 * Guarantees that upon opening the Reading Arena (even on cold mobile data / offline),
 * the user never experiences a blank skeleton or stalled network waterfall.
 *
 * Follows the CELAEST Multi-Domain Invariance standard:
 * - Neutral, highly engaging professional topics.
 * - Applicable across all professions (Healthcare, Law, Accounting, Engineering, Management, Design).
 * - Exact CEFR-calibrated syntax and vocabulary.
 */

const SEED_A1: ReadingArticle = {
  id: "seed-reading-a1-universal",
  title: "Daily Workplace Communication and Team Habits",
  category: "WORKPLACE",
  cefrLevel: "A1",
  readTimeMin: 2,
  excerpt: "Simple habits for organizing daily tasks, greeting colleagues, and building positive professional relationships.",
  content:
    "Good morning. Every workday begins with clear habits. When team members arrive, they greet each other with a warm smile. A simple greeting creates a friendly and productive workplace. " +
    "Before starting tasks, professionals check their daily schedule. Making a short list of priorities helps everyone stay focused. " +
    "During meetings, listening carefully is essential. When you do not understand something, it is always good to ask polite questions. Clear communication makes teamwork easier and helps every project succeed. " +
    "At the end of the day, reviewing what you finished gives a feeling of accomplishment. Preparing for tomorrow allows you to leave work with peace of mind.",
  keywords: ["habits", "priorities", "teamwork", "accomplishment", "communication"],
  phrasalVerbs: ["set up", "check in", "carry out"],
};

const SEED_A2: ReadingArticle = {
  id: "seed-reading-a2-universal",
  title: "Collaborating Across Workplace Teams",
  category: "COLLABORATION",
  cefrLevel: "A2",
  readTimeMin: 3,
  excerpt: "How active listening, clear updates, and shared goals help modern teams solve daily challenges together.",
  content:
    "Effective workplace collaboration relies on open communication and mutual respect. When professionals from different departments work together, each person brings unique experience to the table. " +
    "Regular coordination meetings help teams stay aligned on key milestones. Instead of sending lengthy messages, concise updates keep everyone informed without causing information overload. " +
    "Active listening is just as important as speaking clearly. Taking notes during discussions ensures that important details are not forgotten. When team members clarify expectations early, misunderstandings decrease dramatically. " +
    "Successful projects celebrate shared achievements. By supporting colleagues and providing constructive feedback, organizations build an environment where everyone can grow and achieve their professional potential.",
  keywords: ["collaboration", "aligned", "milestones", "constructive", "achievements"],
  phrasalVerbs: ["rely on", "bring in", "follow up"],
};

const SEED_B1: ReadingArticle = {
  id: "seed-reading-b1-universal",
  title: "Navigating Cross-Functional Communication in the Modern Workplace",
  category: "BUSINESS",
  cefrLevel: "B1",
  readTimeMin: 3,
  excerpt: "Effective collaboration across diverse departments requires clear terminology, structured documentation, and active listening.",
  content:
    "In today's interconnected professional environment, cross-functional collaboration is no longer optional; it is the cornerstone of organizational success. When departments work in silos, vital context gets lost, leading to duplicated effort and missed deadlines. " +
    "Bridging these gaps begins with establishing a shared vocabulary. Professionals often use specialized jargon that confuses colleagues from other fields. Taking the time to explain key metrics and methodologies ensures that every stakeholder understands project objectives. " +
    "Structured documentation plays an equally pivotal role. Comprehensive project summaries, accessible roadmaps, and documented decisions reduce reliance on ad-hoc meetings. When team members know where to find reliable information, decision-making accelerates. " +
    "Ultimately, cultivating an empathetic culture where questions are welcomed strengthens workplace relationships. By prioritizing clarity, consistency, and active engagement, teams transform complex challenges into shared accomplishments.",
  keywords: ["cornerstone", "silos", "pivotal", "methodologies", "empathetic"],
  phrasalVerbs: ["bridge over", "point out", "wrap up"],
};

const SEED_B2: ReadingArticle = {
  id: "seed-reading-b2-universal",
  title: "Strategic Alignment and Adaptive Decision-Making in Organizations",
  category: "STRATEGY",
  cefrLevel: "B2",
  readTimeMin: 4,
  excerpt: "Balancing organizational objectives with rapid market changes demands clear prioritization, stakeholder engagement, and structured consensus.",
  content:
    "Navigating strategic initiatives within modern organizations demands a delicate equilibrium between long-term vision and tactical agility. When unexpected market dynamics emerge, leaders must recalibrate their roadmaps without compromising core organizational principles. " +
    "A fundamental pillar of adaptive strategy is stakeholder alignment. When cross-disciplinary teams participate in early discovery phases, they develop psychological ownership over the outcome. This participatory approach dismantles resistance to change and uncovers potential bottlenecks before they escalate into systemic hurdles. " +
    "Moreover, rigorous qualitative and quantitative data analysis must underpin every strategic pivot. Rather than relying on intuition alone, resilient teams establish observable key performance indicators that guide continuous iteration. Transparency regarding trade-offs fosters mutual trust across executive leadership and frontline teams. " +
    "As modern organizations evolve, cultivating an agile mindset and reinforcing transparent accountability ensures sustainable, long-term impact in competitive global landscapes.",
  keywords: ["equilibrium", "recalibrate", "participatory", "bottlenecks", "accountability"],
  phrasalVerbs: ["stem from", "phase out", "drive forward"],
};

const SEED_C1: ReadingArticle = {
  id: "seed-reading-c1-universal",
  title: "Executive Presence, Organizational Architecture, and High-Impact Leadership",
  category: "LEADERSHIP",
  cefrLevel: "C1",
  readTimeMin: 4,
  excerpt: "Navigating complex corporate governance, orchestrating organizational transformation, and articulating visionary leadership with nuance.",
  content:
    "Sustained organizational stewardship in volatile macroeconomic environments necessitates an extraordinary degree of strategic foresight and nuanced executive presence. Leaders are increasingly tasked not merely with optimizing operational throughput, but with architecting resilient institutional cultures capable of continuous self-renewal. " +
    "Central to this paradigm is the deliberate orchestration of asynchronous decision frameworks. By codifying institutional knowledge and decentralizing operational governance, visionary organizations mitigate bureaucratic inertia while fostering high-velocity autonomy among specialized units. " +
    "Furthermore, authentic executive articulation demands bridging macroeconomic imperatives with human-centered empathy. When articulating transformative pivots, seasoned leaders frame disruptive changes not as existential threats, but as compelling catalysts for collective evolution. " +
    "In synthesis, exemplary leadership transcends superficial metrics; it embodies the disciplined cultivation of enduring organizational integrity, cognitive versatility, and high-impact cross-functional synergy.",
  keywords: ["stewardship", "foresight", "orchestration", "inertia", "versatility"],
  phrasalVerbs: ["draw upon", "scale back", "crystallize into"],
};

const SEED_REGISTRY: Record<string, ReadingArticle> = {
  A1: SEED_A1,
  A2: SEED_A2,
  B1: SEED_B1,
  B2: SEED_B2,
  C1: SEED_C1,
  C2: SEED_C1,
};

/**
 * Returns a high-fidelity universal seed article for 0ms cold-start rendering.
 */
export function getUniversalSeedArticle(level: string = "B1", profession?: string): ReadingArticle {
  const normLevel = (level || "B1").toUpperCase().trim();
  const base = SEED_REGISTRY[normLevel] || SEED_B1;

  if (!profession || profession.toLowerCase() === "professional" || profession.toLowerCase() === "general") {
    return { ...base };
  }

  // Soft tailoring: personalize profession tag without breaking linguistic neutrality
  return {
    ...base,
    id: `${base.id}-${profession.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    profession: profession.trim(),
  };
}
