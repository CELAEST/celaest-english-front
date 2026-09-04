import React from "react";

export interface WorkspaceHeroSectionProps {
  userName?: string | undefined;
  learningGoal?: string | undefined;
  profession?: string | undefined;
  dailyFocus?: string | undefined;
  onContinueTopic?: (() => void) | undefined;
}

export const WorkspaceHeroSection: React.FC<WorkspaceHeroSectionProps> = ({
  userName,
  learningGoal,
  profession,
  dailyFocus: _dailyFocus,
  onContinueTopic,
}) => {
  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const displayName = userName?.trim() ? userName : "Learner";

  const dynamicSubtext = React.useMemo(() => {
    if (learningGoal && profession) {
      return (
        <>
          Your customized session for <span className="text-[#C4B5FD] font-medium">{profession}</span>{" "}
          is centered on <span className="text-[#C4B5FD] font-medium">{learningGoal}</span>.{" "}
          <br className="hidden sm:inline" />
          Shall we continue from where we left off?
        </>
      );
    }
    if (learningGoal) {
      return (
        <>
          Your customized session is centered on{" "}
          <span className="text-[#C4B5FD] font-medium">{learningGoal}</span>.{" "}
          <br className="hidden sm:inline" />
          Shall we continue from where we left off?
        </>
      );
    }
    return (
      <>
        Your customized session for{" "}
        <span className="text-[#C4B5FD] font-medium">Conversation First</span> is centered on{" "}
        <span className="text-[#C4B5FD] font-medium">Tech Career & AI</span>. <br className="hidden sm:inline" />
        Shall we continue from where we left off?
      </>
    );
  }, [learningGoal, profession]);

  return (
    <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start pt-0 font-['Plus_Jakarta_Sans',sans-serif] z-10">
      {/* Category Line with Fine Hairline Gradient */}
      <div className="flex items-center gap-3">
        <span className="h-px w-6 bg-gradient-to-r from-[#9375E6] to-transparent" />
        <span className="text-[10px] sm:text-[10.5px] font-mono font-semibold tracking-[0.22em] text-[#B197FF] uppercase">
          {greeting}, {displayName}
        </span>
      </div>

      {/* Display Headline in Plus Jakarta Sans (Light & Clean Contrast) */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[48px] font-light text-white leading-[1.08] tracking-[-0.035em]">
        I’ve been thinking <br />
        about our last <br />
        <span className="font-normal text-[#DDD6FE]">conversation.</span>
      </h1>

      {/* Context Subtext */}
      <p className="text-xs sm:text-[13.5px] text-[#8E90A5] font-light leading-[1.7] max-w-md">
        {dynamicSubtext}
      </p>

      {/* Naked Typographic Action (Zero Container, Pure Crisp Link) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onContinueTopic}
          className="group text-[11.5px] font-mono font-medium tracking-widest text-[#B197FF] hover:text-white transition-colors cursor-pointer flex items-center gap-2.5"
        >
          <span>CONTINUE SESSION</span>
          <span className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all text-xs">
            →
          </span>
        </button>
      </div>
    </div>
  );
};
