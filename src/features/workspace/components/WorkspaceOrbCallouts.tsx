import React from 'react';

export interface WorkspaceOrbCalloutsProps {
  onSelectNode?: ((nodeId: string) => void) | undefined;
}

export const WorkspaceOrbCallouts: React.FC<WorkspaceOrbCalloutsProps> = ({ onSelectNode }) => {
  return (
    <div className="flex flex-col gap-6 sm:gap-7 select-none pt-6 sm:pt-10 lg:pt-14 -translate-x-1.5 sm:-translate-x-3">
      {/* Node 1: LAST MEMORY */}
      <div
        onClick={() => onSelectNode && onSelectNode('memory')}
        className="flex items-center gap-3.5 group cursor-pointer transition-all duration-300 hover:-translate-x-1.5 animate-[slideInRight_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
        style={{ animationDelay: '150ms' }}
      >
        <div className="w-10 h-10 rounded-full bg-[#0F0B20]/85 border border-[#4C348A]/80 backdrop-blur-xl flex items-center justify-center text-[#B197FF] shadow-[0_0_16px_rgba(139,92,246,0.25)] group-hover:border-[#A78BFA] group-hover:shadow-[0_0_22px_rgba(167,139,250,0.5)] group-hover:scale-110 transition-all duration-300 shrink-0 animate-[softPulse_4s_ease-in-out_infinite]">
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.493 1.508 1.333 1.508 2.316V18" />
          </svg>
        </div>
        <div className="flex flex-col drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <span className="text-[9.5px] font-semibold tracking-[0.22em] text-[#B197FF] uppercase">
            LAST MEMORY
          </span>
          <span className="text-[13px] text-white font-medium mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors">“I struggle with meetings.”</span>
          <span className="text-[11px] text-[#A0A2C2] font-light mt-0.5">Yesterday</span>
        </div>
      </div>

      {/* Node 2: NEXT READING */}
      <div
        onClick={() => onSelectNode && onSelectNode('reading')}
        className="flex items-center gap-3.5 group cursor-pointer transition-all duration-300 hover:-translate-x-1.5 animate-[slideInRight_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
        style={{ animationDelay: '280ms' }}
      >
        <div className="w-10 h-10 rounded-full bg-[#0F0B20]/85 border border-[#4C348A]/80 backdrop-blur-xl flex items-center justify-center text-[#B197FF] shadow-[0_0_16px_rgba(139,92,246,0.25)] group-hover:border-[#A78BFA] group-hover:shadow-[0_0_22px_rgba(167,139,250,0.5)] group-hover:scale-110 transition-all duration-300 shrink-0 animate-[softPulse_4s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}>
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <div className="flex flex-col drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <span className="text-[9.5px] font-semibold tracking-[0.22em] text-[#B197FF] uppercase">
            NEXT READING
          </span>
          <span className="text-[13px] text-white font-medium mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors">How to communicate with confidence</span>
          <span className="text-[11px] text-[#A0A2C2] font-light mt-0.5">Today</span>
        </div>
      </div>

      {/* Node 3: UPCOMING INTERVIEW */}
      <div
        onClick={() => onSelectNode && onSelectNode('interview')}
        className="flex items-center gap-3.5 group cursor-pointer transition-all duration-300 hover:-translate-x-1.5 animate-[slideInRight_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
        style={{ animationDelay: '400ms' }}
      >
        <div className="w-10 h-10 rounded-full bg-[#0F0B20]/85 border border-[#4C348A]/80 backdrop-blur-xl flex items-center justify-center text-[#B197FF] shadow-[0_0_16px_rgba(139,92,246,0.25)] group-hover:border-[#A78BFA] group-hover:shadow-[0_0_22px_rgba(167,139,250,0.5)] group-hover:scale-110 transition-all duration-300 shrink-0 animate-[softPulse_4s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}>
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        </div>
        <div className="flex flex-col drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <span className="text-[9.5px] font-semibold tracking-[0.22em] text-[#B197FF] uppercase">
            UPCOMING INTERVIEW
          </span>
          <span className="text-[13px] text-white font-medium mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors">Mock interview practice</span>
          <span className="text-[11px] text-[#A0A2C2] font-light mt-0.5">Tomorrow · 11:00 AM</span>
        </div>
      </div>
    </div>
  );
};
