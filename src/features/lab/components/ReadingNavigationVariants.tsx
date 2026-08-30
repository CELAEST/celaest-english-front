import React, { useState } from "react";

export const ReadingNavigationVariants: React.FC = () => {
  const [activeVariant, setActiveVariant] = useState<
    "split-minimal" | "integrated-bar" | "floating-edges"
  >("split-minimal");
  const [currentPage, setCurrentPage] = useState<number>(3);
  const totalPages = 6;
  const progressPercent = Math.round((currentPage / totalPages) * 100);

  const prev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const next = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="flex flex-col space-y-4 p-6 rounded-3xl bg-[#070714]/80 border border-white/[0.06] backdrop-blur-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white tracking-wide">
            Reading Navigation Lab
          </h3>
          <p className="text-xs text-[#8a8a9e]">
            Comparing container-less, split, and integrated bottom bar UX/UI designs
          </p>
        </div>

        {/* Variant Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-[#0c0c20] border border-white/[0.06] text-xs">
          <button
            onClick={() => setActiveVariant("split-minimal")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeVariant === "split-minimal"
                ? "bg-[#A27FF3] text-white font-medium shadow-[0_0_12px_rgba(162,127,243,0.5)]"
                : "text-[#8a8a9e] hover:text-white"
            }`}
          >
            Variant A: Clean Split
          </button>
          <button
            onClick={() => setActiveVariant("integrated-bar")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeVariant === "integrated-bar"
                ? "bg-[#A27FF3] text-white font-medium shadow-[0_0_12px_rgba(162,127,243,0.5)]"
                : "text-[#8a8a9e] hover:text-white"
            }`}
          >
            Variant B: Integrated Line
          </button>
          <button
            onClick={() => setActiveVariant("floating-edges")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeVariant === "floating-edges"
                ? "bg-[#A27FF3] text-white font-medium shadow-[0_0_12px_rgba(162,127,243,0.5)]"
                : "text-[#8a8a9e] hover:text-white"
            }`}
          >
            Variant C: Floating Edges
          </button>
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="w-full p-8 rounded-2xl bg-[#030208] border border-white/[0.04] flex flex-col justify-center min-h-[160px]">
        {/* VARIANT A: CLEAN SPLIT (Zero Centered Pill Container, Buttons on Left and Right Sides) */}
        {activeVariant === "split-minimal" && (
          <div className="w-full max-w-[580px] mx-auto flex flex-col space-y-3">
            {/* Progress line */}
            <div className="w-full flex flex-col space-y-1.5">
              <div className="flex items-center justify-between text-xs font-light">
                <span className="text-[#8a8a9e]">2 min read remaining</span>
                <span className="text-[#A27FF3] font-semibold">{progressPercent}%</span>
              </div>
              <div className="w-full h-[2.5px] bg-[#111220] rounded-full relative flex items-center">
                <div
                  className="h-full bg-[#A27FF3] rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(162,127,243,0.8)]"
                  style={{ width: `${progressPercent}%` }}
                />
                <div
                  className="w-2.5 h-2.5 rounded-full bg-[#A27FF3] shadow-[0_0_10px_rgba(162,127,243,0.9)] absolute -translate-x-1/2"
                  style={{ left: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Split Controls on Both Ends (No Pill Box) */}
            <div className="w-full flex items-center justify-between pt-1">
              <button
                onClick={prev}
                disabled={currentPage === 1}
                className={`flex items-center space-x-2 text-xs transition-all cursor-pointer ${
                  currentPage > 1
                    ? "text-[#8a8a9e] hover:text-white hover:-translate-x-0.5"
                    : "text-[#8a8a9e]/30 cursor-not-allowed"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>Previous page</span>
              </button>

              <span className="text-xs font-mono tracking-widest text-[#7e8096]">
                <strong className="text-white font-medium">
                  {String(currentPage).padStart(2, "0")}
                </strong>{" "}
                / {String(totalPages).padStart(2, "0")}
              </span>

              <button
                onClick={next}
                disabled={currentPage === totalPages}
                className={`flex items-center space-x-2 text-xs transition-all cursor-pointer ${
                  currentPage < totalPages
                    ? "text-[#A27FF3] hover:text-[#C4B5FD] hover:translate-x-0.5 font-medium"
                    : "text-[#8a8a9e]/30 cursor-not-allowed"
                }`}
              >
                <span>Next page</span>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* VARIANT B: INTEGRATED LINE */}
        {activeVariant === "integrated-bar" && (
          <div className="w-full max-w-[580px] mx-auto flex items-center justify-between gap-4">
            <button
              onClick={prev}
              disabled={currentPage === 1}
              className={`p-2 rounded-xl bg-[#090918] border border-white/[0.06] hover:bg-[#12122b] text-white transition-all cursor-pointer ${
                currentPage === 1 ? "opacity-30 cursor-not-allowed" : ""
              }`}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="flex-1 flex flex-col space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#8a8a9e]">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <span className="text-[#A27FF3] font-semibold">{progressPercent}%</span>
              </div>
              <div className="w-full h-[3px] bg-[#111220] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7048E8] to-[#A27FF3] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={next}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-xl bg-[#090918] border border-white/[0.06] hover:bg-[#12122b] text-white transition-all cursor-pointer ${
                currentPage === totalPages ? "opacity-30 cursor-not-allowed" : ""
              }`}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}

        {/* VARIANT C: FLOATING EDGES */}
        {activeVariant === "floating-edges" && (
          <div className="w-full max-w-[580px] mx-auto flex flex-col space-y-3">
            <div className="w-full h-[2px] bg-[#111220] relative">
              <div
                className="h-full bg-[#A27FF3] shadow-[0_0_10px_#A27FF3]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[#8a8a9e]">
              <span>Section 0{currentPage}</span>
              <div className="flex items-center space-x-3">
                <button onClick={prev} className="hover:text-white p-1 cursor-pointer">
                  {" "}
                  Prev
                </button>
                <span className="text-[#A27FF3] font-mono">
                  0{currentPage} / 0{totalPages}
                </span>
                <button onClick={next} className="hover:text-white p-1 cursor-pointer">
                  Next{" "}
                </button>
              </div>
              <span>{progressPercent}% Complete</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
