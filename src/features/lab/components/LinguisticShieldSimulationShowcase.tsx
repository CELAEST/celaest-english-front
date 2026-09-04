import React, { useState } from "react";
import { validateSpeechIntelligibility, detectLiveSpanishOrFiller } from "../../conversation/services/speechIntelligibilityGuard";
import { appToast } from "../../../design-system/components/Toast";

interface PresetTestCase {
  id: string;
  category: string;
  title: string;
  input: string;
  expectedVerdict: "BLOCKED" | "PASSED";
  expectedReason: string;
  notes: string;
}

const PRESET_TEST_CASES: PresetTestCase[] = [
  {
    id: "gibberish-spaces",
    category: "1. Gibberish & Pseudo-palabras con Espacios",
    title: "Multi-Word Short Gibberish (User Example)",
    input: "gergewg r we erg wer er we ewg wer weewr",
    expectedVerdict: "BLOCKED",
    expectedReason: "NONSENSE_OR_GIBBERISH",
    notes: "Short random words with spaces bypass simple regex but get caught by English lexicon ratio < 50%.",
  },
  {
    id: "gibberish-mash",
    category: "1. Gibberish & Pseudo-palabras con Espacios",
    title: "Continuous Keyboard Mash",
    input: "gfrqwegewgerge asdfghjkl qweqwe",
    expectedVerdict: "BLOCKED",
    expectedReason: "NONSENSE_OR_GIBBERISH",
    notes: "Consonant-heavy mashing without natural English phoneme distributions.",
  },
  {
    id: "spanish-greeting",
    category: "2. Español, Acentos & Modismos",
    title: "Spanish Conversational Phrase",
    input: "hola cómo estás hoy necesito que me ayudes con la entrevista",
    expectedVerdict: "BLOCKED",
    expectedReason: "SPANISH_DETECTED",
    notes: "Spanish diacritics and high density of Spanish stopwords.",
  },
  {
    id: "spanish-filler",
    category: "2. Español, Acentos & Modismos",
    title: "Spanish Idiom & Slang",
    input: "vamos por todo en este proyecto de software",
    expectedVerdict: "BLOCKED",
    expectedReason: "SPANISH_DETECTED",
    notes: "Spanish stopwords and conversational intent detected.",
  },
  {
    id: "whisper-silence-1",
    category: "3. Alucinaciones Whisper & Silencios",
    title: "Whisper Static Hallucination ('Thank you')",
    input: "Thank you. Thanks for watching.",
    expectedVerdict: "BLOCKED",
    expectedReason: "WHISPER_HALLUCINATION",
    notes: "Typical Whisper model hallucination when user remains silent with background static.",
  },
  {
    id: "whisper-silence-2",
    category: "3. Alucinaciones Whisper & Silencios",
    title: "Whisper Video Subtitle Artifact",
    input: "Subtitles by the Amara.org community",
    expectedVerdict: "BLOCKED",
    expectedReason: "WHISPER_HALLUCINATION",
    notes: "Common subtitle crawler hallucination from Whisper training data.",
  },
  {
    id: "filler-help",
    category: "4. Frases Meta & Solicitudes de Ayuda",
    title: "Help-seeking Conversational Pleasantry",
    input: "if you could help me please",
    expectedVerdict: "BLOCKED",
    expectedReason: "NON_INTERVIEW_FILLER",
    notes: "Zero technical substance; conversational help request flagged before hitting LLM.",
  },
  {
    id: "filler-repeat",
    category: "4. Frases Meta & Solicitudes de Ayuda",
    title: "Question Repeat Request",
    input: "Hey, I need to do that, please repeat the question",
    expectedVerdict: "BLOCKED",
    expectedReason: "NON_INTERVIEW_FILLER",
    notes: "Meta-talk phrase that should not be evaluated as a technical answer.",
  },
  {
    id: "short-answer",
    category: "5. Respuestas Breves & Spam",
    title: "Single Word Answer",
    input: "yes okay",
    expectedVerdict: "BLOCKED",
    expectedReason: "INSUFFICIENT_WORDS",
    notes: "Less than 3 words cannot provide meaningful grammar or pronunciation metrics.",
  },
  {
    id: "repetitive-spam",
    category: "5. Respuestas Breves & Spam",
    title: "Repetitive Vowel Babble",
    input: "aaaaaaaaaaaaaaaaaaaaa",
    expectedVerdict: "BLOCKED",
    expectedReason: "REPETITIVE_NOISE",
    notes: "Extreme character repetition with zero semantic structure.",
  },
  {
    id: "spanglish-mix",
    category: "6. Spanglish & Mezcla de Idiomas",
    title: "Spanglish Code-Switching",
    input: "I want to hablar sobre mi experiencia de trabajo",
    expectedVerdict: "BLOCKED",
    expectedReason: "SPANISH_DETECTED",
    notes: "Mixed Spanish markers flag the turn and instruct the user to speak purely in English.",
  },
  {
    id: "valid-mid-answer",
    category: "7. Inglés Técnico Válido",
    title: "Valid Mid Engineer Architectural Answer",
    input: "In our microservices architecture, we implemented Redis caching and Envoy proxies to handle 10x traffic spikes with sub-50ms latency.",
    expectedVerdict: "PASSED",
    expectedReason: "VALID",
    notes: "Rich English technical lexicon, correct prepositions, and coherent grammar.",
  },
  {
    id: "valid-staff-answer",
    category: "7. Inglés Técnico Válido",
    title: "Valid Staff Engineer Leadership Answer",
    input: "I led a cross-functional team of twelve engineers to migrate our monolithic PostgreSQL database to an event-driven Kafka architecture.",
    expectedVerdict: "PASSED",
    expectedReason: "VALID",
    notes: "High vocabulary complexity, valid sentence structure, zero tokens wasted on false positives.",
  },
];

