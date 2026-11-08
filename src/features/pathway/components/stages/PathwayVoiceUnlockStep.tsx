import React from "react";
import { Mic, Square, Volume2 } from "lucide-react";
import { BridgeModuleTarget, PathwayLessonPayload } from "../../../../domain/entities/LearningPathway";
import { PronunciationEvaluationResult } from "../../services/PathwayPronunciationEngine";
import { VoiceWordBreakdown } from "./VoiceWordBreakdown";

export interface PathwayVoiceUnlockStepProps {
  lesson: PathwayLessonPayload; isNodeMastered: boolean; isCompletedBanner: boolean;
  isRecording: boolean; isEvaluatingVoice?: boolean | undefined; isSavingCompletion: boolean;
  canSkipWithoutMic?: boolean | undefined; failedAttempts?: number | undefined; spokenTranscript: string;
  speakingText: string | null; pronunciationResult?: PronunciationEvaluationResult | null | undefined;
  onPlayAudio: (text: string) => void; onToggleRecording: () => void;
  onCompleteWithoutMic: () => void; onNextFoundation?: (() => void) | undefined;
  onBridgeNavigate?: ((target: BridgeModuleTarget) => void) | undefined;
}

export const PathwayVoiceUnlockStep: React.FC<PathwayVoiceUnlockStepProps> = ({
  lesson, isNodeMastered, isCompletedBanner, isRecording, isEvaluatingVoice = false,
  isSavingCompletion, canSkipWithoutMic = false, failedAttempts = 0, spokenTranscript, speakingText,
  pronunciationResult, onPlayAudio, onToggleRecording, onCompleteWithoutMic, onNextFoundation, onBridgeNavigate,
}) => {
  const { voicePractice, bridgeModule } = lesson;
  const conquered = isCompletedBanner || isNodeMastered;
  const isPlaying = speakingText === voicePractice.sentenceEnglish;
  const isFailed = Boolean((pronunciationResult && !pronunciationResult.passed) || failedAttempts > 0);
  const showEmptyMicHint = !conquered && !isRecording && !isEvaluatingVoice && !pronunciationResult && failedAttempts > 0;

  return (
    <div className="flex flex-col justify-center gap-2.5 sm:gap-3.5 lg:gap-4 w-full max-w-2xl my-auto animate-[fadeIn_0.35s_ease-out_both]">
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#A27FF3]">Pronúnciala con el Profesor</span>
          <button type="button" onClick={() => onPlayAudio(voicePractice.sentenceEnglish)} className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-white/70 hover:text-white cursor-pointer">
            <Volume2 size={12} className={isPlaying ? "animate-pulse text-[#A27FF3]" : ""} />
            <span>{isPlaying ? "Profesor hablando..." : "Escuchar al Profesor"}</span>
          </button>
        </div>
        <p className="text-xl sm:text-2xl lg:text-[28px] xl:text-[32px] font-light text-white tracking-[-0.02em] leading-snug">“{voicePractice.sentenceEnglish}”</p>
        <p className="text-xs sm:text-sm text-white/55 font-light">{voicePractice.spanishMeaning} · <span className="font-mono text-[#A78BFA]/85">suena: {voicePractice.pronunciationHint}</span></p>
      </div>

      {isRecording && <p className="text-xs font-mono text-[#22D3EE] animate-pulse">Escuchando tu voz{spokenTranscript ? `: “${spokenTranscript}”` : "..."}</p>}
      {isEvaluatingVoice && <p className="text-xs font-mono text-[#C4B2F7] animate-pulse">Analizando tu pronunciación con IA...</p>}
      {showEmptyMicHint && <p className="text-xs text-amber-300/90 font-light">No detecté tu voz con claridad. Acércate al micrófono y dilo de nuevo.</p>}
      {!isRecording && !isEvaluatingVoice && pronunciationResult && <VoiceWordBreakdown result={pronunciationResult} />}

      {!conquered ? (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
          <button
            type="button" onClick={onToggleRecording} disabled={isSavingCompletion || isEvaluatingVoice}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer disabled:opacity-50 ${
              isRecording ? "bg-[#de5252] text-white animate-pulse" : isFailed ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_16px_rgba(244,63,94,0.4)]" : "bg-white text-[#000001] hover:bg-[#EDE9FE]"
            }`}
          >
            {isRecording ? <Square size={11} fill="currentColor" /> : <Mic size={14} />}
            <span>{isRecording ? "Detener y comprobar voz" : isEvaluatingVoice ? "Analizando..." : isFailed ? "Reintentar pronunciación" : "Hablarle al Profesor"}</span>
          </button>
          {canSkipWithoutMic && (
            <button type="button" onClick={onCompleteWithoutMic} disabled={isSavingCompletion} className="text-xs font-mono text-white/45 hover:text-white cursor-pointer">
              {isSavingCompletion ? "Guardando..." : "Modo silencioso (no puedo hablar ahora) →"}
            </button>
          )}
        </div>
      ) : (
        <div className="pt-2.5 border-t border-[#4ade80]/30 space-y-2">
          <p className="text-xs sm:text-sm text-white/75 font-light">{bridgeModule.reasonSpanish}</p>
          <div className="flex flex-wrap items-center gap-4">
            {onBridgeNavigate && (
              <button type="button" onClick={() => onBridgeNavigate(bridgeModule.target)} className="px-4 py-2 rounded-full bg-[#4ade80] text-[#000001] text-xs font-semibold tracking-wide hover:brightness-110 cursor-pointer">
                Ir a practicarlo en {bridgeModule.moduleLabel} →
              </button>
            )}
            {onNextFoundation && (
              <button type="button" onClick={onNextFoundation} className="text-xs font-mono tracking-[0.16em] uppercase text-white/80 hover:text-white cursor-pointer">
                Siguiente Clase →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
