/**
 * Shared Error Scenario Constants for AI Infrastructure Recovery.
 *
 * Extracted from AiEngineErrorsLuxuryStudio.tsx so that features like
 * Conversation, Writing, and Reading can import the data without pulling
 * the 1,200-line Lab showcase into the main bundle.
 */

export type SimulationCategory = "all" | "infra" | "acoustic" | "security";

export type AiApiErrorType =
  // 1. Infraestructura & Proveedores de IA
  | "rate-limit-429"
  | "keys-exhausted-pool"
  | "invalid-key-401"
  | "gateway-timeout-504"
  | "server-outage-503"
  // 2. Acústica & Hardware (Audio / Whisper)
  | "mic-blocked-permission"
  | "silence-ambient-hallucination"
  // 3. Seguridad & Sesión
  | "jwt-expired-mid-interview";

export interface ErrorScenarioData {
  id: AiApiErrorType;
  category: SimulationCategory;
  categoryLabel: string;
  httpLabel: string;
  codeName: string;
  humanHeadline: string;
  humanSubtext: string;
  reassurance: string;
  cooldownDefault: number;
  bufferWords: number;
  dial1Label: string;
  dial1Value: string;
  dial1Subtext: string;
  dial2Label: string;
  dial2Value: string;
  dial2Subtext: string;
  specialActionType?:
    "provider-swap" | "mic-test" | "resume-english" | "star-expand" | "celebrate" | "re-auth";
}

export function getDynamicUtcResetText(): string {
  const now = new Date();
  const nextUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0),
  );
  const diffMs = nextUtc.getTime() - now.getTime();
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  return `Reinicio de cuota en ${hours}h ${minutes}m (UTC 00:00)`;
}

