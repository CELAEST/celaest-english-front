/**
 * Speech Intelligibility & Linguistic Guard (CELAEST Token Shield)
 * Prevents empty transcriptions, ambient mic noise, Whisper AI silence hallucinations,
 * Spanish/foreign language leaks, and incoherent gibberish from reaching the LLM,
 * eliminating wasted tokens and latency bottlenecks.
 */

// Common Whisper silence/ambient hallucinations when audio is empty, muted, or low ambient static
const WHISPER_SILENCE_HALLUCINATIONS = new Set([
  "thank you",
  "thank you.",
  "thank you very much",
  "thank you very much.",
  "okay, thank you",
  "okay, thank you.",
  "okay thank you",
  "okay thank you.",
  "ok thank you",
  "ok thank you.",
  "thank you bye",
  "thank you, bye.",
  "thanks for watching",
  "thanks for watching.",
  "thanks for listening",
  "thanks for listening.",
  "you",
  "you.",
  "bye",
  "bye.",
  "bye-bye",
  "bye-bye.",
  "goodbye",
  "goodbye.",
  "see you next time",
  "see you next time.",
  "subtitles by the amara.org community",
  "subtitles by amara.org",
  "subtitles by",
  "translated by",
  "mbc",
  "silence",
  "[silence]",
  "[cough]",
  "[applause]",
  "[music]",
  "[laughter]",
  "[blank_audio]",
  "um",
  "uh",
  "ah",
  "ok",
  "okay",
  "yes",
  "no",
  "hello",
  "hello.",
  "hi",
  "hi.",
  ".",
  "...",
  "-",
]);

