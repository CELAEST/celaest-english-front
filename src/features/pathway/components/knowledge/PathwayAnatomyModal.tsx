import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { AppModal } from "../../../../design-system/components/Modal/AppModal";
import { ENGLISH_ANATOMY_PILLARS } from "../../data/englishAnatomyData";
import { SpeechSynthesisService } from "../../../conversation/services/speechSynthesisService";
import { GuideHeaderTitle, GuideSection } from "./GuideHeaderTitle";
import { AnatomyMissionBanner } from "./AnatomyMissionBanner";
import { AnatomyProgressHeader } from "./AnatomyProgressHeader";
import { AnatomyIndexList } from "./AnatomyIndexList";
import { AnatomyPillarSection } from "./AnatomyPillarSection";
import { AnatomyUniversalFormula } from "./AnatomyUniversalFormula";
import { AnatomyRoadmapFooter } from "./AnatomyRoadmapFooter";
import { PhoneticsGuideView } from "./PhoneticsGuideView";

export interface PathwayAnatomyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPillarId?: string;
  initialSection?: GuideSection;
}

export const PathwayAnatomyModal: React.FC<PathwayAnatomyModalProps> = ({
  isOpen, onClose, initialPillarId = "subjects", initialSection = "structure",
}) => {
  const [section, setSection] = useState<GuideSection>(initialSection);
  const [activePillarId, setActivePillarId] = useState(initialPillarId);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const activePillar =
    ENGLISH_ANATOMY_PILLARS.find((p) => p.id === activePillarId) || ENGLISH_ANATOMY_PILLARS[0]!;

  const goToPillar = (pillarId: string) => {
    setActivePillarId(pillarId);
    setIsIndexOpen(false);
  };

  const handlePlayAudio = (text: string) => {
    setSpeakingText(text);
    SpeechSynthesisService.speak(text, {
      onEnd: () => setSpeakingText(null),
      onError: () => setSpeakingText(null),
    });
  };

  const subtitle = section === "structure"
    ? "Paso a paso, de lo más fácil a lo más completo (14 bloques)"
    : "Sonidos y articulación nativa explicados como un pro (44 fonemas)";

  return (
    <AppModal
      isOpen={isOpen} onClose={onClose} size="lg"
      icon={<BookOpen size={16} className="text-[#A78BFA]" />}
      title={<GuideHeaderTitle activeSection={section} onSelectSection={setSection} />}
      subtitle={subtitle}
      bodyClassName="space-y-4 px-4 sm:px-6 py-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {section === "structure" ? (
        <>
          <AnatomyMissionBanner />
          <AnatomyProgressHeader activePillar={activePillar} isIndexOpen={isIndexOpen} onToggleIndex={() => setIsIndexOpen((v) => !v)} />
          {isIndexOpen ? (
            <AnatomyIndexList activePillarId={activePillar.id} onSelectPillar={goToPillar} />
          ) : (
            <>
              <AnatomyPillarSection key={activePillar.id} pillar={activePillar} speakingText={speakingText} onPlayAudio={handlePlayAudio}>
                {activePillar.id === "universal_sentence" && <AnatomyUniversalFormula speakingText={speakingText} onPlayAudio={handlePlayAudio} />}
              </AnatomyPillarSection>
              <AnatomyRoadmapFooter activePillarId={activePillar.id} onNavigatePillar={goToPillar} />
            </>
          )}
        </>
      ) : (
        <PhoneticsGuideView />
      )}
    </AppModal>
  );
};
export default PathwayAnatomyModal;
