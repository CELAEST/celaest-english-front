export interface WordEvaluation {
  token: string;
  spokenToken?: string | undefined;
  status: "correct" | "near_miss" | "mispronounced" | "omitted" | "extra";
  similarity: number;
  phoneticHint?: string | undefined;
}

export interface MispronouncedDetail {
  word: string;
  heardAs: string;
  tip: string;
}

export interface PronunciationEvaluationResult {
  overallScore: number;
  accuracyScore: number;
  completenessScore: number;
  fluencyScore: number;
  passed: boolean;
  wordEvaluations: WordEvaluation[];
  omittedWords: string[];
  mispronouncedWords: MispronouncedDetail[];
  extraWords: string[];
  spokenTranscript: string;
  targetSentence: string;
  feedbackSpanish: string;
  coachingActionSpanish: string;
  primaryGap: string;
}

const COMMON_L1_TRAPS: Record<string, { pattern: RegExp; tip: string }> = {
  sCluster: {
    pattern: /^e[s][a-z]+/i,
    tip: "Evita añadir una 'e' antes de la 's'. Empieza directo con el siseo: /ss/.",
  },
  bInsteadOfV: {
    pattern: /^b[a-z]+/i,
    tip: "En 'v', los dientes superiores tocan suavemente el labio inferior, no juntes ambos labios.",
  },
  dInsteadOfTh: {
    pattern: /^d[a-z]+/i,
    tip: "En 'th', la punta de la lengua va entre los dientes con un soplo suave.",
  },
};

