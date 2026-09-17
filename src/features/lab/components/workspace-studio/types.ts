export type WorkspaceVariantId = "executive" | "bento" | "mission" | "spatial";

export interface StudioProfile {
  userName: string;
  profession: string;
  learningGoal: string;
  cefrLevel: string;
  cardsDue: number;
  wordCount: number;
  audioKhz: string;
  retentionRate: number;
  memoryWord: string;
  readingArticle: string;
  readingTimeMin: number;
  readingCefr: string;
  interviewTitle: string;
  interviewRound: string;
}

export interface WorkspaceVariantProps {
  profile: StudioProfile;
  onSelectAction?: ((actionId: string) => void) | undefined;
  memoryImage?: string | undefined;
  readingImage?: string | undefined;
  speakingImage?: string | undefined;
}
