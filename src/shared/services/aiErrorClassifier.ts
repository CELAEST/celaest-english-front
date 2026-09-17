import {
  AiApiErrorType,
  ErrorScenarioData,
  ERROR_DATA,
} from "../constants/errorScenarios";

export interface ClassifiedAiError {
  errorType: AiApiErrorType;
  scenario: ErrorScenarioData;
  cooldownSeconds: number;
}

/**
 * Classifies an unexpected error thrown by AI service providers into standard
 * recovery scenarios (401 invalid key, 429 rate limit, 504 timeout, 503 outage,
 * or pool exhaustion).
 */
export function classifyAiError(err: any): ClassifiedAiError {
  const errMsg = String(err?.message || err || "").toLowerCase();
  const errDetails = String(err?.rawErrorDetails || err?.details || "").toLowerCase();
  const errCode = String(err?.code || "").toLowerCase();
  const fullErr = `${errMsg} ${errDetails} ${errCode}`;

  let errorType: AiApiErrorType = "rate-limit-429";

  if (
    err?.code === "AUTH_DECLINED_KEY" ||
    fullErr.includes("401") ||
    fullErr.includes("auth_declined") ||
    fullErr.includes("invalid_api_key") ||
    fullErr.includes("invalid key") ||
    fullErr.includes("unauthorized")
  ) {
    errorType = "invalid-key-401";
  } else if (
    err?.code === "AI_KEYS_EXHAUSTED" ||
    fullErr.includes("exhausted") ||
    fullErr.includes("cooldown") ||
    fullErr.includes("all keys") ||
    fullErr.includes("pool") ||
    fullErr.includes("sin saldo") ||
    fullErr.includes("quota") ||
    fullErr.includes("insufficient_quota") ||
    fullErr.includes("ai_error")
  ) {
    errorType = "keys-exhausted-pool";
  } else if (
    err?.code === "RATE_LIMIT_COOLDOWN" ||
    fullErr.includes("429") ||
    fullErr.includes("rate limit") ||
    fullErr.includes("rate_limit")
  ) {
    errorType = "rate-limit-429";
  } else if (
    err?.code === "GATEWAY_TIMEOUT" ||
    fullErr.includes("504") ||
    fullErr.includes("timeout") ||
    fullErr.includes("tiempo de espera")
  ) {
    errorType = "gateway-timeout-504";
  } else {
    errorType = "server-outage-503";
  }

  const baseScenario = ERROR_DATA[errorType] || ERROR_DATA["keys-exhausted-pool"];
  const humanSubtext =
    errorType === "keys-exhausted-pool"
      ? "Todas las claves del clúster de IA completaron su límite o el clúster está inactivo. Puedes activar una clave gratuita de Groq o Gemini para continuar."
      : err?.message &&
          err.message.length > 5 &&
          !err.message.startsWith("[object")
        ? err.message
        : baseScenario.humanSubtext;

  const scenario: ErrorScenarioData = {
    ...baseScenario,
    humanSubtext,
  };

  const cooldownSeconds =
    errorType === "rate-limit-429"
      ? (err?.cooldownSeconds ?? baseScenario.cooldownDefault ?? 45)
      : (baseScenario.cooldownDefault ?? 0);

  return {
    errorType,
    scenario,
    cooldownSeconds,
  };
}
