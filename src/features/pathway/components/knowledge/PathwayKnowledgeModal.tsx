import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { AppModal } from "../../../../design-system/components/Modal/AppModal";
import { SpeechSynthesisService } from "../../../conversation/services/speechSynthesisService";
import { GrammarFoundationsPanel } from "./GrammarFoundationsPanel";
import { KnowledgeTab, KnowledgeTabSelector } from "./KnowledgeTabSelector";
import { PhoneticAlphabetPanel } from "./PhoneticAlphabetPanel";

export interface PathwayKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: KnowledgeTab | undefined;
}

export const PathwayKnowledgeModal: React.FC<PathwayKnowledgeModalProps> = ({
  isOpen,
  onClose,
  initialTab = "grammar",
}) => {
  const [activeTab, setActiveTab] = useState<KnowledgeTab>(initialTab);
  const [playingText, setPlayingText] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const handlePlayAudio = (text: string) => {
    SpeechSynthesisService.stop();
    setPlayingText(text);
    void SpeechSynthesisService.speak(text, {
      voice: "liam",
      preventSyntheticFallback: true,
      onEnd: () => setPlayingText(null),
      onError: () => setPlayingText(null),
    });
  };

  const handleClose = () => {
    SpeechSynthesisService.stop();
    setPlayingText(null);
    onClose();
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      icon={<BookOpen size={16} className="text-[#DDD6FE]" />}
      title="Guía Esencial A1 / A2 · CELAEST"
      subtitle="Estructura de la frase (Sujeto + Verbo) y fonética nativa explicadas sin rodeos."
      bodyClassName="space-y-4 max-h-[75vh]"
    >
      <div className="flex flex-col gap-4">
        <KnowledgeTabSelector activeTab={activeTab} onSelectTab={setActiveTab} />
        {activeTab === "grammar" ? (
          <GrammarFoundationsPanel playingText={playingText} onPlayAudio={handlePlayAudio} />
        ) : (
          <PhoneticAlphabetPanel playingText={playingText} onPlayAudio={handlePlayAudio} />
        )}
      </div>
    </AppModal>
  );
};