// Distinctive Spanish stopwords and vocabulary markers for real-time ESL pre-flight screening
const SPANISH_MARKERS = new Set([
  "de", "la", "que", "el", "en", "y", "los", "se", "del", "las", "por", "un", "para", "con", "una",
  "su", "al", "lo", "como", "más", "mas", "pero", "sus", "le", "ya", "o", "fue", "este", "ha", "sí", "si", "porque",
  "esta", "son", "entre", "está", "cuando", "muy", "sin", "sobre", "ser", "tiene", "también", "tambien",
  "hasta", "hay", "donde", "quien", "desde", "todo", "nos", "durante", "todos", "uno", "les", "ni", "contra",
  "otros", "ese", "eso", "ante", "ellos", "e", "esto", "mí", "mi", "antes", "algunos", "qué", "unos", "yo",
  "otro", "otras", "otra", "él", "tanto", "esa", "estos", "mucho", "quienes", "nada", "muchos", "mucha", "muchas",
  "cual", "sea", "poco", "pocos", "ella", "estar", "haber", "estas", "estaba", "estamos", "están", "estan", "estuvo",
  "diciendo", "decir", "hablar", "hablando", "cosas", "bobas", "bobo", "trabajo", "trabajar", "hacer", "haciendo",
  "hecho", "bueno", "entonces", "ahorita", "ahora", "luego", "después", "despues", "aquí", "aqui", "allí", "alli",
  "allá", "alla", "hola", "gracias", "adiós", "adios", "tengo", "tenemos", "tienen", "tenía", "tenia", "tuve",
  "fuimos", "fueron", "era", "éramos", "eramos", "eran", "seamos", "sean", "sido", "había", "habia", "hubo", "haya",
  "sabes", "sé", "sabe", "sabemos", "saben", "sabía", "sabia", "supe", "quiero", "quiere", "queremos", "quieren",
  "quería", "queria", "quise", "puedo", "puede", "podemos", "pueden", "podía", "podia", "pude", "vamos", "voy",
  "va", "van", "iba", "íbamos", "ibamos", "iban", "mira", "mire", "oye", "oiga", "mano", "gente", "persona",
  "personas", "problema", "problemas", "solución", "solucion", "sistema", "proyecto", "desarrollo", "experiencia",
  "empresa", "equipo", "entrevista", "respuesta", "pregunta", "apreté", "aprete", "botón", "boton", "cosito", "verde",
  "estoy", "espanol", "español", "solo", "sola", "nadie", "nunca", "siempre", "veces", "bien", "mal", "mejor", "peor",
  "aca", "aquel", "aquella", "aquellos", "aquellas", "aquello", "mis", "tus", "nuestro", "nuestra", "nuestros", "nuestras",
  "mio", "mia", "tuyo", "tuya", "suyo", "suya", "nosotros", "nosotras", "vosotros", "vosotras", "usted", "ustedes",
  "he", "has", "hemos", "habeis", "han", "habias", "habiamos", "habiais", "habian", "hube", "hubiste", "hubimos",
  "hubisteis", "hubieron", "habre", "habras", "habra", "habremos", "habreis", "habran", "habria", "habrias", "habriamos",
  "habriais", "habrian", "hayas", "hayamos", "hayais", "hayan", "hubiera", "hubieras", "hubieramos", "hubierais",
  "hubieran", "hubiese", "hubieses", "hubiesemos", "hubieseis", "hubiesen", "teniendo", "tenido", "tenida", "tenidos",
  "tenidas", "tienes", "teneis", "tenga", "tengas", "tengamos", "tengais", "tengan", "tuviste", "tuvo", "tuvimos",
  "tuvisteis", "tuvieron", "tuviera", "tuvieras", "tuvieramos", "tuvierais", "tuvieran", "tuviese", "tuvieses",
  "tuviesemos", "tuvieseis", "tuviesen", "tenias", "teniamos", "teniais", "tenian", "sabiendo", "sabido", "sabeis",
  "sepa", "sepas", "sepamos", "sepais", "sepan", "supiste", "supo", "supimos", "supisteis", "supieron", "supiera",
  "supieras", "supieramos", "supierais", "supieran", "supiese", "supieses", "supiesemos", "supieseis", "supiesen",
  "sabias", "sabiamos", "sabiais", "sabian", "viendo", "visto", "veo", "ves", "ve", "vemos", "veis", "ven", "vea",
  "veas", "veamos", "veais", "vean", "vi", "viste", "vio", "vimos", "visteis", "vieron", "viera", "vieras", "vieramos",
  "vierais", "vieran", "viese", "vieses", "viesemos", "vieseis", "viesen", "veia", "veias", "veiamos", "veiais", "veian",
  "dicho", "digo", "dices", "dice", "decimos", "decis", "dicen", "diga", "digas", "digamos", "digais", "digan", "dije",
  "dijiste", "dijo", "dijimos", "dijisteis", "dijeron", "dijera", "dijeras", "dijeramos", "dijerais", "dijeran",
  "dijese", "dijeses", "dijesemos", "dijeseis", "dijesen", "decia", "decias", "deciamos", "deciais", "decian",
  "hago", "haces", "hace", "hacemos", "haceis", "hacen", "haga", "hagas", "hagamos", "hagais", "hagan", "hice",
  "hiciste", "hizo", "hicimos", "hicisteis", "hicieron", "hiciera", "hicieras", "hicieramos", "hicierais", "hicieran",
  "hiciese", "hicieses", "hiciesemos", "hieseis", "hiciesen", "hacia", "hacias", "haciamos", "haciais", "hacian",
  "yendo", "ido", "vas", "vais", "vaya", "vayas", "vayamos", "vayais", "vayan", "fuiste", "fuisteis",
  "fueras", "fuerais", "fuese", "fueses", "fuesemos", "fueseis", "fuesen", "ibas", "ibais",
  "ayuda", "puedes", "favor", "necesito", "dias", "tardes", "noches", "amigo", "amiga", "profe", "entendi", "listo", "dale", "vale",
]);

