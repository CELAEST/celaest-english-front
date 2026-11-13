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
  const status = typeof err?.status === "number" ? err.status : undefined;
  const fullErr = `${errMsg} ${errDetails} ${errCode}`;

  const mentionsApiKey =
    errCode === "auth_declined_key" ||
    fullErr.includes("auth_declined") ||
    fullErr.includes("invalid_api_key") ||
    fullErr.includes("invalid key") ||
    fullErr.includes("incorrect api key") ||
    fullErr.includes("api key");

  let errorType: AiApiErrorType = "rate-limit-429";

  if (
    errCode === "jwt_expired" ||
    errCode === "authentication_required" ||
    errCode === "jwt_session_refresh" ||
    (errCode === "unauthorized" && !mentionsApiKey) ||
    (status === 401 && !mentionsApiKey) ||
    (fullErr.includes("jwt") && (fullErr.includes("expired") || fullErr.includes("expir")))
  ) {
    errorType = "jwt-expired-mid-interview";
  } else if (
    err?.code === "AUTH_DECLINED_KEY" ||
    status === 422 ||
    status === 401 ||
    mentionsApiKey ||
    fullErr.includes("unauthorized")
  ) {
    errorType = "invalid-key-401";
  } else if (
    err?.code === "RATE_LIMIT_COOLDOWN" ||
    status === 429 ||
    fullErr.includes("429") ||
    fullErr.includes("rate limit") ||
    fullErr.includes("rate_limit")
  ) {
    errorType = "rate-limit-429";
  } else if (
    err?.code === "AI_KEYS_EXHAUSTED" ||
    err?.code === "AI_QUOTA_EXHAUSTED" ||
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
    err?.code === "GATEWAY_TIMEOUT" ||
    status === 504 ||
    fullErr.includes("504") ||
    fullErr.includes("timeout") ||
    fullErr.includes("tiempo de espera") ||
    fullErr.includes("abort")
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
