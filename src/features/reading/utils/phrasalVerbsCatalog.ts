/**
 * Comprehensive Master Catalog of English Phrasal Verbs (A1 — C2)
 *
 * Contains all authentic idiomatic verb-particle combinations
 * including their irregular past, 3rd person singular, and gerund forms.
 * Used for deterministic O(1) detection in the Reading feature with 0 false positives.
 */

// Helper to expand regular and common irregular forms automatically
function expandVerbForms(
  _base: string,
  forms: [string, string, string, string], // [base, 3rd_person, past, gerund]
  particles: string[],
): string[] {
  const result: string[] = [];
  for (const p of particles) {
    for (const f of forms) {
      result.push(`${f} ${p}`);
    }
  }
  return result;
}

const RAW_PHRASAL_LIST: string[] = [
  // --- 3-Word Phrasal Verbs ---
  "look forward to", "looks forward to", "looked forward to", "looking forward to",
  "come up with", "comes up with", "came up with", "coming up with",
  "get along with", "gets along with", "got along with", "getting along with",
  "run out of", "runs out of", "ran out of", "running out of",
  "put up with", "puts up with", "putting up with",
  "cut back on", "cuts back on", "cutting back on",
  "keep up with", "keeps up with", "kept up with", "keeping up with",
  "make up for", "makes up for", "made up for", "making up for",
  "look out for", "looks out for", "looked out for", "looking out for",
  "look up to", "looks up to", "looked up to", "looking up to",
  "look down on", "looks down on", "looked down on", "looking down on",
  "stand up for", "stands up for", "stood up for", "standing up for",
  "face up to", "faces up to", "faced up to", "facing up to",
  "check up on", "checks up on", "checked up on", "checking up on",
  "zero in on", "zeros in on", "zeroed in on", "zeroing in on",
  "weigh in on", "weighs in on", "weighed in on", "weighing in on",
  "double down on", "doubles down on", "doubled down on", "doubling down on",
  "brush up on", "brushes up on", "brushed up on", "brushing up on",
  "get rid of", "gets rid of", "got rid of", "getting rid of",
  "get away with", "gets away with", "got away with", "getting away with",
  "come down to", "comes down to", "came down to", "coming down to",
  "boil down to", "boils down to", "boiled down to", "boiling down to",
  "crack down on", "cracks down on", "cracked down on", "cracking down on",
  "catch up with", "catches up with", "caught up with", "catching up with",
  "sign up for", "signs up for", "signed up for", "signing up for",
  "opt out of", "opts out of", "opted out of", "opting out of",
  "opt in to", "opts in to", "opted in to", "opting in to",
  "phase out of", "phases out of", "phased out of", "phasing out of",
  "walk away from", "walks away from", "walked away from", "walking away from",
  "live up to", "lives up to", "lived up to", "living up to",
  "measure up to", "measures up to", "measured up to", "measuring up to",
  "press down on", "presses down on", "pressed down on", "pressing down on",
  "press ahead with", "presses ahead with", "pressed ahead with", "pressing ahead with",
  "weigh down on", "weighs down on", "weighed down on", "weighing down on",
  "bear down on", "bears down on", "bore down on", "bearing down on",
  "push back on", "pushes back on", "pushed back on", "pushing back on",
  "hone in on", "hones in on", "honed in on", "honing in on",
  "circle back to", "circles back to", "circled back to", "circling back to",
  "circle back on", "circles back on", "circled back on", "circling back on",
  "follow through on", "follows through on", "followed through on", "following through on",
  "fall back on", "falls back on", "fell back on", "falling back on",
  "clamp down on", "clamps down on", "clamped down on", "clamping down on",
  "drill down into", "drills down into", "drilled down into", "drilling down into",
  "stay on top of", "stays on top of", "stayed on top of", "staying on top of",

  // --- 2-Word Core Phrasal Verbs (Expanded Families) ---
  // press
  ...expandVerbForms("press", ["press", "presses", "pressed", "pressing"], [
    "on", "ahead", "down", "out", "for",
  ]),
  // flesh
  ...expandVerbForms("flesh", ["flesh", "fleshes", "fleshed", "fleshing"], ["out"]),
  // hammer
  ...expandVerbForms("hammer", ["hammer", "hammers", "hammered", "hammering"], ["out", "away"]),
  // tap
  ...expandVerbForms("tap", ["tap", "taps", "tapped", "tapping"], ["into", "out"]),
  // lock
  ...expandVerbForms("lock", ["lock", "locks", "locked", "locking"], ["in", "down", "out"]),
  // break
  ...expandVerbForms("break", ["break", "breaks", "broke", "breaking"], [
    "down", "out", "up", "through", "in", "away", "off", "into",
  ]),
  // carry
  ...expandVerbForms("carry", ["carry", "carries", "carried", "carrying"], [
    "out", "on", "through", "away", "over",
  ]),
  // figure
  ...expandVerbForms("figure", ["figure", "figures", "figured", "figuring"], ["out"]),
  // set
  ...expandVerbForms("set", ["set", "sets", "set", "setting"], [
    "up", "off", "out", "back", "in", "aside",
  ]),
  // ramp
  ...expandVerbForms("ramp", ["ramp", "ramps", "ramped", "ramping"], ["up"]),
  // drill
  ...expandVerbForms("drill", ["drill", "drills", "drilled", "drilling"], ["down"]),
  // touch
  ...expandVerbForms("touch", ["touch", "touches", "touched", "touching"], ["base", "upon"]),
  // scale
  ...expandVerbForms("scale", ["scale", "scales", "scaled", "scaling"], ["up", "back", "down"]),
  // turn
  ...expandVerbForms("turn", ["turn", "turns", "turned", "turning"], [
    "out", "into", "down", "up", "off", "on", "around", "over", "away", "in",
  ]),
  // point
  ...expandVerbForms("point", ["point", "points", "pointed", "pointing"], ["out", "to"]),
  // bring
  ...expandVerbForms("bring", ["bring", "brings", "brought", "bringing"], [
    "about", "up", "on", "in", "back", "down", "forward", "off", "out",
  ]),
  // take
  ...expandVerbForms("take", ["take", "takes", "took", "taking"], [
    "over", "on", "up", "off", "aback", "in", "back", "after", "down", "out", "through",
  ]),
  // put
  ...expandVerbForms("put", ["put", "puts", "put", "putting"], [
    "off", "forward", "out", "on", "away", "down", "in", "through",
  ]),
  // call
  ...expandVerbForms("call", ["call", "calls", "called", "calling"], [
    "off", "for", "out", "in", "on", "back", "up",
  ]),
  // give
  ...expandVerbForms("give", ["give", "gives", "gave", "giving"], [
    "up", "in", "away", "back", "out", "off",
  ]),
  // hold
  ...expandVerbForms("hold", ["hold", "holds", "held", "holding"], [
    "back", "on", "up", "out", "off", "down",
  ]),
  // stand
  ...expandVerbForms("stand", ["stand", "stands", "stood", "standing"], [
    "out", "by", "down", "for", "in",
  ]),
  // step
  ...expandVerbForms("step", ["step", "steps", "stepped", "stepping"], [
    "up", "down", "in", "aside", "back",
  ]),
  // roll
  ...expandVerbForms("roll", ["roll", "rolls", "rolled", "rolling"], [
    "out", "back", "in", "over",
  ]),
  // run
  ...expandVerbForms("run", ["run", "runs", "ran", "running"], [
    "into", "across", "over", "through", "down", "away",
  ]),
  // get
  ...expandVerbForms("get", ["get", "gets", "got", "getting"], [
    "over", "by", "ahead", "through", "into", "back", "off", "across",
  ]),
  // come
  ...expandVerbForms("come", ["come", "comes", "came", "coming"], [
    "across", "along", "out", "in", "by", "back", "about", "over", "through", "forward", "off",
  ]),
  // go
  ...expandVerbForms("go", ["go", "goes", "went", "going"], [
    "through", "over", "on", "ahead", "out", "without", "by", "off",
  ]),
  // make
  ...expandVerbForms("make", ["make", "makes", "made", "making"], [
    "out", "up",
  ]),
  // look
  ...expandVerbForms("look", ["look", "looks", "looked", "looking"], [
    "into", "after", "over", "through", "around", "back",
  ]),
  // pass
  ...expandVerbForms("pass", ["pass", "passes", "passed", "passing"], [
    "on", "out", "away", "by", "up",
  ]),
  // pay
  ...expandVerbForms("pay", ["pay", "pays", "paid", "paying"], [
    "off", "back", "out",
  ]),
  // pick
  ...expandVerbForms("pick", ["pick", "picks", "picked", "picking"], [
    "up", "out", "on",
  ]),
  // pull
  ...expandVerbForms("pull", ["pull", "pulls", "pulled", "pulling"], [
    "off", "through", "out", "together", "up", "down", "back",
  ]),
  // wrap
  ...expandVerbForms("wrap", ["wrap", "wraps", "wrapped", "wrapping"], ["up"]),
  // follow
  ...expandVerbForms("follow", ["follow", "follows", "followed", "following"], ["up"]),
  // narrow
  ...expandVerbForms("narrow", ["narrow", "narrows", "narrowed", "narrowing"], ["down"]),
  // iron
  ...expandVerbForms("iron", ["iron", "irons", "ironed", "ironing"], ["out"]),
  // opt
  ...expandVerbForms("opt", ["opt", "opts", "opted", "opting"], ["in", "out"]),
  // phase
  ...expandVerbForms("phase", ["phase", "phases", "phased", "phasing"], ["in", "out"]),
  // sign
  ...expandVerbForms("sign", ["sign", "signs", "signed", "signing"], ["up", "in", "off", "out"]),
  // log
  ...expandVerbForms("log", ["log", "logs", "logged", "logging"], ["in", "out", "on", "off"]),
  // check
  ...expandVerbForms("check", ["check", "checks", "checked", "checking"], ["in", "out", "up"]),
  // burn
  ...expandVerbForms("burn", ["burn", "burns", "burned", "burning"], ["out", "down", "up"]),
  // blow
  ...expandVerbForms("blow", ["blow", "blows", "blew", "blowing"], ["up", "over", "off"]),
  // back
  ...expandVerbForms("back", ["back", "backs", "backed", "backing"], ["down", "out", "up"]),
  // cut
  ...expandVerbForms("cut", ["cut", "cuts", "cut", "cutting"], ["off", "out", "in", "down"]),
  // fall
  ...expandVerbForms("fall", ["fall", "falls", "fell", "falling"], [
    "behind", "through", "out", "apart", "back",
  ]),
  // hand
  ...expandVerbForms("hand", ["hand", "hands", "handed", "handing"], ["over", "out", "in", "down"]),
  // hang
  ...expandVerbForms("hang", ["hang", "hangs", "hung", "hanging"], ["out", "up", "on"]),
  // lay
  ...expandVerbForms("lay", ["lay", "lays", "laid", "laying"], ["off", "out", "down"]),
  // lead
  ...expandVerbForms("lead", ["lead", "leads", "led", "leading"], ["to"]),
  // let
  ...expandVerbForms("let", ["let", "lets", "let", "letting"], ["down", "out", "in", "off"]),
  // shut
  ...expandVerbForms("shut", ["shut", "shuts", "shut", "shutting"], ["down", "out", "off"]),
  // show
  ...expandVerbForms("show", ["show", "shows", "showed", "showing"], ["up", "off"]),
  // track
  ...expandVerbForms("track", ["track", "tracks", "tracked", "tracking"], ["down"]),
  // trade
  ...expandVerbForms("trade", ["trade", "trades", "traded", "trading"], ["off", "in"]),
  // weed
  ...expandVerbForms("weed", ["weed", "weeds", "weeded", "weeding"], ["out"]),
  // wind
  ...expandVerbForms("wind", ["wind", "winds", "wound", "winding"], ["up", "down"]),
  // wipe
  ...expandVerbForms("wipe", ["wipe", "wipes", "wiped", "wiping"], ["out", "away", "down"]),
  // write
  ...expandVerbForms("write", ["write", "writes", "wrote", "writing"], ["off", "down", "up"]),
  // push
  ...expandVerbForms("push", ["push", "pushes", "pushed", "pushing"], ["back", "forward", "through", "ahead", "out", "aside", "on"]),
  // weigh
  ...expandVerbForms("weigh", ["weigh", "weighs", "weighed", "weighing"], ["in", "down", "on"]),
  // bear
  ...expandVerbForms("bear", ["bear", "bears", "bore", "bearing"], ["out", "down", "up", "with"]),
  // clamp
  ...expandVerbForms("clamp", ["clamp", "clamps", "clamped", "clamping"], ["down"]),
  // zero
  ...expandVerbForms("zero", ["zero", "zeros", "zeroed", "zeroing"], ["in"]),
  // hone
  ...expandVerbForms("hone", ["hone", "hones", "honed", "honing"], ["in"]),
  // pivot
  ...expandVerbForms("pivot", ["pivot", "pivots", "pivoted", "pivoting"], ["to", "away"]),
  // stem
  ...expandVerbForms("stem", ["stem", "stems", "stemmed", "stemming"], ["from"]),
  // brush
  ...expandVerbForms("brush", ["brush", "brushes", "brushed", "brushing"], ["up", "off", "aside"]),
  // boil
  ...expandVerbForms("boil", ["boil", "boils", "boiled", "boiling"], ["down"]),
  // crack
  ...expandVerbForms("crack", ["crack", "cracks", "cracked", "cracking"], ["down", "up"]),
  // double
  ...expandVerbForms("double", ["double", "doubles", "doubled", "doubling"], ["down"]),
  // bail
  ...expandVerbForms("bail", ["bail", "bails", "bailed", "bailing"], ["out"]),
  // rule
  ...expandVerbForms("rule", ["rule", "rules", "ruled", "ruling"], ["out", "in"]),
  // firm
  ...expandVerbForms("firm", ["firm", "firms", "firmed", "firming"], ["up"]),
  // single
  ...expandVerbForms("single", ["single", "singles", "singled", "singling"], ["out"]),
  // carve
  ...expandVerbForms("carve", ["carve", "carves", "carved", "carving"], ["out"]),
  // factor
  ...expandVerbForms("factor", ["factor", "factors", "factored", "factoring"], ["in", "out"]),
  // work (only true phrasal verb idioms: work out, work through)
  ...expandVerbForms("work", ["work", "works", "worked", "working"], ["out", "through"]),
];

export const OBJECT_PRONOUNS_SET = new Set([
  "it", "them", "him", "her", "us", "me", "this", "that", "all",
]);

export const PROFESSIONAL_IDIOMS_SET = new Set([
  "on the same page",
  "hit the ground running",
  "at the end of the day",
  "in the long run",
  "think outside the box",
  "play it by ear",
  "keep in mind",
  "take into account",
  "state of the art",
  "best practice",
  "best practices",
  "end to end",
  "cross functional",
  "trade off",
  "trade offs",
  "by and large",
  "part and parcel",
]);

/**
 * Fast O(1) Set containing all verified authentic English phrasal verbs and idioms.
 */
export const VERIFIED_PHRASAL_VERBS_SET = new Set<string>([
  ...RAW_PHRASAL_LIST,
  ...PROFESSIONAL_IDIOMS_SET,
]);

/**
 * Returns true if a given phrase is a verified authentic English phrasal verb or idiom.
 */
export function isVerifiedPhrasalVerb(phrase: string): boolean {
  if (!phrase) return false;
  return VERIFIED_PHRASAL_VERBS_SET.has(phrase.toLowerCase().trim());
}

