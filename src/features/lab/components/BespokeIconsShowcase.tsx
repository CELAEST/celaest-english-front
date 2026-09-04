import React from "react";
import {
  NexusTopicRadarIcon,
  NexusNeuralDnaIcon,
  NexusLexiconCodexIcon,
  ChronometerIcon,
  LexiconWordCountIcon,
  CefrGraduatedTierIcon,
  ComprehensionQuizIcon,
  VocabloTranslateIcon,
  MemoryBankSaveIcon,
  StepTopicTargetIcon,
  StepPersonalizeDnaIcon,
  StepFinalizeBookIcon,
  StepCompletedCheckIcon,
  ReturnArrowIcon,
  NextReadingArrowIcon,
} from "../../reading/components/ReadingBespokeIcons";
import {
  CognitiveMemoryBrainIcon,
  PrecisionOpenBookIcon,
  StudioVoiceMicIcon,
  TechnicalWritingQuillIcon,
  QuantumNeuralGaugeIcon,
  MasteryCefrPrismIcon,
  CryptographicVaultShieldIcon,
  SonicAcousticSpectrumIcon,
} from "../../workspace/components/WorkspaceBespokeIcons";

/* 
   EXPANDED BESPOKE ICON CATALOGUE
   Complete gallery of all custom SVG vector assets
   engineered for the CELAEST Lingua design system.
    */

interface IconEntry {
  id: string;
  name: string;
  category: "workspace" | "nexus" | "step" | "reading-ui" | "modal" | "navigation";
  description: string;
  Icon: React.FC<{ className?: string }>;
  defaultClass: string;
}

