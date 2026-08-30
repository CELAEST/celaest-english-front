import React from "react";
import {
  CognitiveMemoryBrainIcon,
  PrecisionOpenBookIcon,
  StudioVoiceMicIcon,
} from "./WorkspaceBespokeIcons";

export interface WorkspaceOrbCalloutsProps {
  onSelectNode?: ((nodeId: string) => void) | undefined;
}

export const WorkspaceOrbCallouts: React.FC<WorkspaceOrbCalloutsProps> = ({ onSelectNode }) => {
  const callouts = [
    {
      id: "memory",
      tag: "LAST MEMORY",
      title: "“I struggle with meetings.”",
      meta: "Yesterday",
      Icon: CognitiveMemoryBrainIcon,
      delay: "150ms",
    },
    {
      id: "reading",
      tag: "NEXT READING",
      title: "How to communicate with confidence",
      meta: "Today",
      Icon: PrecisionOpenBookIcon,
      delay: "280ms",
    },
    {
      id: "interview",
      tag: "UPCOMING INTERVIEW",
      title: "Mock interview practice",
      meta: "Tomorrow · 11:00 AM",
      Icon: StudioVoiceMicIcon,
      delay: "400ms",
    },
  ];

  return (
    <div className="flex flex-col gap-6 sm:gap-7 select-none pt-3 sm:pt-6 lg:pt-8">
      {callouts.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelectNode && onSelectNode(item.id)}
          className="flex items-center gap-4 group cursor-pointer transition-all duration-300 hover:-translate-x-1.5 animate-[slideInRight_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{ animationDelay: item.delay }}
        >
          {/* Prominent Squircle Frosted Glass Badge */}
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-center justify-center text-[#C4B5FD] group-hover:text-white group-hover:border-[#A27FF3]/60 group-hover:bg-[#121228]/80 group-hover:shadow-[0_4px_20px_rgba(112,72,232,0.3)] transition-all duration-300 shrink-0">
            <item.Icon className="w-6 h-6 sm:w-6.5 sm:h-6.5 transition-transform duration-300 group-hover:scale-110" />
          </div>

          {/* Clean High-Contrast Typography */}
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[10.5px] font-mono font-semibold tracking-[0.2em] text-[#B197FF] uppercase">
              {item.tag}
            </span>
            <span className="text-[14px] sm:text-[14.5px] text-white font-medium mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors line-clamp-1">
              {item.title}
            </span>
            <span className="text-[11.5px] text-[#8e90a5] font-light mt-0.5">{item.meta}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
