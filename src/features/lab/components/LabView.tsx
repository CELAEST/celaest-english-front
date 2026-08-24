import React from 'react';
import { LabHeader } from './LabHeader';
import { ReadingGenerationStatesShowcase } from './ReadingGenerationStatesShowcase';
import { QuantumProgressGauge } from './QuantumProgressGauge';
import { BespokeIconsShowcase } from './BespokeIconsShowcase';
import { ReadingNavigationVariants } from './ReadingNavigationVariants';
import { CardShowcase } from './CardShowcase';
import { ProgressRing } from '../../../design-system/components/ProgressRing/ProgressRing';

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
              Inspect and calibrate the 3 AI preparation states with orbital ring, nexus centerpiece icons, and timeline progress bar.
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
              Comparing the custom neural linguistic matrix gauge against basic circular progress rings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <div className="flex flex-col">
              <span className="text-xs font-mono uppercase text-[#A27FF3] tracking-widest mb-2 block font-medium">
                ★ Bespoke Custom Quantum Gauge
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
                  Simple SVG stroke without outer neural ticks or bespoke central linguistic matrix emblem.
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
              All 15+ custom vector assets organized by category — from holographic nexus centerpieces to micro step nodes.
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
              Canonical card primitive: variants, interactive states and accessibility. Every feature card must converge here.
            </p>
          </div>
          <CardShowcase />
        </div>
      </div>
    </div>
  );
};