// Non-interview filler, translated pleasantries & help-seeking phrases (0 token shield)
const NON_INTERVIEW_FILLER_PATTERNS = [
  /^(hey|hi|hello)?\s*,?\s*(i\s+need\s+to\s+do\s+that|can\s+you\s+help\s+me|help\s+me)(\s*,?\s*please)?\.?$/i,
  /^(if\s+you\s+could\s+help\s+me|can\s+you\s+help\s+me|please\s+help\s+me)(\s*,?\s*please)?\.?$/i,
  /^(let'?s\s+go\s+for\s+all|let'?s\s+go)(\s*,?\s*please)?\.?$/i,
  /^(i\s+don'?t\s+know|i\s+do\s+not\s+know|i\s+have\s+no\s+idea)(\s+what\s+to\s+say)?\.?$/i,
  /^(what\s+is\s+the\s+question|can\s+you\s+repeat\s+the\s+question|repeat\s+please)\??$/i,
  /^(test\s+test|testing\s+microphone|one\s+two\s+three|mic\s+check)\.?$/i,
  /^(good\s+morning|good\s+afternoon|good\s+evening|hello\s+there|hey\s+there)\.?$/i,
];

// Common English words & Technical/Engineering vocabulary (~500 high-frequency tokens)
const COMMON_ENGLISH_LEXICON = new Set([
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as",
  "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will",
  "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which",
  "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year",
  "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its",
  "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
  "new", "want", "because", "any", "these", "give", "day", "most", "us", "is", "are", "was", "were", "been", "has",
  "had", "doing", "did", "does", "said", "making", "made", "going", "went", "gone", "taking", "took", "taken",
  "seeing", "saw", "seen", "getting", "got", "gotten", "knowing", "knew", "known", "thinking", "thought",
  "giving", "gave", "given", "working", "worked", "using", "used", "trying", "tried", "calling", "called",
  "asking", "asked", "needing", "needed", "feeling", "felt", "becoming", "became", "leaving", "left", "putting",
  "meaning", "meant", "keeping", "kept", "letting", "let", "beginning", "began", "begun", "seeming", "seemed",
  "helping", "helped", "talking", "talked", "turning", "turned", "starting", "started", "showing", "showed", "shown",
  "hearing", "heard", "playing", "played", "running", "ran", "moving", "moved", "living", "lived", "believing",
  "believed", "bringing", "brought", "happening", "happened", "writing", "wrote", "written", "providing", "provided",
  "sitting", "sat", "standing", "stood", "losing", "lost", "paying", "paid", "meeting", "met", "including", "included",
  "continuing", "continued", "setting", "set", "learning", "learned", "changing", "changed", "leading", "led",
  "understanding", "understood", "watching", "watched", "following", "followed", "stopping", "stopped", "creating",
  "created", "speaking", "spoke", "spoken", "reading", "read", "allowing", "allowed", "adding", "added", "spending",
  "spent", "growing", "grew", "grown", "opening", "opened", "walking", "walked", "winning", "won", "offering", "offered",
  "remembering", "remembered", "loving", "loved", "considering", "considered", "appearing", "appeared", "buying",
  "bought", "serving", "served", "die", "died", "sending", "sent", "expecting", "expected", "building", "built",
  "staying", "stayed", "falling", "fell", "fallen", "cutting", "cut", "reaching", "reached", "killing", "killed",
  "remaining", "remained", "suggesting", "suggested", "raising", "raised", "passing", "passed", "selling", "sold",
  "requiring", "required", "reporting", "reported", "deciding", "decided", "pulling", "pulled",
  "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "hundred", "thousand", "million",
  "year", "years", "month", "months", "week", "weeks", "day", "days", "hour", "hours", "minute", "minutes",
  "first", "second", "third", "next", "last", "previous", "future", "past", "present",
  // Common greetings, titles, proper address, conversational markers
  "hello", "hi", "hey", "dear", "smith", "john", "mary", "dr", "mr", "mrs", "ms", "miss", "sir", "madam",
  "please", "thank", "thanks", "welcome", "sorry", "excuse", "pardon", "yes", "no", "okay", "fine", "sure",
  "alright", "maybe", "perhaps", "inside", "outside", "between", "around", "near", "far", "top", "bottom",
  "upper", "lower", "front", "back", "left", "right", "under", "over", "into", "onto", "behind", "without",
  // Time, days, dates, calendar
  "today", "tomorrow", "yesterday", "tonight", "morning", "afternoon", "evening", "night", "noon", "midnight",
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "weekend", "weekdays",
  "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december",
  "daily", "weekly", "monthly", "yearly", "am", "pm", "clock", "early", "late", "soon", "now", "always",
  "never", "often", "sometimes", "usually", "already", "still", "yet", "again", "together", "apart", "alone",
  // Modals & essential verbs (present, past, participles, contractions)
  "must", "should", "shall", "ought", "might", "may", "can", "could", "would", "will",
  "dont", "cant", "wont", "didnt", "isnt", "arent", "wasnt", "werent", "havent", "hasnt", "couldnt", "shouldnt", "wouldnt",
  "eat", "ate", "eaten", "eating", "eats", "drink", "drank", "drunk", "drinking", "drinks",
  "sleep", "slept", "sleeping", "sleeps", "wake", "woke", "woken", "feel", "felt", "feeling", "feels",
  "hurt", "hurts", "hurting", "pain", "pains", "ache", "aches", "aching",
  "clean", "cleaned", "cleaning", "cleans", "wash", "washed", "washing", "washes",
  "brush", "brushed", "brushing", "brushes", "floss", "flossed", "flossing", "flosses",
  "rinse", "rinsed", "rinsing", "rinses", "spit", "spat", "spitting", "swallow", "swallowed", "swallowing",
  "bite", "bit", "bitten", "biting", "chew", "chewed", "chewing", "chews",
  "rest", "rested", "resting", "rests", "call", "called", "calling", "calls",
  "visit", "visited", "visiting", "visits", "arrive", "arrived", "arriving", "arrives",
  "stay", "stayed", "staying", "stays", "wait", "waited", "waiting", "waits",
  "stop", "stopped", "stopping", "stops", "avoid", "avoided", "avoiding", "avoids",
  "open", "opened", "opening", "opens", "close", "closed", "closing", "closes",
  "check", "checked", "checking", "checks", "examine", "examined", "examining", "examines",
  "treat", "treated", "treating", "treats", "heal", "healed", "healing", "heals",
  "cure", "cured", "curing", "cures", "prescribe", "prescribed", "prescribing",
  // Healthcare, medical, dental, clinical terms
  "tooth", "teeth", "clinic", "clinics", "clinical", "hospital", "hospitals", "patient", "patients",
  "dentist", "dentists", "dental", "doctor", "doctors", "medical", "medicine", "medicines",
  "medication", "medications", "pill", "pills", "tablet", "tablets", "capsule", "capsules", "dose", "doses", "dosage",
  "nurse", "nurses", "assistant", "assistants", "hygienist", "hygienists", "hygiene",
  "sterilize", "sterilized", "sterilizing", "sterilization", "autoclave", "disinfect", "disinfected",
  "surgery", "surgeries", "surgical", "surgeon", "operation", "procedure", "procedures", "treatment", "treatments",
  "therapy", "diagnosis", "prognosis", "painful", "painless", "painkiller", "painkillers", "toothache", "headache",
  "appointment", "appointments", "care", "health", "healthy", "mouth", "oral", "gum", "gums", "gingival",
  "periodontal", "food", "foods", "diet", "meal", "meals", "hot", "cold", "warm", "water", "salt", "saline",
  "blood", "bleeding", "bled", "bleed", "extraction", "extractions", "extract", "extracted", "extracting",
  "swelling", "swollen", "swell", "infection", "infections", "infected", "anesthesia", "anesthetic",
  "numb", "numbness", "needle", "needles", "syringe", "injection", "injections", "suture", "sutures",
  "gauze", "cotton", "ice", "pack", "packs", "crown", "crowns", "filling", "fillings", "composite",
  "root", "roots", "canal", "canals", "decay", "cavity", "cavities", "caries", "plaque", "tartar",
  "scaler", "scaling", "ultrasonic", "mirror", "drill", "handpiece", "instrument", "instruments",
  "tool", "tools", "equipment", "xray", "xrays", "radiograph", "scan", "scans", "impression", "trays",
  "denture", "dentures", "bridge", "bridges", "implant", "implants", "orthodontic", "braces", "aligner",
  "retainer", "sensitivity", "sensitive", "nerve", "nerves", "tissue", "tissues", "bone", "bones",
  "jaw", "jaws", "mandible", "maxilla", "enamel", "dentin", "pulp", "molar", "molars", "premolar",
  "canine", "canines", "incisor", "incisors", "wisdom", "impacted", "occlusion", "smile", "aesthetic",
  "whitening", "veneer", "veneers", "followup", "protocol", "protocols", "guideline", "guidelines",
  "straw", "straws", "smoke", "smoking", "smoker", "alcohol", "press", "pressed", "pressure", "fever",
  "emergency", "regards", "sincerely", "prescription", "prescriptions", "antibiotic", "antibiotics",
  "ibuprofen", "paracetamol", "aspirin", "complication", "complications", "socket", "clot", "clots",
  // Adjectives, descriptors, adverbs
  "fast", "faster", "fastest", "slow", "slower", "slowest", "hard", "soft", "heavy", "light",
  "gentle", "gently", "careful", "carefully", "bad", "worse", "worst", "better", "best", "easy", "difficult",
  "clear", "clearly", "simple", "simply", "safe", "safely", "normal", "abnormal", "real", "really",
  "enough", "too", "very", "quite", "rather", "pretty", "fairly", "almost", "nearly",
  // Common workplace, document, communication tokens
  "office", "desk", "room", "rooms", "building", "person", "people", "man", "woman", "child", "children",
  "family", "friend", "friends", "colleague", "colleagues", "partner", "manager", "boss", "staff",
  "employee", "employees", "worker", "workers", "case", "cases", "task", "tasks", "job", "jobs",
  "email", "emails", "message", "messages", "letter", "letters", "note", "notes", "report", "reports",
  "file", "files", "document", "documents", "paper", "papers", "form", "forms", "schedule", "schedules",
  "calendar", "phone", "number", "numbers", "address", "location", "place", "places", "question", "questions",
  "answer", "answers", "detail", "details", "reason", "reasons", "result", "results", "step", "steps",
  "instruction", "instructions", "advice", "tip", "tips", "information", "info", "fact", "facts", "idea", "ideas",
  "plan", "plans", "goal", "goals", "hope", "wish", "head", "face", "eye", "eyes", "ear", "ears",
  "nose", "lip", "lips", "tongue", "neck", "throat", "chest", "arm", "arms", "hand", "hands", "finger",
  "fingers", "leg", "legs", "foot", "feet",
  // Technical & software ecosystem
  "software", "hardware", "frontend", "backend", "fullstack", "data", "application", "applications", "app", "apps",
  "platform", "platforms", "infrastructure", "scalable", "scaling", "scalability", "designing", "designed",
  "developing", "developer", "developers", "development", "program", "programs", "programming", "programmer",
  "typescript", "javascript", "python", "golang", "java", "rust", "c", "cpp", "csharp", "ruby", "php", "swift", "kotlin",
  "api", "apis", "gateway", "gateways", "service", "services", "microservice", "microservices", "system", "systems",
  "architecture", "architectures", "server", "servers", "client", "clients", "database", "databases", "sql", "nosql",
  "redis", "cache", "caches", "caching", "kubernetes", "docker", "load", "balancer", "balancers", "balancing",
  "throughput", "latency", "spike", "spikes", "performance", "http", "https", "rest",
  "graphql", "grpc", "cloud", "aws", "gcp", "azure", "ci", "cd", "pipeline", "pipelines", "product", "products",
  "feature", "features", "user", "users", "customer", "customers", "stakeholder",
  "stakeholders", "team", "teams", "lead", "leader", "leaders", "leadership", "engineer", "engineers", "engineering",
  "code", "coding", "design", "designs", "framework", "frameworks", "metrics", "metric", "retention", "conversion",
  "growth", "roadmap", "roadmaps", "agile", "scrum", "sprint", "sprints", "priority", "prioritize", "priorities",
  "deliver", "delivery", "delivered", "outcome", "outcomes", "impact", "business", "value", "solution", "solutions",
  "problem", "problems", "test", "tests", "testing", "deploy", "deployed", "deployment", "monitor", "monitored",
  "monitoring", "telemetry", "log", "logs", "logging", "traffic", "sub", "response", "responses", "request", "requests",
  "rate", "limit", "limits", "limiting", "queue", "queues", "kafka", "event", "events", "driven", "async", "sync",
  "thread", "threads", "memory", "cpu", "io", "proxy", "reverse", "security", "auth", "oauth", "token", "tokens",
  "jwt", "session", "sessions", "interview", "interviews", "role", "roles", "experience", "experiences", "company",
  "companies", "project", "projects", "responsible", "achieved", "improved", "increased", "decreased", "reduced",
  "optimized", "implemented", "collaborated", "managed", "resolved", "handled", "worked", "led", "built", "created",
]);

// Common QWERTY keyboard mash sequences (consecutive key runs of 5+ letters)
const KEYBOARD_MASH_PATTERNS = [
  /asdfg|sdfgh|dfghj|fghjk|ghjkl/i,
  /qwert|werty|ertyu|rtyui|tyuio|yuiop/i,
  /zxcvb|xcvbn|cvbnm/i,
  /lkjhg|kjhgf|jhgfd|hgfds|gfdsa/i,
  /poiuy|oiuyt|iuytr|uytre|ytrew|trewq/i,
  /mnbvc|nbvcx|bvcxz/i,
  /qazws|wsxed|edcrf|rfvtg|tgbyh|yhnuj|ujmik/i,
  /(.)\1{3,}/i, // 4+ repeated identical characters (e.g. "aaaa", "zzzz")
  /[bcdfghjklmnpqrstvwxyz]{6,}/i, // 6+ consecutive consonants without vowels
];

export interface SpeechValidationResult {
  isValid: boolean;
  reason?:
    | "SILENCE_OR_EMPTY"
    | "WHISPER_HALLUCINATION"
    | "SPANISH_DETECTED"
    | "NON_INTERVIEW_FILLER"
    | "NONSENSE_OR_GIBBERISH"
    | "INSUFFICIENT_WORDS"
    | "REPETITIVE_NOISE";
  message?: string;
  cleanTranscript: string;
}

/**
 * Checks if a single word looks like random gibberish or keyboard mashing
 */
export function isGibberishWord(rawWord: string): boolean {
  const word = rawWord.toLowerCase().replace(/[^a-z]/g, "");
  if (!word || word.length < 2) return false;

  // Recognized common English word or technical token
  if (COMMON_ENGLISH_LEXICON.has(word)) return false;

  // Check known short vowel-less English words
  const validNoVowelWords = new Set(["by", "my", "fly", "dry", "why", "try", "cry", "shy", "gym", "sync", "lynx", "myth", "rhythm", "crypt", "nth"]);
  if (validNoVowelWords.has(word)) return false;

  // 1. Length >= 3 and 0 vowels
  const vowelCount = (word.match(/[aeiouy]/g) || []).length;
  if (word.length >= 3 && vowelCount === 0) return true;

  // 2. Extremely skewed vowel ratio on longer words (> 4 chars)
  const vowelRatio = vowelCount / word.length;
  if (word.length >= 5 && (vowelRatio < 0.12 || vowelRatio > 0.88)) return true;

  // 3. Consecutive consonants burst of 6+ letters (e.g. "gfrqwg", "bcdfgh")
  if (/[bcdfghjklmnpqrstvwxz]{6,}/i.test(word)) return true;

  // 4. Repeated character clusters (e.g. "aaaa", "fffff")
  if (/(.)\1{3,}/i.test(word)) return true;

  // 5. Matches raw QWERTY mash pattern
  for (const pattern of KEYBOARD_MASH_PATTERNS) {
    if (pattern.test(word)) return true;
  }

  // 6. Abnormal consonant clusters of 4+ consonants at word start
  if (/^[bcdfghjklmnpqrstvwxyz]{5,}/i.test(word)) return true;

  return false;
}

/**
 * Validates whether the captured spoken transcript contains genuine, intelligible English speech.
 * Operates as a 0-token gatekeeper protecting CELAEST-CORE LLM from non-English/noise evaluations.
 */
export function validateSpeechIntelligibility(
  rawTranscript: string | null | undefined,
  durationSeconds: number = 0,
  detectedLanguage?: string,
): SpeechValidationResult {
  if (!rawTranscript) {
    return {
      isValid: false,
      reason: "SILENCE_OR_EMPTY",
      message: "No speech detected. Please speak into the microphone or type your answer.",
      cleanTranscript: "",
    };
  }

  const clean = rawTranscript.trim();
  if (clean.length === 0 || !/[a-zA-Z0-9áéíóúñ]/.test(clean)) {
    return {
      isValid: false,
      reason: "SILENCE_OR_EMPTY",
      message: "No detectamos audio ni texto comprensible. Por favor habla hacia el micrófono o escribe en inglés.",
      cleanTranscript: "",
    };
  }

  // 1a. Repetitive noise & extreme character spam (e.g. "aaaaaaaaaaaaa")
  if (/(.)\1{4,}/.test(clean.toLowerCase().replace(/\s+/g, ""))) {
    return {
      isValid: false,
      reason: "REPETITIVE_NOISE",
      message: "Texto o audio repetitivo no estructurado. Por favor formula una respuesta coherente en inglés.",
      cleanTranscript: clean,
    };
  }

  // Count alphanumeric words
  const rawWords = clean
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9áéíóúñ]/g, ""))
    .filter((w) => w.length > 0);

  // 1b. Acoustic Model Language Detection (Groq Whisper verbose_json)
  // Protect against false positives when a Spanish accent is acoustically detected but text is in English!
  if (detectedLanguage) {
    const lang = detectedLanguage.toLowerCase().trim();
    if (lang && lang !== "english" && lang !== "en") {
      let recognizedEnglish = 0;
      let spanishMarkers = 0;
      for (const word of rawWords) {
        if (COMMON_ENGLISH_LEXICON.has(word) || /^\d+$/.test(word)) recognizedEnglish++;
        if (SPANISH_MARKERS.has(word)) spanishMarkers++;
      }
      const hasSpanishDiacritics = /[áéíóúñ¿¡]/.test(clean.toLowerCase());
      const hasRealSpanish = hasSpanishDiacritics || spanishMarkers >= 2 || (rawWords.length <= 3 && spanishMarkers >= 1);
      const isEnglishContent = rawWords.length >= 3 && recognizedEnglish >= 2 && spanishMarkers === 0 && !hasSpanishDiacritics;

      // Only reject if the text actually contains Spanish or lacks recognizable English words
      if (hasRealSpanish || (!isEnglishContent && recognizedEnglish === 0)) {
        return {
          isValid: false,
          reason: "SPANISH_DETECTED",
          message: "Detectamos tu respuesta en español. Por favor responde en inglés para evaluar tu práctica.",
          cleanTranscript: clean,
        };
      }
    }
  }

  // Normalized lowercase text without surrounding punctuation for hallucination checks
  const normalized = clean
    .toLowerCase()
    .replace(/^[^a-z0-9áéíóúñ]+|[^a-z0-9áéíóúñ]+$/g, "")
    .trim();

  // 2. Check Whisper silence hallucination blacklist
  if (
    WHISPER_SILENCE_HALLUCINATIONS.has(normalized) ||
    WHISPER_SILENCE_HALLUCINATIONS.has(clean.toLowerCase())
  ) {
    return {
      isValid: false,
      reason: "WHISPER_HALLUCINATION",
      message: "Microphone captured ambient noise. Please speak your answer clearly in English.",
      cleanTranscript: clean,
    };
  }

  // 2b. Check conversational filler / help-seeking phrases
  for (const pattern of NON_INTERVIEW_FILLER_PATTERNS) {
    if (pattern.test(normalized) || pattern.test(clean)) {
      return {
        isValid: false,
        reason: "NON_INTERVIEW_FILLER",
        message: "Por favor responde directamente a la pregunta técnica en inglés.",
        cleanTranscript: clean,
      };
    }
  }

  // Single word gibberish check
  if (rawWords.length === 1 && isGibberishWord(rawWords[0])) {
    return {
      isValid: false,
      reason: "NONSENSE_OR_GIBBERISH",
      message: "Texto o audio no comprensible. Por favor formula una respuesta coherente en inglés.",
      cleanTranscript: clean,
    };
  }

  // 4. Spanish Language Detection (Token Shield) - Screened before length check so short Spanish answers are caught immediately
  const hasSpanishDiacritics = /[áéíóúñ¿¡]/.test(clean.toLowerCase());
  let spanishWordCount = 0;
  for (const word of rawWords) {
    if (SPANISH_MARKERS.has(word)) {
      spanishWordCount++;
    }
  }

  const spanishRatio = rawWords.length > 0 ? spanishWordCount / rawWords.length : 0;
  if (
    (rawWords.length <= 3 && spanishWordCount >= 1) ||
    (rawWords.length > 3 && ((spanishRatio >= 0.20 && spanishWordCount >= 2) || spanishWordCount >= 4)) ||
    (hasSpanishDiacritics && spanishWordCount >= 1) ||
    (hasSpanishDiacritics && rawWords.length <= 3)
  ) {
    return {
      isValid: false,
      reason: "SPANISH_DETECTED",
      message: "Detectamos tu respuesta en español. Por favor responde en inglés para evaluar tu práctica.",
      cleanTranscript: clean,
    };
  }

  // Require at least 3 words for an interview answer
  if (rawWords.length < 3) {
    return {
      isValid: false,
      reason: "INSUFFICIENT_WORDS",
      message: "Tu respuesta es muy breve. Por favor elabora una respuesta completa en inglés (mínimo 3 palabras).",
      cleanTranscript: clean,
    };
  }

  // 5. Gibberish & Keyboard Mash Detection (e.g. "gergewg r we erg wer er we ewg wer weewr", "asdfghjkl")
  let gibberishWordCount = 0;
  let recognizedEnglishCount = 0;

  for (const word of rawWords) {
    if (isGibberishWord(word)) {
      gibberishWordCount++;
    }
    if (COMMON_ENGLISH_LEXICON.has(word) || /^\d+$/.test(word)) {
      recognizedEnglishCount++;
    }
  }

  const englishRatio = recognizedEnglishCount / rawWords.length;

  // If any single word is severe keyboard mash or > 30% of the words are gibberish
  if (gibberishWordCount > 0 && (gibberishWordCount / rawWords.length >= 0.3 || gibberishWordCount >= 2)) {
    return {
      isValid: false,
      reason: "NONSENSE_OR_GIBBERISH",
      message: "Texto o audio no comprensible. Por favor formula una respuesta coherente en inglés.",
      cleanTranscript: clean,
    };
  }

  // If text has 3+ words and English ratio is low (< 40%), or short phrase (<= 6 words) with ratio < 50%
  if (rawWords.length >= 3 && (englishRatio < 0.40 || (rawWords.length <= 6 && englishRatio < 0.50))) {
    return {
      isValid: false,
      reason: "NONSENSE_OR_GIBBERISH",
      message: "Texto no reconocible como inglés coherente. Por favor formula una respuesta estructurada en inglés.",
      cleanTranscript: clean,
    };
  }

  // 6. Check for single character repetitive spam (e.g. "aaaaaa", ".........", "asdfasdf")
  const uniqueChars = new Set(clean.toLowerCase().replace(/[^a-z0-9]/g, ""));
  if (clean.length > 8 && uniqueChars.size <= 2) {
    return {
      isValid: false,
      reason: "REPETITIVE_NOISE",
      message: "Audio o texto repetitivo detectado. Por favor responde con claridad.",
      cleanTranscript: clean,
    };
  }

  // 7. Check for repeated words / babble (e.g. "bla bla bla bla", "test test test", "yes yes yes yes")
  if (rawWords.length >= 4) {
    const uniqueWords = new Set(rawWords);
    const vocabularyEntropy = uniqueWords.size / rawWords.length;
    if (vocabularyEntropy < 0.4) {
      return {
        isValid: false,
        reason: "NONSENSE_OR_GIBBERISH",
        message: "Repetición excesiva detectada. Por favor estructura una respuesta más variada en inglés.",
        cleanTranscript: clean,
      };
    }
  }

  // 8. If duration is extremely short (< 0.8s) but has many words, it's likely a noise artifact
  if (durationSeconds > 0 && durationSeconds < 0.8 && rawWords.length > 5) {
    return {
      isValid: false,
      reason: "REPETITIVE_NOISE",
      message: "Anomalía de audio detectada. Intenta grabar de nuevo tu respuesta.",
      cleanTranscript: clean,
    };
  }

  // 9. Distinct word count check
  const distinctWords = new Set(rawWords);
  if (distinctWords.size < 3) {
    return {
      isValid: false,
      reason: "INSUFFICIENT_WORDS",
      message: "Tu respuesta es muy breve. Por favor proporciona una respuesta más estructurada en inglés.",
      cleanTranscript: clean,
    };
  }

  return {
    isValid: true,
    cleanTranscript: clean,
  };
}

