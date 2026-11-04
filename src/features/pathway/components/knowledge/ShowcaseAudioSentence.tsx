import React from "react";
import { Volume2 } from "lucide-react";
import { HighlightedSentence } from "./HighlightedSentence";

export interface ShowcaseAudioSentenceProps {
  sentence: string;
  highlight: string;
  isSpeaking: boolean;
  onPlay: () => void;
  className?: string;
}

export const ShowcaseAudioSentence: React.FC<ShowcaseAudioSentenceProps> = ({
  sentence, highlight, isSpeaking, onPlay, className = "",
}) => (
  <button
    type="button"
    onClick={onPlay}
    className={`group text-left flex items-baseline gap-2 cursor-pointer ${className}`}
    title="Escuchar con voz de Liam"
  >
    <HighlightedSentence
      text={sentence}
      highlight={highlight}
      className={`text-base font-light transition-colors ${
        isSpeaking ? "text-[#A78BFA]" : "text-white group-hover:text-[#A78BFA]"
      }`}
    />
    <Volume2
      size={13}
      aria-hidden
      className={`shrink-0 transition-colors ${
        isSpeaking ? "text-[#A78BFA] animate-pulse" : "text-white/30 group-hover:text-[#A78BFA]"
      }`}
    />
  </button>
);

