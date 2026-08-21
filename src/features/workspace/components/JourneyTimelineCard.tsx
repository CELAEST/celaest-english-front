import React from 'react';

export interface TimelineNode {
  id: string;
  status: 'completed' | 'active' | 'future' | 'goal';
  label: string;
  topic: string;
}

const DEFAULT_TIMELINE_NODES: TimelineNode[] = [
  { id: '1', status: 'completed', label: 'Yesterday', topic: 'Remote work' },
  { id: '2', status: 'active', label: 'Today', topic: 'Business Meeting' },
  { id: '3', status: 'future', label: 'Tomorrow', topic: 'Travel Scenario' },
  { id: '4', status: 'goal', label: 'Next Goal', topic: 'Improve Fluency' },
];

export interface JourneyTimelineCardProps {
  nodes?: TimelineNode[] | undefined;
}

export const JourneyTimelineCard: React.FC<JourneyTimelineCardProps> = ({
  nodes = DEFAULT_TIMELINE_NODES,
}) => {
  return (
    <div className="w-full p-6 rounded-2xl bg-[#090717]/90 border border-[#1C1738] hover:border-[#2D2455] backdrop-blur-md transition-all shadow-[0_4px_25px_rgba(0,0,0,0.4)] select-none">
      {/* Title */}
      <h3 className="text-xs font-light text-[#9E9EB6] mb-6">Your Journey</h3>

      {/* Timeline Steps Container */}
      <div className="flex items-center justify-between px-4 py-2">
        {nodes.map((node, index) => {
          const isLast = index === nodes.length - 1;

          return (
            <React.Fragment key={node.id}>
              {/* Node Item */}
              <div className="flex items-center gap-4">
                {/* Node Icon */}
                {node.status === 'completed' && (
                  <div className="w-9 h-9 rounded-full bg-[#181236] border border-[#3B2C78] flex items-center justify-center text-[#A78BFA] shadow-[0_0_12px_rgba(112,72,232,0.4)] shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {node.status === 'active' && (
                  <div className="w-10 h-10 rounded-full bg-[#1A1242] border-2 border-[#7C3AED] flex items-center justify-center text-white shadow-[0_0_20px_rgba(124,58,237,0.7)] animate-pulse shrink-0">
                    <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_8px_#fff]" />
                  </div>
                )}

                {node.status === 'future' && (
                  <div className="w-8 h-8 rounded-full bg-[#100D24] border border-[#231B45] flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#4A4A6D]" />
                  </div>
                )}

                {node.status === 'goal' && (
                  <div className="w-9 h-9 rounded-full bg-[#161036] border border-[#342766] flex items-center justify-center text-[#A78BFA] shadow-[0_0_12px_rgba(112,72,232,0.3)] shrink-0">
                    <svg className="w-4.5 h-4.5 text-[#A78BFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                )}

                {/* Node Details */}
                <div className="flex flex-col text-left">
                  <span className={`text-xs ${node.status === 'active' ? 'font-medium text-white' : 'font-light text-[#8E8EB3]'}`}>
                    {node.label}
                  </span>
                  <span className={`text-xs ${node.status === 'active' ? 'font-light text-[#C8C8E8]' : 'font-light text-[#5D5D82]'}`}>
                    {node.topic}
                  </span>
                </div>
              </div>

              {/* Dotted Connecting Line (except after last item) */}
              {!isLast && (
                <div className="flex-1 px-4 flex items-center justify-center">
                  <div
                    className={`w-full border-t border-dashed ${
                      index === 0
                        ? 'border-[#7C3AED]/60 shadow-[0_0_8px_rgba(124,58,237,0.4)]'
                        : 'border-[#262046]'
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
