import React from "react";
import { Card } from "../../../design-system/components/Card/Card";
import { Trophy, BookOpen, TrendingUp } from "lucide-react";

/**
 * Lab showcase: canonical premium Card primitive (design-system).
 * Every variant, padding and state lives here for visual QA.
 */
export const CardShowcase: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Default */}
      <div className="flex flex-col">
        <span className="text-xs font-mono uppercase text-[#8a8a9e] tracking-widest mb-2 block">
          default
        </span>
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-[#A27FF3]" />
            <h3 className="text-sm font-semibold text-white">Default surface</h3>
          </div>
          <p className="text-[13px] text-[#8a8a9e] leading-relaxed">
            Glass surface with layered shadow, violet bloom and 1px top sheen.
          </p>
        </Card>
      </div>

      {/* Interactive */}
      <div className="flex flex-col">
        <span className="text-xs font-mono uppercase text-[#8a8a9e] tracking-widest mb-2 block">
          interactive (hover + keyboard)
        </span>
        <Card
          interactive
          role="button"
          tabIndex={0}
          onClick={() => undefined}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") e.currentTarget.click();
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-[#A27FF3]" />
            <h3 className="text-sm font-semibold text-white">Clickable card</h3>
          </div>
          <p className="text-[13px] text-[#8a8a9e] leading-relaxed">
            Lift, glow and focus ring. Tab to it — the ring must be visible.
          </p>
        </Card>
      </div>

      {/* Accent */}
      <div className="flex flex-col">
        <span className="text-xs font-mono uppercase text-[#8a8a9e] tracking-widest mb-2 block">
          accent (violet hairline)
        </span>
        <Card variant="accent">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-[#A27FF3]" />
            <h3 className="text-sm font-semibold text-white">Accent edge</h3>
          </div>
          <p className="text-[13px] text-[#8a8a9e] leading-relaxed">
            Gradient hairline border for highlighted or active content.
          </p>
        </Card>
      </div>

      {/* Glow + inset */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <span className="text-xs font-mono uppercase text-[#8a8a9e] tracking-widest mb-2 block">
            glow (hero only)
          </span>
          <Card glow>
            <h3 className="text-sm font-semibold text-white mb-2">Hero card</h3>
            <p className="text-[13px] text-[#8a8a9e] leading-relaxed">
              Ambient bloom lights — max one per view.
            </p>
          </Card>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-mono uppercase text-[#8a8a9e] tracking-widest mb-2 block">
            inset (nested)
          </span>
          <Card variant="inset" padding="sm">
            <p className="text-[13px] text-[#8a8a9e]">Recessed surface for nested rows.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