export class PathwayPronunciationEngine {
  public static cleanToken(raw: string): string {
    return raw
      .toLowerCase()
      .replace(/[\u00ab\u00bb\u201c\u201d\u2018\u2019"'\`.,!?;:()\[\]{}]/g, "")
      .trim();
  }

  public static tokenize(sentence: string): string[] {
    return sentence
      .split(/\s+/)
      .map(this.cleanToken)
      .filter((t) => t.length > 0);
  }

  public static levenshtein(a: string, b: string): number {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;

    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0]![j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i]![j] = matrix[i - 1]![j - 1]!;
        } else {
          matrix[i]![j] = Math.min(
            matrix[i - 1]![j - 1]! + 1,
            matrix[i]![j - 1]! + 1,
            matrix[i - 1]![j]! + 1,
          );
        }
      }
    }
    return matrix[b.length]![a.length]!;
  }

  public static calculateWordSimilarity(target: string, spoken: string): number {
    if (target === spoken) return 1.0;
    const maxLen = Math.max(target.length, spoken.length);
    if (maxLen === 0) return 1.0;
    const dist = this.levenshtein(target, spoken);
    const rawSim = 1.0 - dist / maxLen;
    return Math.max(0, Math.min(1, rawSim));
  }

  public static evaluate(targetSentence: string, spokenTranscript: string): PronunciationEvaluationResult {
    const rawTarget = targetSentence.trim();
    const rawSpoken = spokenTranscript.trim();

    const targetTokens = this.tokenize(rawTarget);
    const spokenTokens = this.tokenize(rawSpoken);

    if (targetTokens.length === 0) {
      return this.emptyResult(rawTarget, rawSpoken);
    }

    if (spokenTokens.length === 0) {
      return this.silenceResult(rawTarget, targetTokens);
    }

    const wordEvaluations: WordEvaluation[] = [];
    const omittedWords: string[] = [];
    const mispronouncedWords: MispronouncedDetail[] = [];
    const usedSpokenIndices = new Set<number>();

    // 1. Direct Alignment and Fuzzy Matching
    for (let tIdx = 0; tIdx < targetTokens.length; tIdx++) {
      const target = targetTokens[tIdx]!;
      let bestMatchIdx = -1;
      let highestSim = 0;

      // Look in window around current target position
      for (let sIdx = 0; sIdx < spokenTokens.length; sIdx++) {
        if (usedSpokenIndices.has(sIdx)) continue;
        const spoken = spokenTokens[sIdx]!;
        const sim = this.calculateWordSimilarity(target, spoken);
        if (sim > highestSim) {
          highestSim = sim;
          bestMatchIdx = sIdx;
        }
      }

      if (highestSim >= 0.88 && bestMatchIdx !== -1) {
        usedSpokenIndices.add(bestMatchIdx);
        wordEvaluations.push({
          token: target,
          spokenToken: spokenTokens[bestMatchIdx],
          status: "correct",
          similarity: 1.0,
        });
      } else if (highestSim >= 0.65 && bestMatchIdx !== -1) {
        usedSpokenIndices.add(bestMatchIdx);
        const heardAs = spokenTokens[bestMatchIdx]!;
        const tip = this.detectPhoneticTip(target, heardAs);
        mispronouncedWords.push({ word: target, heardAs, tip });
        wordEvaluations.push({
          token: target,
          spokenToken: heardAs,
          status: "near_miss",
          similarity: highestSim,
          phoneticHint: tip,
        });
      } else if (highestSim >= 0.40 && bestMatchIdx !== -1) {
        usedSpokenIndices.add(bestMatchIdx);
        const heardAs = spokenTokens[bestMatchIdx]!;
        const tip = this.detectPhoneticTip(target, heardAs);
        mispronouncedWords.push({ word: target, heardAs, tip });
        wordEvaluations.push({
          token: target,
          spokenToken: heardAs,
          status: "mispronounced",
          similarity: highestSim,
          phoneticHint: tip,
        });
      } else {
        omittedWords.push(target);
        wordEvaluations.push({
          token: target,
          status: "omitted",
          similarity: 0,
          phoneticHint: "Palabra no detectada en tu audio.",
        });
      }
    }

    // 2. Extra tokens detection
    const extraWords: string[] = [];
    for (let sIdx = 0; sIdx < spokenTokens.length; sIdx++) {
      if (!usedSpokenIndices.has(sIdx)) {
        extraWords.push(spokenTokens[sIdx]!);
      }
    }

    // 3. Mathematical Psychometric Scores
    const totalWords = targetTokens.length;
    const matchedCount = wordEvaluations.filter((w) => w.status === "correct" || w.status === "near_miss").length;
    const completenessScore = Math.round((matchedCount / totalWords) * 100);

    const sumSimilarities = wordEvaluations.reduce((acc, w) => acc + w.similarity, 0);
    const accuracyScore = Math.round((sumSimilarities / totalWords) * 100);

    // Fluency score penalizes massive extra word clutter or extreme word fragmentation
    const extraPenalty = Math.min(25, extraWords.length * 5);
    const fluencyScore = Math.max(20, Math.round(accuracyScore * 0.9 - extraPenalty));

    const overallScore = Math.max(10, Math.min(100, Math.round(accuracyScore * 0.6 + completenessScore * 0.3 + fluencyScore * 0.1)));
    const passed = overallScore >= 80 && completenessScore >= 80 && omittedWords.length === 0;

    // 4. Constructive Spoken Feedback for Liam
    const { feedbackSpanish, coachingActionSpanish, primaryGap } = this.buildFeedback({
      passed,
      overallScore,
      omittedWords,
      mispronouncedWords,
      targetSentence: rawTarget,
    });

    return {
      overallScore,
      accuracyScore,
      completenessScore,
      fluencyScore,
      passed,
      wordEvaluations,
      omittedWords,
      mispronouncedWords,
      extraWords,
      spokenTranscript: rawSpoken,
      targetSentence: rawTarget,
      feedbackSpanish,
      coachingActionSpanish,
      primaryGap,
    };
  }

  private static detectPhoneticTip(target: string, heard: string): string {
    if (target.startsWith("s") && heard.startsWith("es")) {
      return COMMON_L1_TRAPS.sCluster!.tip;
    }
    if (target.startsWith("v") && heard.startsWith("b")) {
      return COMMON_L1_TRAPS.bInsteadOfV!.tip;
    }
    if (target.includes("th") && (heard.includes("d") || heard.includes("t"))) {
      return COMMON_L1_TRAPS.dInsteadOfTh!.tip;
    }
    return `Pronuncia con calma: [${target}]. Cuida cada sílaba.`;
  }

  private static buildFeedback(params: {
    passed: boolean;
    overallScore: number;
    omittedWords: string[];
    mispronouncedWords: MispronouncedDetail[];
    targetSentence: string;
  }): { feedbackSpanish: string; coachingActionSpanish: string; primaryGap: string } {
    const { passed, omittedWords, mispronouncedWords, targetSentence } = params;

    if (passed) {
      return {
        feedbackSpanish: "¡Excelente pronunciación! Dijiste cada palabra en orden natural y con cadencia limpia. Base conquistada.",
        coachingActionSpanish: "Sigue manteniendo ese ritmo constante sin pausar entre sujeto y verbo.",
        primaryGap: "",
      };
    }

    if (omittedWords.length > 0) {
      const omittedList = omittedWords.map((w) => `“${w}”`).join(", ");
      return {
        feedbackSpanish: `Casi lo tienes, pero te comiste ${omittedWords.length === 1 ? "una palabra" : "algunas palabras"}: ${omittedList}. Escúchame de nuevo y dilas todas completas.`,
        coachingActionSpanish: `Asegúrate de vocalizar todas las piezas de la frase, especialmente ${omittedList}.`,
        primaryGap: "Palabras omitidas en la pronunciación",
      };
    }

    if (mispronouncedWords.length > 0) {
      const first = mispronouncedWords[0]!;
      return {
        feedbackSpanish: `Buen intento, pero ojo con “${first.word}”: sonó como “${first.heardAs}”. ${first.tip} Repite conmigo la frase completa.`,
        coachingActionSpanish: `Practica la articulación de “${first.word}”. ${first.tip}`,
        primaryGap: `Articulación de ${first.word}`,
      };
    }

    return {
      feedbackSpanish: `Tu pronunciación necesita un poco más de claridad para alcanzar la certificación. Escúchame decir: “${targetSentence}” y repítela conmigo.`,
      coachingActionSpanish: "Pronuncia a velocidad moderada proyectando la voz hacia el micrófono.",
      primaryGap: "Claridad acústica insuficiente",
    };
  }

  private static emptyResult(target: string, spoken: string): PronunciationEvaluationResult {
    return {
      overallScore: 0,
      accuracyScore: 0,
      completenessScore: 0,
      fluencyScore: 0,
      passed: false,
      wordEvaluations: [],
      omittedWords: [],
      mispronouncedWords: [],
      extraWords: [],
      spokenTranscript: spoken,
      targetSentence: target,
      feedbackSpanish: "No se proporcionó una frase objetivo válida para evaluar.",
      coachingActionSpanish: "Selecciona una lección válida.",
      primaryGap: "Frase objetivo vacía",
    };
  }

  private static silenceResult(target: string, targetTokens: string[]): PronunciationEvaluationResult {
    return {
      overallScore: 20,
      accuracyScore: 0,
      completenessScore: 0,
      fluencyScore: 20,
      passed: false,
      wordEvaluations: targetTokens.map((t) => ({
        token: t,
        status: "omitted" as const,
        similarity: 0,
        phoneticHint: "No se detectó audio.",
      })),
      omittedWords: targetTokens,
      mispronouncedWords: [],
      extraWords: [],
      spokenTranscript: "",
      targetSentence: target,
      feedbackSpanish: "No te escuché hablar. Toca el micrófono de nuevo y di la frase con voz clara.",
      coachingActionSpanish: "Permite el acceso al micrófono y pronuncia la frase completa en voz alta.",
      primaryGap: "Audio ausente o inaudible",
    };
  }
}
