import React, { useState, useCallback } from "react";
import { cn } from "@shared/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * default      — canonical premium surface (deep black glass + specular hairline + layered shadow)
   * inset        — recessed surface for nested content
   * accent       — default surface with violet gradient hairline (.edge)
   * spotlight    — dynamic cursor-following spotlight glow (Linear / Vercel style)
   * holographic  — prismatic iridescent gradient border (Apple Vision Pro style)
   * mesh         — breathing cosmic multi-point nebula bloom
   * velvet-inset — deep dark velvet recessed surface with inner rim
   */
  variant?: "default" | "inset" | "accent" | "spotlight" | "holographic" | "mesh" | "velvet-inset";
  /** Hover lift + border glow + focus ring. Only for clickable cards. */
  interactive?: boolean;
  /** Ambient violet bloom lights. Use sparingly (one hero card per view). */
  glow?: boolean;
  /** Enable dynamic cursor-following spotlight beam on hover */
  spotlight?: boolean;
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
    spotlight = false,
    padding = "md",
    className,
    children,
    style,
    onMouseMove,
    onMouseLeave,
    ...props
  }) => {
    const isAccent = variant === "accent";
    const isHolographic = variant === "holographic";
    const isMesh = variant === "mesh";
    const isVelvet = variant === "velvet-inset";
    const hasSpotlight = spotlight || variant === "spotlight";

    const [mousePos, setMousePos] = useState<{ x: number; y: number; opacity: number }>({
      x: 0,
      y: 0,
      opacity: 0,
    });

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (hasSpotlight) {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            opacity: 1,
          });
        }
        onMouseMove?.(e);
      },
      [hasSpotlight, onMouseMove],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (hasSpotlight) {
          setMousePos((prev) => ({ ...prev, opacity: 0 }));
        }
        onMouseLeave?.(e);
      },
      [hasSpotlight, onMouseLeave],
    );

    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl outline-none",
          "transition-[border-color,box-shadow,transform] duration-300 ease-out",
          isAccent && "edge",
          isHolographic && "border border-transparent bg-[#04040A] shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)]",
          isMesh && "border border-white/[0.07] bg-[#04040A] shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)]",
          isVelvet && "border border-white/[0.04] bg-[#04040A] shadow-[inset_0_2px_12px_rgba(0,0,0,0.7),inset_0_0_1px_rgba(255,255,255,0.1)]",
          variant === "inset" && "border border-white/[0.06] bg-white/[0.02] shadow-inner",
          (variant === "default" || variant === "spotlight") && "border border-white/[0.07] bg-[#04040A] shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-white/[0.12]",
          interactive &&
            cn(
              "cursor-pointer focus-visible:ring-2 focus-visible:ring-white/30",
              "hover:border-white/[0.15]",
              "motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.99]",
              "motion-reduce:transition-none",
            ),
          PADDING[padding],
          className,
        )}
        style={isAccent ? { ...style, ["--edge" as string]: "var(--card-edge-accent)" } : style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Top Specular Hairline (all variants) */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none z-20"
        />

        {/* Holographic Prismatic Border Sheen */}
        {isHolographic && (
          <div
            aria-hidden="true"
            className="absolute -inset-[1px] rounded-3xl pointer-events-none p-[1px] bg-gradient-to-r from-white/20 via-white/10 to-white/20 -z-10 [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude]"
          />
        )}

        {/* Dynamic Cursor-Following Spotlight Beam */}
        {hasSpotlight && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 -z-0"
            style={{
              opacity: mousePos.opacity,
              background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.08), transparent 75%)`,
            }}
          />
        )}

        {/* Cosmic Mesh Floating Nebula Lights */}
        {isMesh && (
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
            <div className="absolute top-0 left-1/4 w-48 h-48 bg-white opacity-[0.04] blur-[48px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-white opacity-[0.03] blur-[40px] animate-pulse" style={{ animationDelay: "1.5s" }} />
          </div>
        )}

        {/* Ambient Bloom Lights (Hero) */}
        {glow && (
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
            <div className="absolute -top-10 -left-10 w-36 h-36 bg-white opacity-[0.06] blur-[36px]" />
            <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-white opacity-[0.04] blur-[28px]" />
          </div>
        )}

        {/* Card Content */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  },
);