export const ERROR_DATA: Record<AiApiErrorType, ErrorScenarioData> = {
  "rate-limit-429": {
    id: "rate-limit-429",
    category: "infra",
    categoryLabel: "Pausa Momentánea",
    httpLabel: "Espera",
    codeName: "RATE_LIMIT_COOLDOWN",
    humanHeadline: "Un momento: la Inteligencia Artificial necesita unos segundos",
    humanSubtext:
      "Hay muchas personas practicando al mismo tiempo. El sistema se reanudará automáticamente en unos segundos.",
    reassurance: "Tu respuesta está 100% guardada. No tienes que volver a hablar ni a escribir.",
    cooldownDefault: 12,
    bufferWords: 48,
    dial1Label: "TU RESPUESTA",
    dial1Value: "GUARDADA",
    dial1Subtext: "Segura en tu pantalla",
    dial2Label: "CONTINUARÁ EN",
    dial2Value: "seg",
    dial2Subtext: "Automático sin tocar nada",
    specialActionType: "provider-swap",
  },
  "keys-exhausted-pool": {
    id: "keys-exhausted-pool",
    category: "infra",
    categoryLabel: "Saldo Agotado",
    httpLabel: "Sin Saldo",
    codeName: "AI_KEYS_EXHAUSTED",
    humanHeadline: "Tu proveedor de IA no tiene saldo disponible",
    humanSubtext:
      "La clave es correcta, pero tu cuenta no tiene saldo para generar respuestas. Puedes cambiar a Groq (100% gratis) con 1 clic para seguir practicando de inmediato.",
    reassurance:
      "Tu avance está totalmente a salvo. Solo elige una opción gratuita para continuar sin costo.",
    cooldownDefault: 0,
    bufferWords: 52,
    dial1Label: "TU PROGRESO",
    dial1Value: "A SALVO",
    dial1Subtext: "No perdiste nada",
    dial2Label: "OPCIÓN RECOMENDADA",
    dial2Value: "GROQ GRATIS",
    dial2Subtext: "Sin tarjeta ni pagos",
    specialActionType: "provider-swap",
  },
  "invalid-key-401": {
    id: "invalid-key-401",
    category: "infra",
    categoryLabel: "Revisar Clave",
    httpLabel: "Clave",
    codeName: "AUTH_DECLINED",
    humanHeadline: "La clave que ingresaste no fue reconocida",
    humanSubtext:
      "Puede que falte copiar algún número o letra. Puedes revisarla o cambiar a Groq gratis para no complicarte.",
    reassurance: "Tu sesión sigue abierta y lo que llevas hecho no se ha borrado.",
    cooldownDefault: 0,
    bufferWords: 42,
    dial1Label: "ESTADO",
    dial1Value: "REVISAR",
    dial1Subtext: "Clave incompleta",
    dial2Label: "MÁS FÁCIL",
    dial2Value: "GROQ GRATIS",
    dial2Subtext: "Funciona de una vez",
    specialActionType: "provider-swap",
  },
  "gateway-timeout-504": {
    id: "gateway-timeout-504",
    category: "infra",
    categoryLabel: "Conexión Lenta",
    httpLabel: "Tiempo",
    codeName: "GATEWAY_TIMEOUT",
    humanHeadline: "La respuesta tardó un poco más de lo normal",
    humanSubtext:
      "Tu conexión o el servidor tuvieron una pequeña demora, pero todo lo que hiciste sigue intacto en tu pantalla.",
    reassurance: "No perdiste ninguna palabra ni ningún segundo de audio.",
    cooldownDefault: 8,
    bufferWords: 34,
    dial1Label: "TU TEXTO / VOZ",
    dial1Value: "INTACTO",
    dial1Subtext: "Cero pérdidas",
    dial2Label: "ESTADO",
    dial2Value: "RECONECTANDO",
    dial2Subtext: "Reintento automático",
    specialActionType: "provider-swap",
  },
  "server-outage-503": {
    id: "server-outage-503",
    category: "infra",
    categoryLabel: "Mantenimiento",
    httpLabel: "Pausa",
    codeName: "CLUSTER_OUTAGE",
    humanHeadline: "El servidor de IA está en mantenimiento temporal",
    humanSubtext:
      "El proveedor está actualizando sus sistemas. Puedes cambiar de proveedor con 1 clic para continuar ya mismo sin esperar.",
    reassurance:
      "No necesitas volver a hablar ni escribir; tu respuesta se evaluará con el nuevo proveedor.",
    cooldownDefault: 15,
    bufferWords: 55,
    dial1Label: "TU PRÁCTICA",
    dial1Value: "CONSERVADA",
    dial1Subtext: "Lista para evaluar",
    dial2Label: "SOLUCIÓN",
    dial2Value: "CAMBIAR IA",
    dial2Subtext: "1 clic y sigues",
    specialActionType: "provider-swap",
  },
  "mic-blocked-permission": {
    id: "mic-blocked-permission",
    category: "acoustic",
    categoryLabel: "Micrófono",
    httpLabel: "Permiso",
    codeName: "MIC_PERMISSION_DENIED",
    humanHeadline: "El micrófono está apagado o sin permiso",
    humanSubtext:
      "Tu navegador necesita tu permiso para escucharte. Toca el ícono del candado en la barra superior de tu navegador y activa el micrófono.",
    reassurance:
      "No tienes que reiniciar nada: apenas des el permiso, el sistema lo detectará solo.",
    cooldownDefault: 0,
    bufferWords: 0,
    dial1Label: "MICRÓFONO",
    dial1Value: "SIN PERMISO",
    dial1Subtext: "Revisa tu navegador",
    dial2Label: "CÓMO ACTIVARLO",
    dial2Value: "ÍCONO CANDADO",
    dial2Subtext: "Arriba a la izquierda",
    specialActionType: "mic-test",
  },
  "silence-ambient-hallucination": {
    id: "silence-ambient-hallucination",
    category: "acoustic",
    categoryLabel: "Audio Bajo",
    httpLabel: "Voz",
    codeName: "SILENCE_FILTERED",
    humanHeadline: "No se alcanzó a escuchar tu voz con claridad",
    humanSubtext:
      "El micrófono solo captó silencio o ruido del entorno. Intenta hablar un poco más cerca y con volumen normal.",
    reassurance:
      "Esto no afecta tus notas ni tu nivel. Puedes intentarlo de nuevo tranquilamente.",
    cooldownDefault: 0,
    bufferWords: 0,
    dial1Label: "TU VOZ",
    dial1Value: "MUY BAJA",
    dial1Subtext: "Solo ruido de fondo",
    dial2Label: "CALIFICACIÓN",
    dial2Value: "INTACTA",
    dial2Subtext: "Prueba otra vez",
    specialActionType: "mic-test",
  },
  "jwt-expired-mid-interview": {
    id: "jwt-expired-mid-interview",
    category: "security",
    categoryLabel: "Sesión",
    httpLabel: "Sesión",
    codeName: "JWT_SESSION_REFRESH",
    humanHeadline: "Actualizando tu sesión para proteger tu avance",
    humanSubtext:
      "Tu tiempo de acceso se renovó de forma segura sin borrar ninguna de tus respuestas.",
    reassurance:
      "Todo tu progreso está guardado y continúas exactamente donde estabas.",
    cooldownDefault: 0,
    bufferWords: 76,
    dial1Label: "TU PROGRESO",
    dial1Value: "GUARDADO",
    dial1Subtext: "Cero pérdida de datos",
    dial2Label: "SESIÓN",
    dial2Value: "ACTIVA",
    dial2Subtext: "Protegida y lista",
    specialActionType: "re-auth",
  },
};
