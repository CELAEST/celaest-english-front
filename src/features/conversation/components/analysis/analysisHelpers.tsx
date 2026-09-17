import React from "react";
import { ComprehensiveTurnFeedback } from "../../services/masterAiFeedbackEngine";
import { sanitizeFeedbackTone } from "../../services/coreAiEvaluatorService";

export const WAVEFORM_BARS = [
  3, 4, 6, 14, 20, 12, 6, 4, 4, 8, 18, 24, 22, 16, 10, 6, 4, 6, 12, 20, 24, 22, 14, 8, 6, 4, 10, 18,
  22, 16, 8, 4, 6, 12, 20, 22, 14, 6, 4, 4, 8, 16, 20, 14, 8, 4, 6, 12, 18, 14, 8, 4, 6, 14, 22, 18,
  10, 6, 4, 6, 10, 16, 12, 8, 4, 4, 6, 12, 18, 14, 8, 4, 4, 6, 12, 16, 10, 6, 4, 4, 6, 12, 18, 22,
  16, 8, 4, 4, 6, 10, 6, 4, 3,
];

export const formatPlaybackTime = (sec: number): string => {
  if (!Number.isFinite(sec) || isNaN(sec) || sec <= 0) return "00:00";
  const safeSec = Math.floor(sec);
  const m = Math.floor(safeSec / 60);
  const s = Math.floor(safeSec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export interface ParsedRecommendation {
  intro: string;
  steps: { num: number; text: string }[];
  spokenExample: string;
  practiceTip: string;
}

export function parseRecommendation(raw: string): ParsedRecommendation {
  if (!raw || typeof raw !== "string") {
    return { intro: "", steps: [], spokenExample: "", practiceTip: "" };
  }

  let cleaned = raw.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  let practiceTip = "";
  const tipMatch = cleaned.match(/(Practica(?:\s+diciendo)?\s+[^.]+\.?)$/i);
  if (tipMatch && tipMatch.index !== undefined) {
    practiceTip = tipMatch[1].trim();
    cleaned = cleaned.slice(0, tipMatch.index).trim();
  }

  let spokenExample = "";
  const exampleMatch = cleaned.match(
    /(?:Ejemplo\s+en\s+voz\s+alta|Dilo\s+en\s+voz\s+alta|Ejemplo)\s*:\s*([\s\S]+)$/i,
  );
  if (exampleMatch && exampleMatch.index !== undefined) {
    spokenExample = exampleMatch[1].trim().replace(/^["'\s]+|["'\s]+$/g, "");
    cleaned = cleaned.slice(0, exampleMatch.index).trim();
  }

  const stepRegex = /(?:^|\s)(\d+)[\.\)]\s*(["']?[^0-9\n]+?["']?)(?=(?:\s+\d+[\.\)]|$))/g;
  const steps: { num: number; text: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = stepRegex.exec(cleaned)) !== null) {
    const num = parseInt(match[1], 10);
    const stepText = match[2].trim().replace(/^["']|["']$/g, "").trim();
    if (stepText.length > 0) {
      steps.push({ num, text: stepText });
    }
  }

  if (steps.length === 0) {
    const templateMatch = cleaned.match(/['"]([^'"]*\[[^'"]+\][^'"]*)['"]/);
    if (templateMatch) {
      steps.push({ num: 1, text: templateMatch[1].trim() });
    }
  }

  let intro = cleaned;
  if (steps.length > 0) {
    const firstStepIndex = cleaned.search(/(?:^|\s)1[\.\)]/);
    if (firstStepIndex !== -1) {
      intro = cleaned.slice(0, firstStepIndex).trim();
    } else if (steps[0]) {
      const templateIndex = cleaned.indexOf(steps[0].text);
      if (templateIndex > 0) {
        intro = cleaned.slice(0, templateIndex).replace(/['"]\s*$/, "").trim();
      }
    }
  }

  intro = intro.replace(/^Paso\s+a\s+paso\s*:\s*/i, "").trim();
  return { intro, steps, spokenExample, practiceTip };
}

export function renderHighlightedTokens(text: string): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((part, idx) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      return (
        <span
          key={idx}
          className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-white/[0.08] text-white font-mono text-[11px] border border-white/[0.1] font-medium tracking-tight"
        >
          {part}
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export function TopHighlight() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_18%)]"
    />
  );
}

export function cleanRuleNote(explanation?: string, fallback?: string): string {
  const target = explanation?.trim() || fallback?.trim() || "";
  if (!target) return "";

  let text = target;
  if (/[\u{1F4A1}]/u.test(text)) {
    const parts = text
      .split(/[\u{1F4A1}]/u)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 1) {
      text = parts[parts.length - 1];
    } else if (parts.length === 1) {
      text = parts[0];
    }
  }

  text = text.replace(/^(Regla|Nota|Tip|Consejo)\s*:\s*/i, "").trim();
  const cleaned = text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
  return sanitizeFeedbackTone(cleaned);
}

export function getDynamicInsight(feedback: ComprehensiveTurnFeedback): string {
  if (
    feedback.strategicFeedback?.explanation &&
    feedback.strategicFeedback.explanation.trim().length > 10
  ) {
    return sanitizeFeedbackTone(feedback.strategicFeedback.explanation.trim());
  }

  const strengths = feedback.keyStrengths?.filter(Boolean) || [];
  const errors = feedback.unclearOrErrorWords || [];

  if (strengths.length > 0) {
    const citedStrengths = strengths
      .slice(0, 2)
      .map((s) => `'${s}'`)
      .join(" y ");
    if (errors.length === 0) {
      return `Articulaste tus ideas con fluidez y destacaste al integrar ${citedStrengths}, proyectando un perfil seguro y estructurado.`;
    }
    return `Identificamos conceptos valiosos en tu respuesta como ${citedStrengths}. Se detectaron ${errors.length} oportunidades de estructura para conectar aún mejor tus oraciones.`;
  }

  if (errors.length === 0) {
    return "Demostraste una respuesta concisa, natural y sin errores léxicos ni gramaticales para esta pregunta.";
  }

  return `Identificamos tu iniciativa comunicativa y ${errors.length} puntos clave de gramática y vocabulario para consolidar tu estructura en las siguientes tomas.`;
}

export function getDynamicRecommendation(feedback: ComprehensiveTurnFeedback): string {
  if (
    feedback.strategicFeedback?.recommendation &&
    feedback.strategicFeedback.recommendation.trim().length > 10
  ) {
    return sanitizeFeedbackTone(feedback.strategicFeedback.recommendation.trim());
  }

  if (feedback.tipsForNextTurn && feedback.tipsForNextTurn.trim().length > 10) {
    return sanitizeFeedbackTone(feedback.tipsForNextTurn.trim());
  }

  const errors = feedback.unclearOrErrorWords || [];
  const hasFalseCognates = errors.some(
    (e) =>
      e.errorType === "VOCABULARY" ||
      e.explanation.toLowerCase().includes("falso amigo") ||
      e.explanation.toLowerCase().includes("cognado"),
  );

  if (hasFalseCognates) {
    return "Paso a paso: Presta atención a los falsos cognados señalados abajo (ej. attend vs assist, summarize vs resume) para garantizar máxima precisión y naturalidad.";
  }

  if (errors.length > 0) {
    return "Paso a paso: Para tu próxima respuesta, concéntrate en conectar oraciones cortas con el modelo STAR y apóyate en los términos sugeridos en las tarjetas inferiores.";
  }

  return "Mantén esta cadencia ejecutiva. Para respuestas de liderazgo de mayor calibre, cuantifica el impacto en negocio (ROI, % de adopción o tiempos de entrega).";
}

export const getTierLabel = (score: number): string => {
  if (score >= 90) return "Nivel Experto";
  if (score >= 80) return "Nivel Avanzado";
  if (score >= 70) return "Nivel Competente";
  return "En Desarrollo";
};

export interface ScoreGaugeProps {
  value: number;
  from: string;
  to: string;
  id: string;
  glowColor?: string;
  size?: number;
  stroke?: number;
}

export function ScoreGauge({
  value,
  from,
  to,
  id,
  size = 80,
  stroke = 5.5,
}: ScoreGaugeProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.min(100, Math.max(0, value));
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#141528"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
        <span className="text-[20px] font-bold text-white tracking-tight tabular-nums leading-none">
          {Math.round(safeValue)}
        </span>
        <span className="text-[10px] font-medium text-[#8a8a9e] leading-none mt-0.5">
          /100
        </span>
      </div>
    </div>
  );
}
