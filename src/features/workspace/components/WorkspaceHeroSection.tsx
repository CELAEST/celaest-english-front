import React from "react";

export interface WorkspaceHeroSectionProps {
  userName?: string | undefined;
  learningGoal?: string | undefined;
  profession?: string | undefined;
  dailyFocus?: string | undefined;
  onContinueTopic?: (() => void) | undefined;
}

export const WorkspaceHeroSection: React.FC<WorkspaceHeroSectionProps> = ({
  userName = "Learner",
  learningGoal,
  profession,
  dailyFocus,
  onContinueTopic,
}) => {
  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

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
          Your focus today is on <span className="text-[#C4B5FD] font-medium">{learningGoal}</span>{" "}
          ({dailyFocus || "20 min"}). <br className="hidden sm:inline" />
          Shall we start your next conversational practice?
        </>
      );
    }
    return (
      <>
        You mentioned you struggle with <br className="hidden sm:inline" />
        expressing your ideas in technical meetings. <br className="hidden sm:inline" />
        Shall we continue from there?
      </>
    );
  }, [learningGoal, profession, dailyFocus]);

  return (
    <div className="space-y-3 sm:space-y-4 max-w-lg select-none pt-2 sm:pt-3.5 pl-1 sm:pl-2.5 z-10">
      {/* Category Tag with dynamic time greeting and user name */}
      <div
        className="flex items-center gap-3 animate-[fadeSlideUp_0.5s_ease-out_both]"
        style={{ animationDelay: "0ms" }}
      >
        <span className="hidden sm:block h-px w-6 bg-gradient-to-r from-[#9375E6] to-transparent" />
        <span className="text-[10.5px] font-sans font-medium tracking-[0.22em] text-[#A99BC9] uppercase">
          {greeting}, {userName}
        </span>
      </div>

      {/* Main Headline — Fraunces display, weight-contrast accent */}
      <h1
        className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[52px] font-normal text-white leading-[1.1] animate-[fadeSlideUp_0.6s_ease-out_both]"
        style={{ animationDelay: "100ms" }}
      >
        I’ve been thinking <br />
        about our last <br />
        <span className="font-display-accent">conversation.</span>
      </h1>

      {/* Subtext Paragraph with live dynamic personalized goal */}
      <p
        className="text-xs sm:text-sm text-[#9E9EBD] font-light leading-relaxed font-sans pt-0.5 sm:pt-1 animate-[fadeSlideUp_0.6s_ease-out_both]"
        style={{ animationDelay: "220ms" }}
      >
        {dynamicSubtext}
      </p>

      {/* Signature Link */}
      <div
        className="pt-1 sm:pt-2 animate-[fadeSlideUp_0.6s_ease-out_both]"
        style={{ animationDelay: "320ms" }}
      >
        <button
          onClick={onContinueTopic}
          className="text-xs sm:text-sm font-medium text-[#B197FF] hover:text-white transition-colors cursor-pointer flex items-center gap-2 group/link"
        >
          <span className="w-3.5 h-3.5 rounded-full bg-[radial-gradient(circle_at_38%_32%,#C4B5FD,#7048E8_65%)] shadow-[0_0_10px_rgba(136,104,248,0.7)]" />
          <span className="group-hover/link:translate-x-1 transition-transform duration-300">
            Lingua AI
          </span>
        </button>
      </div>
    </div>
  );
};