export interface LiveSpeechCheckResult {
  isSpanishOrFiller: boolean;
  reason?: "SPANISH_DETECTED" | "NON_INTERVIEW_FILLER" | undefined;
  message?: string | undefined;
}

/**
 * Fast real-time pre-flight screener executed on every Web Speech recognition tick.
 * Automatically halts microphone if Spanish or translation filler phrases are detected live.
 */
export function detectLiveSpanishOrFiller(text: string | null | undefined): LiveSpeechCheckResult {
  if (!text || typeof text !== "string") {
    return { isSpanishOrFiller: false };
  }

  const clean = text.trim();
  if (!clean) return { isSpanishOrFiller: false };

  const lower = clean.toLowerCase();
  const normalized = lower
    .replace(/^[^a-z0-9áéíóúñ]+|[^a-z0-9áéíóúñ]+$/g, "")
    .trim();

  // 1. Check non-interview filler patterns (e.g. "if you could help me please")
  for (const pattern of NON_INTERVIEW_FILLER_PATTERNS) {
    if (pattern.test(normalized) || pattern.test(clean)) {
      return {
        isSpanishOrFiller: true,
        reason: "NON_INTERVIEW_FILLER",
        message: "Por favor responde directamente a la pregunta técnica en inglés.",
      };
    }
  }

  // 2. Check Spanish diacritics
  if (/[áéíóúñ¿¡]/.test(lower)) {
    return {
      isSpanishOrFiller: true,
      reason: "SPANISH_DETECTED",
      message: "Detectamos que estás hablando en español. El micrófono se ha pausado. Por favor habla en inglés para practicar tu entrevista.",
    };
  }

  // 3. Check Spanish words in live stream
  const rawWords = lower
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9áéíóúñ]/g, ""))
    .filter((w) => w.length > 0);

  if (rawWords.length === 0) {
    return { isSpanishOrFiller: false };
  }

  let spanishCount = 0;
  for (const word of rawWords) {
    if (SPANISH_MARKERS.has(word)) {
      spanishCount++;
    }
  }

  // If live phrase has genuine Spanish markers (e.g. "hola", "yo quiero decir")
  if (
    (rawWords.length <= 2 && spanishCount >= 1) ||
    (rawWords.length > 2 && spanishCount >= 2 && spanishCount / rawWords.length >= 0.25)
  ) {
    return {
      isSpanishOrFiller: true,
      reason: "SPANISH_DETECTED",
      message: "Detectamos que estás hablando en español. El micrófono se ha pausado. Por favor habla en inglés para practicar tu entrevista.",
    };
  }

  return { isSpanishOrFiller: false };
}

