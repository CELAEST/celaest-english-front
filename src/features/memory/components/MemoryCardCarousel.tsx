import React, { useState } from "react";

type Skill = "SPEAKING" | "VOCABULARY" | "READING";

type CardItem = {
  skill: Skill;
  userSentence: string;
  errorWord: string;
  reviewDate: string;
};

const sampleCards: CardItem[] = [
  {
    skill: "SPEAKING",
    userSentence: "He don't like coffee.",
    errorWord: "don't",
    reviewDate: "May 17",
  },
  {
    skill: "VOCABULARY",
    userSentence: "I have a lot of work.",
    errorWord: "a lot",
    reviewDate: "May 15",
  },
  {
    skill: "READING",
    userSentence: "She have two dogs.",
    errorWord: "have",
    reviewDate: "May 14",
  },
  {
    skill: "SPEAKING",
    userSentence: "I'm agree with you.",
    errorWord: "agree",
    reviewDate: "May 16",
  },
];

function SkillTag({ skill, muted }: { skill: Skill; muted?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] uppercase ${
        muted ? "text-[#999a9b]/70" : "text-white/90"
      }`}
    >
      {/* Icon */}
      {skill === "SPEAKING" ? (
        <svg
          className="h-4 w-4 text-[#A27FF3] shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <rect x="2" y="10" width="2" height="4" rx="1" />
          <rect x="7" y="6" width="2" height="12" rx="1" />
          <rect x="12" y="3" width="2" height="18" rx="1" />
          <rect x="17" y="6" width="2" height="12" rx="1" />
          <rect x="22" y="10" width="2" height="4" rx="1" />
        </svg>
      ) : (
        <svg
          className="h-4 w-4 text-[#A27FF3] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {skill === "VOCABULARY" && (
            <>
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </>
          )}
          {skill === "READING" && (
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          )}
        </svg>
      )}
      {skill}
    </span>
  );
}

function HighlightedText({
  sentence,
  errorWord,
}: {
  sentence: string;
  errorWord: string;
}) {
  if (!errorWord) return <>{sentence}</>;
  const parts = sentence.split(
    new RegExp(`(${errorWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i"),
  );
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === errorWord.toLowerCase() ? (
          <span key={i} className="relative text-[#de5252] font-semibold">
            {part}
            <span className="absolute -bottom-0.5 left-0 h-[2px] w-full rounded-full bg-[#de5252]/70" />
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function PeekCard({ card, side }: { card: CardItem; side: "left" | "right" }) {
  return (
    <article
      aria-hidden="true"
      className={`pointer-events-none hidden h-[clamp(280px,44vh,440px)] w-full max-w-[clamp(220px,22vw,310px)] aspect-[3/4.4] select-none flex-col justify-between rounded-[28px] border border-[#111220] bg-[#05060c]/60 backdrop-blur-md p-5 sm:p-6 opacity-45 lg:flex transition-all duration-500 ease-out animate-[peekFadeIn_0.5s_ease-out_both] ${
        side === "left" ? "translate-x-8" : "-translate-x-8"
      }`}
    >
      <SkillTag skill={card.skill} muted />
      <div>
        <p className="text-xs text-[#999a9b]">You said</p>
        <p className="mt-2 font-sans text-[clamp(1.1rem,2.2vh,1.5rem)] font-medium leading-tight text-white/80">
          <HighlightedText
            sentence={card.userSentence}
            errorWord={card.errorWord}
          />
        </p>
      </div>
      <div>
        <p className="text-xs text-[#999a9b]">Review</p>
        <p className="text-sm text-white/70">{card.reviewDate}</p>
      </div>
    </article>
  );
}

export interface MemoryCardCarouselProps {
  onReveal?: (selectedIndex: number) => void;
  cards?: any[];
}

export const MemoryCardCarousel: React.FC<MemoryCardCarouselProps> = ({
  onReveal,
  cards,
}) => {
  const displayCards: CardItem[] = (cards && cards.length > 0)
    ? cards.map((c) => ({
        skill: (c.category || "WRITING") as Skill,
        userSentence: c.userSaid || "I have receive your email.",
        errorWord: c.errorWord || "receive",
        reviewDate: "Today",
      }))
    : sampleCards;

  const [active, setActive] = useState(0);
  const [slideDir, setSlideDir] = useState<"next" | "prev" | null>(null);
  const total = displayCards.length;

  const go = (d: -1 | 1) => {
    setSlideDir(d === 1 ? "next" : "prev");
    setActive((i) => (i + d + total) % total);
  };

  const current = displayCards[active] || displayCards[0];
  const left = displayCards[(active - 1 + total) % total] || current;
  const right = displayCards[(active + 1) % total] || current;

  const getAnimClass = () => {
    if (slideDir === "next") {
      return "animate-[carouselSlideNext_0.38s_cubic-bezier(0.25,1,0.5,1)_both]";
    }
    if (slideDir === "prev") {
      return "animate-[carouselSlidePrev_0.38s_cubic-bezier(0.25,1,0.5,1)_both]";
    }
    return "animate-[scaleIn_0.45s_cubic-bezier(0.25,1,0.5,1)_both]";
  };

  return (
    <div
      className="mt-[clamp(0.5rem,1.5vh,1.5rem)] w-full select-none animate-[fadeSlideUp_0.6s_ease-out_both]"
      style={{ animationDelay: "350ms" }}
    >
      {/* Carousel Row */}
      <div className="relative flex items-center justify-center gap-4">
        {/* Left Arrow */}
        <button
          aria-label="Previous card"
          onClick={() => go(-1)}
          className="absolute left-0 z-20 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#231956] bg-[#05060c]/80 text-white backdrop-blur transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-white/[0.08] hover:border-[#A27FF3]/60 hover:shadow-[0_0_15px_rgba(162,127,243,0.3)] cursor-pointer lg:static"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Left Peek */}
        <div className="hidden min-w-0 flex-1 lg:block">
          <PeekCard key={`left-${active}`} card={left} side="left" />
        </div>

        {/* Focused Card */}
        <article
          key={`focus-${active}`}
          className={`relative z-10 flex h-[clamp(320px,52vh,500px)] w-full max-w-[clamp(240px,25vw,370px)] aspect-[3/4.4] flex-col justify-between overflow-hidden rounded-[32px] border border-[#111220] bg-[#05060c] backdrop-blur-xl p-6 sm:p-7 shadow-2xl shrink-0 ${getAnimClass()}`}
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 opacity-60 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#7048E8]/30 via-transparent to-transparent" />

          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <SkillTag skill={current.skill} />
            <div className="flex items-center gap-3 text-[#999a9b]">
              <span className="text-sm font-medium text-white/80">
                {active + 1} / {total}
              </span>
              <svg
                className="h-4 w-4 text-[#999a9b] cursor-pointer hover:text-white transition-colors"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 flex flex-col items-center justify-center text-center">
            <p className="text-base sm:text-lg font-semibold text-white/80 tracking-wide">
              You said
            </p>
            <p className="mt-3 sm:mt-9 font-sans text-xl sm:text-2xl lg:text-[30px] font-medium leading-tight text-white text-center">
              <HighlightedText
                sentence={current.userSentence}
                errorWord={current.errorWord}
              />
            </p>
          </div>

          {/* Reveal Trigger */}
          <button
            onClick={() => onReveal && onReveal(active)}
            className="group mx-auto flex flex-col items-center justify-center gap-2.5 pt-4 sm:pt-6 outline-none cursor-pointer shrink-0"
          >
            <span className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#231956]/40 text-[#A27FF3] ring-1 ring-[#7048E8]/40 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#231956]/60 group-hover:ring-[#A27FF3]/60 animate-[softPulse_3s_ease-in-out_infinite]">
              <svg
                className="h-5 w-5 text-[#A27FF3] transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <span className="text-center">
              <span className="block text-base font-semibold text-[#A27FF3] transition-colors group-hover:text-[#b495f7]">
                Tap to reveal
              </span>
              <span className="mt-0.5 block text-xs text-[#999a9b] transition-colors group-hover:text-white/70">
                See the correct way and learn why.
              </span>
            </span>
          </button>
        </article>

        {/* Right Peek */}
        <div className="hidden min-w-0 flex-1 lg:block">
          <PeekCard key={`right-${active}`} card={right} side="right" />
        </div>

        {/* Right Arrow */}
        <button
          aria-label="Next card"
          onClick={() => go(1)}
          className="absolute right-0 z-20 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#231956] bg-[#05060c]/80 text-white backdrop-blur transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-white/[0.08] hover:border-[#A27FF3]/60 hover:shadow-[0_0_15px_rgba(162,127,243,0.3)] cursor-pointer lg:static"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Dots Navigation */}
      <div
        className="mt-8 sm:mt-10 lg:mt-12 flex items-center justify-center gap-2.5 shrink-0"
        role="tablist"
        aria-label="Card position"
      >
        {sampleCards.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            aria-label={`Go to card ${i + 1}`}
            onClick={() => {
              setSlideDir(i > active ? "next" : "prev");
              setActive(i);
            }}
            className={`h-2 rounded-full transition-all duration-400 ease-out cursor-pointer hover:scale-110 ${
              i === active
                ? "w-6 bg-[#A27FF3] shadow-[0_0_8px_rgba(162,127,243,0.8)]"
                : "w-2 bg-white/15 hover:bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
