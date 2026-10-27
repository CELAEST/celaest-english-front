/**
 * Direct Edge Gemini Multimodal Audio Transcription Fallback
 * Provides low-latency (~250-350ms) verbatim speech transcription directly from the client
 * whenever a user has a Google Gemini API key configured in ProviderKeyVault.
 */

import { logger } from "../../../shared/utils/logger";
import { providerKeyVault } from "../../settings/services/providerKeyVault";

const DEFAULT_GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_AUDIO_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"] as const;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}

function normalizeGeminiAudioMime(rawMime: string): string {
  const lower = (rawMime || "").toLowerCase();
  if (lower.includes("mp4") || lower.includes("m4a")) return "audio/mp4";
  if (lower.includes("aac")) return "audio/aac";
  if (lower.includes("ogg")) return "audio/ogg";
  if (lower.includes("wav")) return "audio/wav";
  return "audio/webm";
}

export async function transcribeWithGeminiEdge(
  audioBlob: Blob,
  cleanFn: (raw: string) => string,
): Promise<{ reachedProvider: boolean; text: string }> {
  try {
    const geminiKeys = await providerKeyVault.getKeys("gemini");
    if (!geminiKeys || geminiKeys.length === 0) {
      return { reachedProvider: false, text: "" };
    }

    const arrayBuffer = await audioBlob.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength < 200) {
      return { reachedProvider: false, text: "" };
    }

    const base64Audio = arrayBufferToBase64(arrayBuffer);
    const mimeType = normalizeGeminiAudioMime(audioBlob.type);
    const config = await providerKeyVault.getConfig("gemini").catch(() => null);
    const endpoint = (config?.endpoint || DEFAULT_GEMINI_ENDPOINT).replace(/\/+$/, "");

    for (const rawKey of geminiKeys) {
      const key = rawKey?.trim();
      if (!key) continue;

      for (const model of GEMINI_AUDIO_MODELS) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6500);
        try {
          const url = `${endpoint}/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
          const resp = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: {
                parts: [
                  {
                    text: "Transcribe the spoken audio verbatim. Do not fix grammar. Return ONLY the exact spoken words in plain text, or an empty string if there is only silence or background noise.",
                  },
                ],
              },
              contents: [
                {
                  parts: [
                    { inlineData: { mimeType, data: base64Audio } },
                    { text: "Transcribe verbatim:" },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0,
                maxOutputTokens: 256,
              },
            }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (resp.status === 404) {
            continue;
          }

          if (resp.ok) {
            const payload = (await resp.json()) as {
              candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
            };
            const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            return {
              reachedProvider: true,
              text: cleanFn(rawText),
            };
          }
          break;
        } catch (err) {
          clearTimeout(timeoutId);
          logger.warn("[GeminiAudioFallback] Edge audio transcription notice:", err);
          break;
        }
      }
    }
  } catch (outerErr) {
    logger.warn("[GeminiAudioFallback] Unexpected fallback error:", outerErr);
  }

  return { reachedProvider: false, text: "" };
}
