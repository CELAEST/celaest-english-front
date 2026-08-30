import React, { useEffect } from "react";
import { ConversationRightPanel, ConversationRightPanelProps } from "./ConversationRightPanel";

export interface SessionCardsSidenavProps {
  isOpen: boolean;
  onClose: () => void;
  panelProps: ConversationRightPanelProps;
}

const SessionCardsSidenavInner: React.FC<SessionCardsSidenavProps> = ({
  isOpen,
  onClose,
  panelProps,
}) => {
  // ESC key listener to close smoothly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 select-none">
      {/* 1. Clean backdrop (No radial color degradado) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 cursor-pointer animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* 2. Floating Cards Column (Clean right-side deployment) */}
      <div className="fixed top-3 right-3 sm:right-6 bottom-3 w-[330px] sm:w-[350px] z-50 pointer-events-none flex flex-col">
        {/* Scrollable Floating Cards Stack */}
        <div className="pointer-events-auto flex-1 overflow-y-auto no-scrollbar py-1 px-1 animate-[slideInRight_0.3s_cubic-bezier(0.16,1,0.3,1)]">
          <ConversationRightPanel {...panelProps} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export const SessionCardsSidenav = React.memo(SessionCardsSidenavInner);
