import React from "react";

/* ─── SVG Icons ──────────────────────────────────────── */
const ExportIcon = () => (
  <svg className="w-4 h-4 text-[#A27FF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const ResetIcon = () => (
  <svg className="w-4 h-4 text-[#A27FF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
  </svg>
);

const FeedbackIcon = () => (
  <svg className="w-4 h-4 text-[#A27FF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

const RestoreIcon = () => (
  <svg className="w-4 h-4 text-[#A27FF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>
);

interface QuickActionBtnProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const QuickActionBtn: React.FC<QuickActionBtnProps> = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-2.5 px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] text-xs sm:text-[13px] text-[#999a9b] hover:text-[#f8f8f8] hover:border-[#A27FF3]/30 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer font-light"
  >
    {icon}
    <span className="truncate">{label}</span>
  </button>
);

export const SettingsQuickActionsCard: React.FC = () => {
  return (
    <div className="rounded-3xl border border-[#111220] bg-[#05060c] p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <span className="text-sm sm:text-base font-medium text-[#f8f8f8] tracking-wide">
        Quick actions
      </span>

      {/* 2x2 Grid */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-2.5">
        <QuickActionBtn icon={<ExportIcon />} label="Export my data" />
        <QuickActionBtn icon={<ResetIcon />} label="Reset progress" />
        <QuickActionBtn icon={<FeedbackIcon />} label="Give feedback" />
        <QuickActionBtn icon={<RestoreIcon />} label="Restore purchases" />
      </div>
    </div>
  );
};
