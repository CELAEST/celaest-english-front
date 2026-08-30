import React from "react";
import {
  siClaude,
  siDeepseek,
  siGooglegemini,
  siOllama,
  siPerplexity,
  siOpenrouter,
  siHuggingface,
  siQwen,
  siMeta,
} from "simple-icons";
import { AiProviderId } from "../../../domain/entities/AiProvider";

/**
 * Official provider marks.
 *
 * Sources:
 * - Claude, Gemini, DeepSeek: `simple-icons` (industry-standard, audited
 *   brand path data), colors read directly from each brand's official hex.
 * - OpenAI: official blossom path pinned from simple-icons v13 (the mark was
 *   removed from later releases at the trademark holder's request). OpenAI
 *   presents its logo monochrome on dark surfaces, so white is its authentic
 *   rendering here.
 * - Ollama: official silhouette from `simple-icons`, fattened with a
 *   same-color stroke so its thin features stay crisp at tile sizes.
 */

const OPENAI_BLOSSOM_PATH =
  "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z";

interface ProviderMarkSource {
  title: string;
  hex: string;
  path: string;
  /**
   * Extra same-color stroke around a filled silhouette — fattens thin
   * official marks so they stay crisp at 19px (e.g. the Ollama llama).
   */
  fatten?: number;
  /** Override the default 24×24 viewBox for marks authored at another scale. */
  viewBox?: string;
}

const PROVIDER_MARKS: Record<AiProviderId, ProviderMarkSource> = {
  openai: {
    title: "OpenAI",
    hex: "FFFFFF",
    path: OPENAI_BLOSSOM_PATH,
  },
  anthropic: {
    title: siClaude.title,
    hex: siClaude.hex,
    path: siClaude.path,
  },
  gemini: {
    title: siGooglegemini.title,
    hex: siGooglegemini.hex,
    path: siGooglegemini.path,
  },
  deepseek: {
    title: siDeepseek.title,
    hex: siDeepseek.hex,
    path: siDeepseek.path,
  },
  ollama: {
    title: siOllama.title,
    hex: siOllama.hex,
    path: siOllama.path,
    fatten: 0.55,
  },
  grok: {
    // Official Grok mark (xAI) — stylized "G"/black-hole. xAI does not ship in
    // simple-icons, so the canonical 16×16 path is pinned here verbatim.
    title: "Grok (xAI)",
    hex: "FFFFFF",
    path: "M0.58392448,14.9254204 L0.8326,14.66295 C2.004465,13.42985 3.1678,12.2082 2.45814,10.48105 C1.50813,8.1701 2.061355,5.4619 3.820575,3.70057 C5.6495,1.8709 8.3431,1.40957 10.59295,2.336505 C11.0907,2.52161 11.5245,2.785025 11.86295,3.02993 L9.98425,3.89849 C8.235,3.163775 6.23115,3.66355 5.0081,4.88809 C3.354105,6.5426 3.019895,9.4117 4.95835,11.2656 L-0.335,15.99995 C-0.066496,15.62975 0.2538896,15.275934 0.58392448,14.9254204 Z M14.0391,2.288155 L16.33165,0 L16.20795,0.172288 C14.4658,2.574355 13.6153,3.749045 14.29795,6.6879 C14.76445,8.68415 14.261,10.90255 12.63545,12.53005 C10.5861,14.58325 7.3066,15.0403 4.6059,13.19215 L6.48885,12.3193 C8.2125,12.99705 10.0983,12.69945 11.4536,11.34255 C12.80895,9.9856 13.1133,8.00925 12.4321,6.3647 C12.30265,6.05285 11.9144,5.97455 11.64275,6.1753 L6.102,10.27035 L14.0391,2.288155 Z",
    viewBox: "-0.335 0 16.66665 16",
  },
  perplexity: {
    title: siPerplexity.title,
    hex: siPerplexity.hex,
    path: siPerplexity.path,
  },
  openrouter: {
    title: siOpenrouter.title,
    hex: siOpenrouter.hex,
    path: siOpenrouter.path,
  },
  huggingface: {
    title: siHuggingface.title,
    hex: siHuggingface.hex,
    path: siHuggingface.path,
  },
  qwen: {
    title: siQwen.title,
    hex: siQwen.hex,
    path: siQwen.path,
  },
  meta: {
    title: siMeta.title,
    hex: siMeta.hex,
    path: siMeta.path,
  },
};

/*  Brand color adaptation for the deep-space canvas  */

const luminanceOf = (hex: string): number => {
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Dark brand marks become light so they stay visible; hues stay authentic. */
const displayColorFor = (hex: string): string => (luminanceOf(hex) < 0.35 ? "#ECECF2" : `#${hex}`);

const rgbaFromHex = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/*  Official Mark  */

const OfficialMark: React.FC<{ source: ProviderMarkSource; className?: string }> = ({
  source,
  className,
}) => {
  const displayColor = displayColorFor(source.hex);
  return (
    <svg viewBox={source.viewBox ?? "0 0 24 24"} role="img" aria-hidden="true" focusable="false" className={className}>
      <path
        d={source.path}
        fill={displayColor}
        stroke={source.fatten ? displayColor : undefined}
        strokeWidth={source.fatten}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/*  Bare Mark — icon only, no tile / border / background  */

export interface ProviderMarkProps {
  providerId: AiProviderId;
  isActive?: boolean;
  size?: "md" | "lg";
}

export const ProviderMark: React.FC<ProviderMarkProps> = ({
  providerId,
  isActive = false,
  size = "md",
}) => {
  const source = PROVIDER_MARKS[providerId];
  // Dark brand hexes (e.g. Ollama's pure black) get their light display
  // color for the aura, otherwise the glow would be invisible.
  const auraHex = luminanceOf(source.hex) < 0.35 ? "ECECF2" : source.hex;
  const iconCls = size === "lg" ? "w-7 h-7 sm:w-8 sm:h-8" : "w-[19px] h-[19px] sm:w-5 sm:h-5";

  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 transition-all duration-500 ${iconCls}`}
      style={
        isActive
          ? { filter: `drop-shadow(0 0 10px ${rgbaFromHex(auraHex, 0.5)})` }
          : undefined
      }
      aria-label={source.title}
    >
      <OfficialMark source={source} className="w-full h-full" />
    </span>
  );
};