export const LinguisticShieldSimulationShowcase: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<PresetTestCase>(PRESET_TEST_CASES[0]);
  const [customText, setCustomText] = useState<string>(PRESET_TEST_CASES[0].input);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const categories = ["ALL", ...Array.from(new Set(PRESET_TEST_CASES.map((c) => c.category)))];

  const filteredPresets =
    activeCategory === "ALL"
      ? PRESET_TEST_CASES
      : PRESET_TEST_CASES.filter((c) => c.category === activeCategory);

  // Live evaluation of current custom text
  const validationResult = validateSpeechIntelligibility(customText);
  const liveSpanishResult = detectLiveSpanishOrFiller(customText);

  const wordCount = customText.trim().split(/\s+/).filter(Boolean).length;

  const handleSelectPreset = (preset: PresetTestCase) => {
    setSelectedPreset(preset);
    setCustomText(preset.input);
  };

  const handleTriggerToast = () => {
    if (!validationResult.isValid) {
      if (validationResult.reason === "SPANISH_DETECTED") {
        appToast.spanishDetected(validationResult.message);
      } else if (validationResult.reason === "NONSENSE_OR_GIBBERISH") {
        appToast.gibberishDetected(validationResult.message);
      } else if (
        validationResult.reason === "WHISPER_HALLUCINATION" ||
        validationResult.reason === "SILENCE_OR_EMPTY"
      ) {
        appToast.ambientNoise(validationResult.message);
      } else {
        appToast.warning("Revisión de Entrada", validationResult.message);
      }
    } else {
      appToast.success(
        "Texto Válido · 100% Inglés Coherente",
        "La respuesta pasó todos los filtros léxicos y está lista para ser evaluada por la IA.",
      );
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6 select-none animate-[fadeIn_0.4s_ease-out]">
      {/* Header Banner */}
      <div className="w-full p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#140a28]/90 via-[#0e0a22]/90 to-[#070514]/90 border border-[#8B5CF6]/30 backdrop-blur-2xl shadow-[0_8px_32px_rgba(112,72,232,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#7048E8]/20 border border-[#A78BFA]/40 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(167,139,250,0.4)]">
            <svg className="w-5 h-5 text-[#C4B5FD]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-wide">
              Linguistic Intelligibility Shield & 0-Token Error Simulator
            </h3>
            <p className="text-xs text-[#8a8a9e]">
              Entorno interactivo para simular todos los casos borde, abuso de tokens, gibberish y modismos en español.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleTriggerToast}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-[#7048E8] to-[#9061F9] hover:from-[#7C3AED] hover:to-[#A855F7] text-white text-xs font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(112,72,232,0.4)] hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Disparar Alerta Ultra-Luxury</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide shrink-0 transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-[#7048E8] text-white border border-[#A78BFA]/50 shadow-[0_0_12px_rgba(112,72,232,0.4)]"
                : "bg-white/[0.04] text-[#8a8a9e] hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Preset Test Scenarios (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-2.5 max-h-[560px] overflow-y-auto no-scrollbar pr-1">
          <span className="text-[11px] font-mono uppercase text-[#A78BFA] tracking-wider font-semibold px-1">
            Casos de Uso & Pruebas Preconfiguradas ({filteredPresets.length})
          </span>
          {filteredPresets.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col space-y-1.5 ${
                  isSelected
                    ? "bg-[#181133] border-[#A78BFA]/60 shadow-[0_0_20px_rgba(112,72,232,0.25)] ring-1 ring-[#A78BFA]/40"
                    : "bg-[#0b0818]/60 hover:bg-[#120e24] border-white/[0.06]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-white tracking-tight truncate">
                    {preset.title}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      preset.expectedVerdict === "BLOCKED"
                        ? "bg-rose-950/60 text-rose-300 border border-rose-500/30"
                        : "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {preset.expectedVerdict === "BLOCKED" ? "0-TOKENS SHIELD" : "VALID ENGLISH"}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-[#8a8a9e] truncate">
                  "{preset.input}"
                </p>
                <span className="text-[10px] text-[#6b6c82] leading-tight">
                  {preset.notes}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Testing Canvas & Diagnostics (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Interactive Textarea Simulator */}
          <div className="p-5 rounded-3xl bg-[#090616]/90 border border-white/[0.08] backdrop-blur-xl flex flex-col space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white tracking-wide flex items-center gap-2">
                <span>Playground de Validación en Tiempo Real</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#A27FF3] animate-pulse" />
              </span>
              <span className="text-[11px] font-mono text-[#8a8a9e]">
                {wordCount} palabras · {customText.length} caracteres
              </span>
            </div>

            <textarea
              rows={4}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Escribe o pega cualquier frase en inglés, español o gibberish para probar el escudo..."
              className="w-full p-3.5 rounded-2xl bg-[#04030a] border border-white/[0.1] text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#A78BFA] transition-colors resize-none font-sans leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#8a8a9e]">
                Edita libremente para probar combinaciones personalizadas
              </span>
              <button
                type="button"
                onClick={() => setCustomText("")}
                className="text-xs text-[#8a8a9e] hover:text-white px-2 py-1 rounded-md hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Real-Time Verdict Card */}
          <div
            className={`p-5 rounded-3xl border backdrop-blur-2xl transition-all shadow-xl flex flex-col space-y-4 ${
              !validationResult.isValid
                ? "bg-gradient-to-b from-[#200b1a]/90 to-[#120710]/90 border-rose-500/35 shadow-[0_8px_32px_rgba(244,63,94,0.15)]"
                : "bg-gradient-to-b from-[#081f14]/90 to-[#04120b]/90 border-emerald-500/35 shadow-[0_8px_32px_rgba(16,185,129,0.15)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    !validationResult.isValid
                      ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                      : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  }`}
                >
                  {!validationResult.isValid ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-white/50 block">
                    Veredicto del Escudo Lingüístico
                  </span>
                  <h4
                    className={`text-sm font-bold tracking-wide ${
                      !validationResult.isValid ? "text-rose-200" : "text-emerald-200"
                    }`}
                  >
                    {!validationResult.isValid
                      ? `BLOQUEADO (0 TOKENS) · ${validationResult.reason}`
                      : "APROBADO · 100% INGLÉS COHERENTE"}
                  </h4>
                </div>
              </div>

              <span
                className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${
                  !validationResult.isValid
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}
              >
                Tokens a IA: 0
              </span>
            </div>

            {/* Message Explanation */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] text-xs text-white/90 leading-relaxed select-text">
              <span className="text-white/40 block mb-1 font-mono text-[10px] uppercase tracking-wider">
                Mensaje de Feedback al Usuario:
              </span>
              {validationResult.message || "Entrada validada correctamente. Procediendo a evaluación con IA Mesh."}
            </div>

            {/* Diagnostic Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04] flex flex-col">
                <span className="text-[10px] text-[#8a8a9e] font-mono">ESTADO LIVE STREAM</span>
                <span className="text-xs font-semibold text-white mt-0.5">
                  {liveSpanishResult.isSpanishOrFiller ? "Auto-Pausa Mic" : "Activo"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04] flex flex-col">
                <span className="text-[10px] text-[#8a8a9e] font-mono">CATEGORÍA REASON</span>
                <span className="text-xs font-semibold text-[#A78BFA] mt-0.5 truncate">
                  {validationResult.reason || "VALID"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04] flex flex-col">
                <span className="text-[10px] text-[#8a8a9e] font-mono">PALABRAS</span>
                <span className="text-xs font-semibold text-white mt-0.5">
                  {wordCount} palabras
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.04] flex flex-col">
                <span className="text-[10px] text-[#8a8a9e] font-mono">IDEMPOTENCIA</span>
                <span className="text-xs font-semibold text-emerald-400 mt-0.5">
                  Protegida
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
