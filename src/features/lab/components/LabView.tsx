import React from "react";
import { LabHeader } from "./LabHeader";
import { ReadingGenerationStatesShowcase } from "./ReadingGenerationStatesShowcase";
import { QuantumProgressGauge } from "./QuantumProgressGauge";
import { BespokeIconsShowcase } from "./BespokeIconsShowcase";
import { ReadingNavigationVariants } from "./ReadingNavigationVariants";
import { CardShowcase } from "./CardShowcase";
import { ProductFeatureCardsShowcase } from "./ProductFeatureCardsShowcase";
import { Spatial3DStudioShowcase } from "./Spatial3DStudioShowcase";
import { ClassicSpatial3DShowcase } from "./ClassicSpatial3DShowcase";
import { NextGenSpatialStudioShowcase } from "./NextGenSpatialStudioShowcase";
import { HolographicNeuralStudioShowcase } from "./HolographicNeuralStudioShowcase";
import { HyperEvolvedMasterpiecesShowcase } from "./HyperEvolvedMasterpiecesShowcase";
import { HyperVectorQuantumStudioShowcase } from "./HyperVectorQuantumStudioShowcase";
import { MasterLuxurySpatialShowcase } from "./MasterLuxurySpatialShowcase";
import { ProgressRing } from "../../../design-system/components/ProgressRing/ProgressRing";

export interface LabViewProps {
  onBackToWorkspace?: (() => void) | undefined;
}

