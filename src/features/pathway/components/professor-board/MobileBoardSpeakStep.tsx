import React from "react";
import { Mic, Square, Volume2 } from "lucide-react";
import { BridgeModuleTarget, PathwayLessonPayload } from "../../../../domain/entities/LearningPathway";
import { PronunciationEvaluationResult } from "../../services/PathwayPronunciationEngine";
import { VoiceWordBreakdown } from "../stages/VoiceWordBreakdown";

export interface MobileBoardSpeakStepProps {
  lesson: PathwayLessonPayload; conquered: boolean; isRecording: boolean;
  isEvaluatingVoice: boolean; isSavingCompletion: boolean; canSkipWithoutMic: boolean;
  failedAttempts?: number | undefined; spokenTranscript: string; speakingText: string | null;
  pronunciationResult?: PronunciationEvaluationResult | null | undefined;
  onPlayAudio: (text: string) => void; onToggleRecording: () => void;
  onCompleteWithoutMic: () => void; onNextFoundation?: (() => void) | undefined;
  onBridgeNavigate?: ((target: BridgeModuleTarget) => void) | undefined;
}

export const MobileBoardSpeakStep: React.FC<MobileBoardSpeakStepProps> = ({
  lesson, conquered, isRecording, isEvaluatingVoice, isSavingCompletion, canSkipWithoutMic,
  failedAttempts = 0, spokenTranscript, speakingText, pronunciationResult, onPlayAudio,
  onToggleRecording, onCompleteWithoutMic, onNextFoundation, onBridgeNavigate,
}) => {
  const { voicePractice, bridgeModule } = lesson;
  const isPlaying = speakingText === voicePractice.sentenceEnglish;
  const isFailed = Boolean((pronunciationResult && !pronunciationResult.passed) || failedAttempts > 0);
  const showEmptyMicHint = !conquered && !isRecording && !isEvaluatingVoice && !pronunciationResult && failedAttempts > 0;

  return (
    <div className="flex flex-col gap-2 py-0.5 animate-[fadeIn_0.22s_ease-out_both] select-none">
      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-base sm:text-lg font-normal text-white tracking-[-0.01em] leading-snug">“{voicePractice.sentenceEnglish}”</p>
          <button type="button" onClick={() => onPlayAudio(voicePractice.sentenceEnglish)} className="shrink-0 inline-flex items-center gap-1 text-[10.5px] font-mono text-[#A27FF3] hover:text-white cursor-pointer">
            <Volume2 size={11} className={isPlaying ? "animate-pulse" : ""} />
            <span>{isPlaying ? "Oyendo" : "Oír"}</span>
          </button>
        </div>
        <p className="text-[11.5px] text-white/50 font-light">
          {voicePractice.spanishMeaning} · <span className="font-mono text-[#C4B2F7]/85">[{voicePractice.pronunciationHint}]</span>
        </p>
      </div>

      {isRecording && <p className="text-xs text-[#22D3EE] font-mono animate-pulse truncate">Escuchando tu voz{spokenTranscript ? `: “${spokenTranscript}”` : "..."}</p>}
      {isEvaluatingVoice && <p className="text-xs text-[#C4B2F7] font-mono animate-pulse">Analizando tu pronunciación...</p>}
      {showEmptyMicHint && <p className="text-[11.5px] text-amber-300/90 font-light">No detecté tu voz con claridad. Acércate al micrófono y dilo de nuevo.</p>}
      {!isRecording && !isEvaluatingVoice && pronunciationResult && <VoiceWordBreakdown result={pronunciationResult} />}

      {!conquered ? (
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <button
            type="button" onClick={onToggleRecording} disabled={isSavingCompletion || isEvaluatingVoice}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11.5px] font-semibold tracking-wider uppercase transition-all cursor-pointer disabled:opacity-50 ${
              isRecording ? "bg-[#de5252] text-white animate-pulse" : isFailed ? "bg-rose-500 text-white" : "bg-white text-[#000001] hover:bg-[#EDE9FE]"
            }`}
          >
            {isRecording ? <Square size={11} fill="currentColor" /> : <Mic size={13} />}
            <span>{isRecording ? "Detener y comprobar voz" : isEvaluatingVoice ? "Analizando..." : isFailed ? "Reintentar pronunciación" : "Hablarle al Profesor"}</span>
          </button>
          {canSkipWithoutMic && (
            <button type="button" onClick={onCompleteWithoutMic} disabled={isSavingCompletion} className="text-[11px] font-mono text-white/45 hover:text-white cursor-pointer">
              {isSavingCompletion ? "Guardando..." : "Modo silencioso (no puedo hablar ahora) →"}
            </button>
          )}
        </div>
      ) : (
        <div className="pt-2 border-t border-[#4ade80]/30 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {onBridgeNavigate && (
              <button type="button" onClick={() => onBridgeNavigate(bridgeModule.target)} className="px-3.5 py-1.5 rounded-full bg-[#4ade80] text-[#000001] text-[11.5px] font-semibold cursor-pointer">
                Ir a practicarlo en {bridgeModule.moduleLabel} →
              </button>
            )}
            {onNextFoundation && (
              <button type="button" onClick={onNextFoundation} className="text-[11px] font-mono tracking-[0.14em] uppercase text-white/85 hover:text-white cursor-pointer">
                Siguiente Clase →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
