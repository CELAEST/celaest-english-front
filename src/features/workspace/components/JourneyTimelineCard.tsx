import React from "react";

export interface TimelineNode {
  id: string;
  status: "completed" | "active" | "future" | "goal";
  label: string;
  topic: string;
}

const DEFAULT_TIMELINE_NODES: TimelineNode[] = [
  { id: "1", status: "completed", label: "Yesterday", topic: "Remote work" },
  { id: "2", status: "active", label: "Today", topic: "Business Meeting" },
  { id: "3", status: "future", label: "Tomorrow", topic: "Travel Scenario" },
  { id: "4", status: "goal", label: "Next Goal", topic: "Improve Fluency" },
];

export interface JourneyTimelineCardProps {
  nodes?: TimelineNode[] | undefined;
}

export const JourneyTimelineCard: React.FC<JourneyTimelineCardProps> = ({
  nodes = DEFAULT_TIMELINE_NODES,
}) => {
  return (
    <div className="relative w-full p-6 rounded-3xl bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] select-none overflow-hidden">
      {/* Top Specular Hairline */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Title */}
      <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-6 z-10 relative">Your Journey</h3>

      {/* Timeline Steps Container */}
      <div className="flex items-center justify-between px-4 py-2 z-10 relative">
        {nodes.map((node, index) => {
          const isLast = index === nodes.length - 1;

          return (
            <React.Fragment key={node.id}>
              {/* Node Item */}
              <div className="flex items-center gap-4">
                {/* Node Icon */}
                {node.status === "completed" && (
                  <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.12] flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {node.status === "active" && (
                  <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/30 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)] shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#fff]" />
                  </div>
                )}

                {node.status === "future" && (
                  <div className="w-7 h-7 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  </div>
                )}

                {node.status === "goal" && (
                  <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.10] flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                )}

                {/* Node Details */}
                <div className="flex flex-col text-left">
                  <span className={`text-[11px] font-mono ${node.status === "active" ? "text-white" : "text-white/30"}`}>
                    {node.label}
                  </span>
                  <span className={`text-[10px] font-mono ${node.status === "active" ? "text-white/50" : "text-white/20"}`}>
                    {node.topic}
                  </span>
                </div>
              </div>

              {/* Dotted Connecting Line */}
              {!isLast && (
                <div className="flex-1 px-4 flex items-center justify-center">
                  <div
                    className={`w-full border-t border-dashed ${
                      index === 0
                        ? "border-white/20"
                        : "border-white/[0.06]"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