export const LabView: React.FC<LabViewProps> = ({ onBackToWorkspace }) => {
  return (
    <div className="w-full h-full flex flex-col justify-start items-center p-4 sm:p-8 lg:p-12 overflow-y-auto no-scrollbar bg-[#030208] text-white">
      <div className="w-full max-w-6xl flex flex-col space-y-8 pb-16">
        {/* Lab Header */}
        <LabHeader onBackToWorkspace={onBackToWorkspace} />

        {/* Section 1: Reading Generation Loading States (Top Priority) */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
              <span>1. Reading Generation Loading States</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-[#34D399]/20 border border-[#34D399]/30 text-[#34D399]">
                Priority
              </span>
            </h2>
            <p className="text-xs text-[#8a8a9e]">
              Inspect and calibrate the 3 AI preparation states with orbital ring, nexus centerpiece
              icons, and timeline progress bar.
            </p>
          </div>
          <ReadingGenerationStatesShowcase defaultStep={1} />
        </div>

        {/* Section 2: Circular Gauge Comparison */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide">
              2. Bespoke Quantum Gauge vs. Standard Progress Ring
            </h2>
            <p className="text-xs text-[#8a8a9e]">
              Comparing the custom neural linguistic matrix gauge against basic circular progress
              rings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="flex flex-col">
              <span className="text-xs font-mono uppercase text-[#A27FF3] tracking-widest mb-2 block font-medium">
                Bespoke Custom Quantum Gauge
              </span>
              <QuantumProgressGauge
                value={72}
                size={230}
                label="Linguistic Node Convergence"
                sublabel="Formant & Vocabulary Synapse Alignment"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-mono uppercase text-[#8a8a9e] tracking-widest mb-2 block font-medium">
                Standard Minimal Ring (Reference)
              </span>
              <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-3xl bg-[#070714]/50 border border-white/[0.04] backdrop-blur-xl">
                <ProgressRing
                  value={72}
                  size={180}
                  strokeWidth={8}
                  label="Standard Progress"
                  color="#7048E8"
                />
                <p className="text-xs text-[#6b6c82] mt-6 text-center max-w-xs">
                  Simple SVG stroke without outer neural ticks or bespoke central linguistic matrix
                  emblem.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Reading Navigation UX Lab */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide">
              3. Reading Navigation UX / UI Comparison
            </h2>
            <p className="text-xs text-[#8a8a9e]">
              Test and switch between different container-less and split navigation layouts.
            </p>
          </div>
          <ReadingNavigationVariants />
        </div>

        {/* Section 4: Complete Icon Catalogue */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide">
              4. Complete Bespoke Iconography Catalogue
            </h2>
            <p className="text-xs text-[#8a8a9e]">
              All 15+ custom vector assets organized by category — from holographic nexus
              centerpieces to micro step nodes.
            </p>
          </div>
          <BespokeIconsShowcase />
        </div>

        {/* Section 5: Premium Card System */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide">
              5. Premium Card System (design-system)
            </h2>
            <p className="text-xs text-[#8a8a9e]">
              Canonical card primitive: variants, interactive states and accessibility. Every
              feature card must converge here.
            </p>
          </div>
          <CardShowcase />
        </div>

        {/* Section 6: Real Feature Cards & Bespoke Iconography Matrix */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
              <span>6. Real Feature Cards & Bespoke Iconography Matrix</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-[#7048E8]/20 border border-[#7048E8]/40 text-[#C4B5FD]">
                Production Features
              </span>
            </h2>
            <p className="text-xs text-[#8a8a9e]">
              Live feature cards mapped to CELAEST Lingua modules (Memory Deck, Lexicon Codex, Writing Evaluator, Mock Interview, and AI Mentor).
            </p>
          </div>
          <ProductFeatureCardsShowcase />
        </div>

        {/* Section 7: Spatial 3D Master Cards (Pure Code-Driven & Speaking Memory) */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
              <span>7. Spatial 3D Master Cards (Minimalist Luxury)</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8]">
                Apple VisionOS Standard
              </span>
            </h2>
            <p className="text-xs text-[#8a8a9e]">
              Zero nested box clutter, breathable typography, interactive 3D mathematical physics, phoneme scrubber, and Ebbinghaus decay curve.
            </p>
          </div>
          <Spatial3DStudioShowcase />
        </div>

        {/* Section 8: Classic 3D Spatial Speaking & Acoustic Spectrum */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
              <span>8. Classic 3D Spatial Speaking & Acoustic Spectrum</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-[#7048E8]/20 border border-[#7048E8]/40 text-[#C4B5FD]">
                3D Perspective Deck
              </span>
            </h2>
            <p className="text-xs text-[#8a8a9e]">
              Full 3D physical perspective tilt with specular reflection, 180° flip animation, and 28-band speech formant spectrum.
            </p>
          </div>
          <ClassicSpatial3DShowcase />
        </div>

        {/* Section 9: Next-Gen Neural Constellation & Spatial Studio */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
              <span>9. Next-Gen Neural Constellation & Spatial Studio</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-[#34D399]/20 border border-[#34D399]/40 text-[#34D399]">
                Spatial Computing UI
              </span>
            </h2>
            <p className="text-xs text-[#8a8a9e]">
              Vocabulary synapse constellation graph, conversational turn-taking telemetry, executive pitch diagnostics, and tactile IPA phoneme matrix.
            </p>
          </div>
          <NextGenSpatialStudioShowcase />
        </div>

        {/* Section 10: Holographic Neural Architecture Studio */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
              <span>10. Holographic Neural Architecture Studio</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-[#A27FF3]/20 border border-[#A27FF3]/40 text-[#C4B5FD]">
                Apple VisionOS Masterworks
              </span>
            </h2>
            <p className="text-xs text-[#8a8a9e]">
              Dynamic pitch contour & intonation maestro, morphological word-family matrix, executive debate arena, and auditory shadowing phase worklet.
            </p>
          </div>
          <HolographicNeuralStudioShowcase />
        </div>

        {/* Section 11: Hyper-Evolved Production Masterpieces (1000x Re-Engineered) */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
              <span>11. Hyper-Evolved Production Masterpieces (1000x Architecture)</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8]">
                Bespoke Vector & Spatial Standard
              </span>
            </h2>
            <p className="text-xs text-[#8a8a9e]">
              Re-engineered core software primitives: Memory Vault SRS Nexus, Pentagonal Lexical Density Radar, Neural Resonance Orb HUD, and Tachistoscopic RSVP Reader.
            </p>
          </div>
          <HyperEvolvedMasterpiecesShowcase />
        </div>

        {/* Section 12: Hyper-Vector Quantum Studio */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
              <span>12. Hyper-Vector Quantum Studio</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-[#A27FF3]/20 border border-[#A27FF3]/40 text-[#C4B5FD]">
                Bespoke SVG Vector Engineering
              </span>
            </h2>
            <p className="text-xs text-[#8a8a9e]">
              High-engineering bespoke vectors: IPA Vowel Quadrilateral & Formant Resonator, Synaptic Consolidation Vault, Aristotelian Rhetoric Compass, and Global Dialect Vector Radar.
            </p>
          </div>
          <HyperVectorQuantumStudioShowcase />
        </div>

        {/* Section 13: Master Luxury Spatial Suite */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
              <span>13. Master Luxury Spatial Suite</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-[#34D399]/20 border border-[#34D399]/40 text-[#34D399]">
                Minimalist Luxury Standard
              </span>
            </h2>
            <p className="text-xs text-[#8a8a9e]">
              Exact Section 7 gold standard: Executive prosody scope, fluid semantic restructuring, tactile phoneme synthesizer, and synaptic stability horizon.
            </p>
          </div>
          <MasterLuxurySpatialShowcase />
        </div>
      </div>
    </div>
  );
};
