import React from "react";
import { Mic, Volume2, Play, Pause } from "lucide-react";
import { ComprehensiveTurnFeedback } from "../../services/masterAiFeedbackEngine";
import { WAVEFORM_BARS, formatPlaybackTime } from "./analysisHelpers";

export interface InterviewAnalysisTranscriptCardProps {
  feedback: ComprehensiveTurnFeedback;
  isPlayingUserAudio: boolean;
  userAudioCurrentTime: number;
  effectiveDuration: number;
  userAudioRef: React.Ref<HTMLAudioElement>;
  onToggleUserAudio: () => void;
  onSeekUserAudio: (fraction: number) => void;
  onSkipUserAudio: (deltaSeconds: number) => void;
  onAudioTimeUpdate: () => void;
  onAudioLoadedMetadata: () => void;
  onAudioEnded: () => void;
}

export const InterviewAnalysisTranscriptCard: React.FC<InterviewAnalysisTranscriptCardProps> = ({
  feedback,
  isPlayingUserAudio,
  userAudioCurrentTime,
  effectiveDuration,
  userAudioRef,
  onToggleUserAudio,
  onSeekUserAudio,
  onSkipUserAudio,
  onAudioTimeUpdate,
  onAudioLoadedMetadata,
  onAudioEnded,
}) => {
  return (
    <article className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-4 sm:p-6 lg:p-7 shadow-xl transition-all">
      {feedback.userAudioUrl && (
        <audio
          ref={userAudioRef}
          src={feedback.userAudioUrl}
          preload="metadata"
          onTimeUpdate={onAudioTimeUpdate}
          onLoadedMetadata={onAudioLoadedMetadata}
          onEnded={onAudioEnded}
        />
      )}

      {/* Header Row */}
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Mic className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#A27FF3] shrink-0" />
          <div className="flex items-center gap-2 sm:gap-2.5">
            <h3 className="text-[15px] sm:text-[16px] font-semibold text-white tracking-tight">Lo que dijiste</h3>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a8a9e]">
              Transcripción
            </span>
          </div>
        </div>

        {feedback.userAudioUrl && (
          <button
            onClick={onToggleUserAudio}
            className="flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-medium text-[#8f71ee] hover:text-[#c4b5fd] transition-colors cursor-pointer"
          >
            <Volume2 className={`h-4 w-4 ${isPlayingUserAudio ? "text-emerald-400 animate-pulse" : "text-[#8f71ee]"}`} />
            <span>{isPlayingUserAudio ? "Pausar audio" : "Escuchar audio"}</span>
          </button>
        )}
      </div>

      {/* Quote */}
      <div className="flex items-start gap-3 sm:gap-4 pl-1 sm:pl-5 pr-2 sm:pr-28 mb-4 sm:mb-6">
        <svg className="w-[20px] sm:w-[25px] h-[16px] sm:h-[20px] shrink-0 mt-0.5 text-[#674ee6]" viewBox="0 0 25 20" fill="currentColor">
          <path d="M7.5 0C3.36 0 0 3.36 0 7.5C0 11.64 3.36 15 7.5 15C8.16 15 8.8 14.91 9.4 14.75C8.44 17.72 5.56 19.86 2.14 20H4.29C8.95 20 12.86 16.09 12.86 11.43V7.5C12.86 3.36 9.5 0 7.5 0ZM19.64 0C15.5 0 12.14 3.36 12.14 7.5C12.14 11.64 15.5 15 19.64 15C20.3 15 20.94 14.91 21.54 14.75C20.58 17.72 17.7 19.86 14.28 20H16.43C21.09 20 25 16.09 25 11.43V7.5C25 3.36 21.64 0 19.64 0Z" />
        </svg>
        <p className="text-[13.5px] sm:text-[14.5px] leading-[1.7] text-[#d4d4e0] font-normal">
          "{feedback.reconciledTranscript || feedback.userSpokenText}"
        </p>
      </div>

      {/* Audio Player Controls & Interactive Waveform */}
      {feedback.userAudioUrl ? (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 pl-1 sm:pl-5 pr-1 sm:pr-8 max-w-[760px] pt-1">
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onSkipUserAudio(-5)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.08] transition-all cursor-pointer active:scale-95"
              title="Retroceder 5 segundos"
              aria-label="Retroceder 5 segundos"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
            </button>

            <button
              type="button"
              onClick={onToggleUserAudio}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
              aria-label={isPlayingUserAudio ? "Pausar mi audio" : "Reproducir mi audio"}
            >
              {isPlayingUserAudio ? <Pause className="h-4 w-4 fill-black text-black" /> : <Play className="h-4 w-4 ml-0.5 fill-black text-black" />}
            </button>

            <button
              type="button"
              onClick={() => onSkipUserAudio(5)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.08] transition-all cursor-pointer active:scale-95"
              title="Adelantar 5 segundos"
              aria-label="Adelantar 5 segundos"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
              </svg>
            </button>
          </div>

          <div
            className="flex-1 flex items-center justify-between gap-[2px] sm:gap-[2.5px] h-7 px-2 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] overflow-hidden cursor-pointer group transition-colors"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const fraction = Math.max(0, Math.min(1, clickX / rect.width));
              onSeekUserAudio(fraction);
            }}
            title="Haz clic en cualquier punto para adelantar o atrasar"
          >
            {WAVEFORM_BARS.map((h, i) => {
              const dur = effectiveDuration > 0 ? effectiveDuration : 1;
              const progress = userAudioCurrentTime / dur;
              const barProgress = i / WAVEFORM_BARS.length;
              const isPassed = barProgress <= progress;

              return (
                <div
                  key={i}
                  className={`w-[1.5px] rounded-full shrink-0 transition-colors ${
                    isPassed ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" : "bg-white/20 group-hover:bg-white/35"
                  }`}
                  style={{ height: `${h}px` }}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] font-mono text-xs text-white/90 shrink-0 self-end sm:self-auto">
            <span className="text-white font-medium">{formatPlaybackTime(userAudioCurrentTime)}</span>
            <span className="text-white/30">/</span>
            <span className="text-white/60">{formatPlaybackTime(effectiveDuration)}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 pl-2 sm:pl-5 pt-1 text-xs text-white/40 font-mono">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/40" />
          <span>Respuesta ingresada por texto</span>
        </div>
      )}
    </article>
  );
};
