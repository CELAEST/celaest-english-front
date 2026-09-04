import React from "react";
import { toast as sonnerToast } from "sonner";

export interface ToastOptions {
  description?: string;
  tag?: string;
  duration?: number;
  accentColor?: string;
}

/**
 * Standardized CELAEST Cyber-Kinetic Laser Toast Builder
 * Pure naked typography + dynamic kinetic laser spectrum beam.
 */
function createCyberKineticToast(
  title: string,
  options: ToastOptions | string | undefined,
  defaultTag: string,
  defaultAccent: string,
  defaultDuration: number,
) {
  const description = typeof options === "string" ? options : options?.description;
  const tag = typeof options === "object" && options?.tag ? options.tag : defaultTag;
  const accentColor = typeof options === "object" && options?.accentColor ? options.accentColor : defaultAccent;
  const duration = typeof options === "object" && options?.duration !== undefined ? options.duration : defaultDuration;

  return sonnerToast.custom(
    (id) =>
      React.createElement(
        "div",
        {
          className:
            "relative w-full sm:w-[410px] max-w-[calc(100vw-32px)] py-3.5 px-4.5 bg-[#030208]/95 backdrop-blur-2xl rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.95),0_0_25px_rgba(112,72,232,0.12)] border border-white/[0.06] select-none font-sans animate-[slideUp_0.3s_ease-out] pointer-events-auto",
        },
        [
          // Top Header Bar
          React.createElement(
            "div",
            {
              key: "header",
              className: "flex items-center justify-between gap-2 mb-1.5",
            },
            [
              React.createElement(
                "div",
                {
                  key: "tag-group",
                  className: "flex items-center gap-2 min-w-0",
                },
                [
                  React.createElement("span", {
                    key: "dot",
                    className: "w-1.5 h-1.5 rounded-full shrink-0 animate-pulse",
                    style: {
                      backgroundColor: accentColor,
                      boxShadow: `0 0 8px ${accentColor}`,
                    },
                  }),
                  React.createElement(
                    "span",
                    {
                      key: "tag-text",
                      className: "text-[10.5px] font-mono tracking-[0.22em] uppercase font-bold truncate",
                      style: { color: accentColor },
                    },
                    tag,
                  ),
                ],
              ),
              React.createElement(
                "button",
                {
                  key: "close-btn",
                  type: "button",
                  onClick: () => sonnerToast.dismiss(id),
                  className:
                    "text-white/30 hover:text-white p-0.5 rounded transition-colors cursor-pointer hover:bg-white/[0.06]",
                  title: "Cerrar",
                  "aria-label": "Cerrar",
                },
                React.createElement(
                  "svg",
                  {
                    className: "w-3.5 h-3.5",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: 2,
                  },
                  [
                    React.createElement("line", { key: "l1", x1: "18", y1: "6", x2: "6", y2: "18" }),
                    React.createElement("line", { key: "l2", x1: "6", y1: "6", x2: "18", y2: "18" }),
                  ],
                ),
              ),
            ],
          ),

          // Title
          React.createElement(
            "h4",
            {
              key: "title",
              className: "text-[13.5px] font-semibold text-white tracking-tight leading-snug",
            },
            title,
          ),

          // Description
          description
            ? React.createElement(
                "p",
                {
                  key: "desc",
                  className: "text-xs text-[#9E9EBD] font-light leading-relaxed mt-1 select-text",
                },
                description,
              )
            : null,

          // Kinetic Laser Line Underneath
          React.createElement("div", {
            key: "laser-line",
            className: "mt-3 h-[2px] w-full rounded-full animate-[pulse_2s_infinite]",
            style: {
              background: `linear-gradient(90deg, ${accentColor} 0%, rgba(162,127,243,0.3) 70%, transparent 100%)`,
            },
          }),
        ],
      ),
    { duration },
  );
}

export const appToast = {
  /**
   * Warning / Linguistic Shield Toast
   */
  warning: (title: string, options?: ToastOptions | string) => {
    return createCyberKineticToast(
      title,
      options,
      "LINGUISTIC SHIELD · 0 TOKENS",
      "#A855F7",
      4500,
    );
  },

  /**
   * Info / Guidance Toast
   */
  info: (title: string, options?: ToastOptions | string) => {
    return createCyberKineticToast(
      title,
      options,
      "AUDIO INPUT GUIDANCE",
      "#38BDF8",
      4000,
    );
  },

  /**
   * Success / Memory Vault Toast
   */
  success: (title: string, options?: ToastOptions | string) => {
    return createCyberKineticToast(
      title,
      options,
      "MEMORY VAULT · AES-256",
      "#10B981",
      4000,
    );
  },

  /**
   * Error / Failure Toast
   */
  error: (title: string, options?: ToastOptions | string) => {
    return createCyberKineticToast(
      title,
      options,
      "SYSTEM RESILIENCE GUARD",
      "#F43F5E",
      5000,
    );
  },

  /**
   * Specialized Preset: Spanish Detected (Auto-Pauses Mic & Zero Token Protection)
   */
  spanishDetected: (customMessage?: string) => {
    return createCyberKineticToast(
      "Detectamos que estás hablando en español",
      {
        description:
          customMessage ||
          "El micrófono se ha pausado automáticamente. Por favor continúa en inglés para entrenar tu fluidez.",
        tag: "SPANISH DETECTED · AUTO-PAUSED",
        accentColor: "#A855F7",
      },
      "SPANISH DETECTED · AUTO-PAUSED",
      "#A855F7",
      4500,
    );
  },

  /**
   * Specialized Preset: Gibberish / Nonsense Detected
   */
  gibberishDetected: (customMessage?: string) => {
    return createCyberKineticToast(
      "Texto o audio no comprensible",
      {
        description:
          customMessage ||
          "Por favor formula una respuesta estructurada con palabras válidas en inglés.",
        tag: "LINGUISTIC SHIELD · 0 TOKENS",
        accentColor: "#F43F5E",
      },
      "LINGUISTIC SHIELD · 0 TOKENS",
      "#F43F5E",
      4500,
    );
  },

  /**
   * Specialized Preset: Whisper Ambient Noise
   */
  ambientNoise: (customMessage?: string) => {
    return createCyberKineticToast(
      "Audio ambiental detectado",
      {
        description:
          customMessage ||
          "El micrófono capturó silencio o estática de fondo. Por favor habla con claridad hacia el micrófono.",
        tag: "MICROPHONE CAPTURE",
        accentColor: "#38BDF8",
      },
      "MICROPHONE CAPTURE",
      "#38BDF8",
      4000,
    );
  },

  /**
   * Specialized Preset: Memory Vault Saved
   */
  memorySaved: (wordOrPhrase: string) => {
    return createCyberKineticToast(
      "Corrección guardada en tu Banco de Memoria",
      {
        description: `“${wordOrPhrase}” ha sido encriptada y sincronizada para tus sesiones de repaso.`,
        tag: "MEMORY VAULT · ENCRYPTED",
        accentColor: "#10B981",
      },
      "MEMORY VAULT · ENCRYPTED",
      "#10B981",
      4000,
    );
  },

  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },
};