const ICON_CATALOGUE: IconEntry[] = [
  //  Workspace Dashboard Callouts (28px viewBox)
  {
    id: "workspace-memory-brain",
    name: "Cognitive Memory Brain",
    category: "workspace",
    description:
      "Anatomical dual-hemisphere cerebral cortex with synaptic gyri folds, central fissure, and radiant lavender pearl nucleus.",
    Icon: CognitiveMemoryBrainIcon,
    defaultClass: "w-6 h-6 text-[#C4B5FD]",
  },
  {
    id: "workspace-reading-codex",
    name: "Precision Open Book",
    category: "workspace",
    description:
      "Architectural open folio codex with 3D perspective curvature, clean spine, editorial typography etchings, and radiant diamond pearl.",
    Icon: PrecisionOpenBookIcon,
    defaultClass: "w-6 h-6 text-[#C4B5FD]",
  },
  {
    id: "workspace-interview-mic",
    name: "Studio Vocal Mic",
    category: "workspace",
    description:
      "Broadcast condenser microphone capsule with acoustic mesh grid, U-suspension gimbal cradle, and live signal beacon pearl.",
    Icon: StudioVoiceMicIcon,
    defaultClass: "w-6 h-6 text-[#C4B5FD]",
  },
  {
    id: "workspace-writing-quill",
    name: "Technical Writing Quill",
    category: "workspace",
    description:
      "Drafting fountain pen with precision isometric nib, ink channel slit, breather orifice node, and dynamic elevation angle.",
    Icon: TechnicalWritingQuillIcon,
    defaultClass: "w-6 h-6 text-[#C4B5FD]",
  },
  {
    id: "workspace-quantum-gauge",
    name: "Quantum Neural Gauge",
    category: "workspace",
    description:
      "Polar coordinate convergence radar with 4 cardinal optical ticks, segmented outer ring, and central focal nucleus.",
    Icon: QuantumNeuralGaugeIcon,
    defaultClass: "w-6 h-6 text-[#C4B5FD]",
  },
  {
    id: "workspace-cefr-prism",
    name: "Mastery CEFR Prism",
    category: "workspace",
    description:
      "Multi-faceted isometric diamond prism representing European CEFR language tiers with internal apex pearl.",
    Icon: MasteryCefrPrismIcon,
    defaultClass: "w-6 h-6 text-[#C4B5FD]",
  },
  {
    id: "workspace-vault-shield",
    name: "Cryptographic Vault Shield",
    category: "workspace",
    description:
      "Hexagonal security vault shield with keyhole lattice protecting personal linguistic memory.",
    Icon: CryptographicVaultShieldIcon,
    defaultClass: "w-6 h-6 text-[#C4B5FD]",
  },
  {
    id: "workspace-acoustic-spectrum",
    name: "Sonic Acoustic Spectrum",
    category: "workspace",
    description:
      "Logarithmic multi-harmonic audio frequency bars with rounded terminals and dynamic center pearl.",
    Icon: SonicAcousticSpectrumIcon,
    defaultClass: "w-6 h-6 text-[#C4B5FD]",
  },
  //  Nexus Centerpiece Icons (Large, 48px viewBox, holographic)
  {
    id: "nexus-topic-radar",
    name: "Optic Topic Radar",
    category: "nexus",
    description:
      "Multi-tier orbital calibration radar with crosshair reticle. Used in Step 1 of reading generation to signal AI target acquisition.",
    Icon: NexusTopicRadarIcon,
    defaultClass: "w-12 h-12 text-[#DDD6FE]",
  },
  {
    id: "nexus-neural-dna",
    name: "Synaptic Neural DNA Helix",
    category: "nexus",
    description:
      "Double-helix lattice with volumetric synapse nodes. Represents personalized linguistic DNA mapping in Step 2.",
    Icon: NexusNeuralDnaIcon,
    defaultClass: "w-12 h-12 text-[#DDD6FE]",
  },
  {
    id: "nexus-lexicon-codex",
    name: "Lexicon Codex",
    category: "nexus",
    description:
      "Architectural open book with radiant spine and ascending photonic beams. Finalizes reading assembly in Step 3.",
    Icon: NexusLexiconCodexIcon,
    defaultClass: "w-12 h-12 text-[#DDD6FE]",
  },

  //  Step Timeline Node Icons (Small, 16px viewBox)
  {
    id: "step-topic-target",
    name: "Focal Target Crosshair",
    category: "step",
    description: "Precision focal crosshair beacon. Appears inside Step 1 timeline node.",
    Icon: StepTopicTargetIcon,
    defaultClass: "w-5 h-5 text-[#C4B5FD]",
  },
  {
    id: "step-personalize-dna",
    name: "Molecular DNA Link",
    category: "step",
    description: "Synaptic synthesis double-wave with molecular bond nodes. Step 2 timeline node.",
    Icon: StepPersonalizeDnaIcon,
    defaultClass: "w-5 h-5 text-[#C4B5FD]",
  },
  {
    id: "step-finalize-book",
    name: "Finalization Book Glyph",
    category: "step",
    description:
      "Architectural book and feather glyph for reading layout finalization. Step 3 timeline node.",
    Icon: StepFinalizeBookIcon,
    defaultClass: "w-5 h-5 text-[#C4B5FD]",
  },
  {
    id: "step-completed-check",
    name: "Completed Checkmark",
    category: "step",
    description:
      "Crisp geometric checkmark with thick rounded strokes. Replaces step icons after completion.",
    Icon: StepCompletedCheckIcon,
    defaultClass: "w-5 h-5 text-white",
  },

  //  Reading UI Feature Icons (Medium, 24–28px viewBox)
  {
    id: "chronometer",
    name: "Precision Chronometer",
    category: "reading-ui",
    description:
      "High-contrast stopwatch dial with sweep hand and cardinal ticks. Displays estimated reading time.",
    Icon: ChronometerIcon,
    defaultClass: "w-7 h-7 text-[#A78BFA]",
  },
  {
    id: "lexicon-word-count",
    name: "Lexicon Word Count",
    category: "reading-ui",
    description:
      "Open book spine with text line etchings. Shows total word count and vocabulary density.",
    Icon: LexiconWordCountIcon,
    defaultClass: "w-7 h-7 text-[#A78BFA]",
  },
  {
    id: "cefr-graduated-tier",
    name: "CEFR Graduated Tier",
    category: "reading-ui",
    description:
      "Triple-bar proficiency chart with milestone beacon pin. Displays active CEFR target level.",
    Icon: CefrGraduatedTierIcon,
    defaultClass: "w-7 h-7 text-[#A78BFA]",
  },
  {
    id: "comprehension-quiz",
    name: "Comprehension Quiz Document",
    category: "reading-ui",
    description:
      "Assessment document with text lines and validation dot. Triggers post-reading comprehension check.",
    Icon: ComprehensionQuizIcon,
    defaultClass: "w-5 h-5 text-[#C4B5FD]",
  },

  //  Word Lookup Modal Icons
  {
    id: "vocablo-translate",
    name: "Bilingual Translation Bubbles",
    category: "modal",
    description:
      "Overlapping speech bubbles representing bilingual bridge for translation overlay.",
    Icon: VocabloTranslateIcon,
    defaultClass: "w-5 h-5 text-[#C4B5FD]",
  },
  {
    id: "memory-bank-save",
    name: "Memory Bank Save",
    category: "modal",
    description:
      "Synaptic node with plus trigger badge. Saves vocabulary to the user memory SRS system.",
    Icon: MemoryBankSaveIcon,
    defaultClass: "w-5 h-5 text-[#C4B5FD]",
  },

  //  Navigation Icons
  {
    id: "return-arrow",
    name: "Return Chevron",
    category: "navigation",
    description: "Crisp leftward chevron for back navigation with hover translate animation.",
    Icon: ReturnArrowIcon,
    defaultClass: "w-5 h-5 text-white",
  },
  {
    id: "next-reading-arrow",
    name: "Next Reading Arrow",
    category: "navigation",
    description: 'Bold directional glide arrow with nucleus tail for "Next Article" CTA.',
    Icon: NextReadingArrowIcon,
    defaultClass: "w-8 h-8 text-white",
  },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  workspace: { label: "Workspace Dashboard Callouts", color: "#A27FF3" },
  nexus: { label: "Nexus Centerpiece", color: "#8B5CF6" },
  step: { label: "Timeline Nodes", color: "#7048E8" },
  "reading-ui": { label: "Reading UI", color: "#C4B5FD" },
  modal: { label: "Word Lookup Modal", color: "#DDD6FE" },
  navigation: { label: "Navigation", color: "#8b5cf6" },
};

