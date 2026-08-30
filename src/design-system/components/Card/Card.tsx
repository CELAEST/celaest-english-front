import React from "react";
import { cn } from "@shared/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * default  — canonical premium surface (glass + layered shadow + top sheen)
   * inset    — recessed surface for nested content
   * accent   — default surface with violet gradient hairline (.edge)
   */
  variant?: "default" | "inset" | "accent";
  /** Hover lift + border glow + focus ring. Only for clickable cards. */
  interactive?: boolean;
  /** Ambient violet bloom lights. Use sparingly (one hero card per view). */
  glow?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const PADDING: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 sm:p-7",
};

export const Card: React.FC<CardProps> = React.memo(
  ({
    variant = "default",
    interactive = false,
    glow = false,
    padding = "md",
    className,
    children,
    style,
    ...props
  }) => {
  const isAccent = variant === "accent";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl backdrop-blur-2xl outline-none",
        "transition-[border-color,box-shadow,transform] duration-300 ease-out",
        isAccent && "edge",
        variant === "inset"
          ? "border border-white/[0.06] bg-white/[0.02] shadow-inner"
          : "border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--card-shadow)]",
        interactive &&
          cn(
            "cursor-pointer focus-visible:ring-2 focus-visible:ring-[#A27FF3]/60",
            "hover:border-[var(--card-border-hover)] hover:bg-[var(--card-bg-hover)] hover:shadow-[var(--card-shadow-hover)]",
            "motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.99]",
            "motion-reduce:transition-none",
          ),
        PADDING[padding],
        className,
      )}
      style={isAccent ? { ...style, ["--edge" as string]: "var(--card-edge-accent)" } : style}
      {...props}
    >
      {glow && (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-36 h-36 bg-[#A27FF3] opacity-[0.12] blur-[36px]" />
          <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#bd9ad4] opacity-[0.08] blur-[28px]" />
        </div>
      )}
      {children}
    </div>
  );
});
