import { AudioCaptureService } from "../../conversation/services/audioCaptureService";
import {
  PathwayPronunciationEngine,
  PronunciationEvaluationResult,
} from "./PathwayPronunciationEngine";

export interface EvaluatePathwayVoiceParams {
  targetSentence: string;
  liveTranscriptSnapshot: string;
  profession: string;
}

export interface EvaluatePathwayVoiceOutput {
  transcript: string;
  evaluation: PronunciationEvaluationResult | null;
}

const MIN_WHISPER_BLOB_BYTES = 400;
const MAX_SILENCE_NO_SPEECH_PROB = 0.82;

/**
 * Stops active mic capture, revokes temporary audio Object URLs, and transcribes
 * the real recorded audio via Whisper V3 Turbo / Edge / Backend cascade before
 * evaluating word-by-word phonetic accuracy.
 */
export async function stopAndEvaluatePathwayVoice({
  targetSentence,
  liveTranscriptSnapshot,
  profession,
}: EvaluatePathwayVoiceParams): Promise<EvaluatePathwayVoiceOutput> {
  const capture = await AudioCaptureService.stopAndGetAudio();

  try {
    let whisperTranscript = "";
    const candidateBlob =
      capture.audioBlob && capture.audioBlob.size >= MIN_WHISPER_BLOB_BYTES
        ? capture.audioBlob
        : capture.pendingTailBlob && capture.pendingTailBlob.size >= MIN_WHISPER_BLOB_BYTES
          ? capture.pendingTailBlob
          : null;

    if (candidateBlob) {
      const stt = await AudioCaptureService.transcribeAudio(candidateBlob, {
        roleName: profession,
        question: targetSentence,
      });

      const isSilenceHallucination =
        stt?.noSpeechProb !== undefined &&
        stt.noSpeechProb > MAX_SILENCE_NO_SPEECH_PROB &&
        !capture.hadVoicedSpeech;

      if (stt?.text && !isSilenceHallucination) {
        whisperTranscript = stt.text.trim();
      }
    }

    const fallbackTranscript = (
      capture.confirmedMobileTranscript || liveTranscriptSnapshot
    ).trim();

    const finalTranscript = whisperTranscript || fallbackTranscript;
    if (!finalTranscript) {
      return { transcript: "", evaluation: null };
    }

    const evaluation = PathwayPronunciationEngine.evaluate(
      targetSentence,
      finalTranscript,
    );

    return {
      transcript: finalTranscript,
      evaluation,
    };
  } finally {
    if (capture.audioUrl) {
      try {
        URL.revokeObjectURL(capture.audioUrl);
      } catch {
        // ignore URL revocation errors
      }
    }
  }
}