export const BespokeIconsShowcase: React.FC = () => {
  const categories = Object.keys(CATEGORY_LABELS);

  return (
    <div className="flex flex-col space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white tracking-wide">
            Complete Bespoke Icon Catalogue
          </h3>
          <p className="text-xs text-[#8a8a9e]">
            {ICON_CATALOGUE.length} custom vector assets engineered for CELAEST Lingua design system
          </p>
        </div>
      </div>

      {categories.map((cat) => {
        const catInfo = CATEGORY_LABELS[cat];
        const icons = ICON_CATALOGUE.filter((i) => i.category === cat);
        if (icons.length === 0) return null;

        return (
          <div key={cat} className="flex flex-col space-y-3">
            {/* Category Header */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: catInfo.color }} />
              <span className="text-xs font-semibold text-white tracking-wide uppercase">
                {catInfo.label}
              </span>
              <span className="text-[10px] text-[#6b6c82] font-mono">({icons.length} icons)</span>
            </div>

            {/* Icon Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {icons.map((icon) => (
                <div
                  key={icon.id}
                  className="flex flex-col p-4 rounded-2xl bg-[#080816]/70 border border-white/[0.05] hover:border-[#A27FF3]/40 hover:bg-[#0c0c22]/80 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#111126] border border-white/[0.06] flex items-center justify-center mb-3 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(162,127,243,0.3)] transition-all">
                    <icon.Icon className={icon.defaultClass} />
                  </div>
                  <h4 className="text-xs font-medium text-white group-hover:text-[#C4B5FD] transition-colors leading-tight">
                    {icon.name}
                  </h4>
                  <p className="text-[10px] text-[#7e8096] mt-1 leading-relaxed line-clamp-2">
                    {icon.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
