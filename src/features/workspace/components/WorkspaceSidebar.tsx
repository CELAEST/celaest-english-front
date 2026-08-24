import React, { useState } from 'react';

export interface WorkspaceSidebarProps {
  userName?: string;
  userLevel?: string;
  activeItem?: string;
  onSelectNav?: (route: string) => void;
}

// Official CELAEST logo path extracted directly from landing-celaest
const CELAEST_LOGO_VIEWBOX = { width: 380, height: 503 };
const CELAEST_LOGO_PATH_D = "M374.479 1.73333C374.479 4.53333 362.346 27.7333 355.813 37.3333C340.079 60.8 316.213 85.6 292.746 103.067C272.879 117.867 264.879 122.8 227.413 142.933C209.813 152.4 192.746 161.867 189.413 164.267C170.213 177.2 157.279 190.533 149.813 205.333L146.079 212.667L144.479 201.867C142.079 185.333 135.946 168.4 129.013 158.4C125.813 154 125.813 153.333 128.879 153.333C133.679 153.333 145.279 146.267 151.013 139.867C156.746 133.6 162.479 121.467 162.479 116C162.479 113.867 161.679 114 155.813 118C146.079 124.533 136.879 127.333 125.146 127.2C116.879 127.2 113.013 126.267 102.479 122.133C73.4127 110.533 61.0127 110.533 44.346 122C37.946 126.4 36.6127 126.8 26.346 127.067C17.4127 127.333 13.546 128.133 7.54603 130.933C-0.853972 134.8 -2.32064 137.333 3.54603 137.333C14.8794 137.333 37.4127 150.133 46.746 161.867C53.8127 170.667 59.4127 182.533 61.8127 194.133C64.346 206.267 64.346 229.867 61.6794 251.333C58.746 274 58.746 305.067 61.6794 320.667C66.0794 344.533 75.146 366.667 88.746 386.933C95.546 396.933 111.013 414.267 117.146 418.667L120.879 421.333L117.413 411.6C114.479 403.467 113.946 399.333 113.546 384L113.146 366L117.013 380.667C126.746 418.133 140.213 440.4 163.279 456.8C171.013 462.4 184.346 469.067 191.813 471.333C194.746 472.133 194.479 471.6 189.679 466.533C179.413 455.733 168.879 436.667 162.613 417.6C156.213 398.267 156.613 397.333 165.146 412.667C176.879 433.6 186.613 446.8 201.146 461.333C228.479 488.8 255.546 500.8 293.146 502.133L311.146 502.8L300.346 496.933C271.813 481.333 243.946 457.867 223.946 432.667C211.279 416.8 211.679 415.6 225.279 428.8C243.946 446.8 255.946 454 272.746 457.067L279.813 458.267L271.679 449.733C267.279 444.933 262.479 438.533 260.879 435.467C258.613 430.667 257.146 429.467 251.279 427.467C235.146 421.867 216.479 407.6 204.346 391.6C193.546 377.333 182.479 351.2 182.479 340C182.479 336.8 183.279 336.267 195.413 332.933C225.146 324.533 252.746 308.533 274.879 286.667C281.946 279.6 287.813 273.2 287.813 272.4C287.813 271.467 284.879 271.867 279.946 273.333C270.213 276.4 254.213 278.667 243.413 278.533L235.146 278.4L245.813 274.8C262.213 269.067 284.746 258.533 295.146 251.867C312.879 240.4 327.679 224.267 336.346 207.067C341.546 196.533 341.013 195.2 333.279 200.667C319.413 210.667 292.746 220.533 273.279 223.067C268.213 223.733 269.546 222.667 284.613 215.333C337.679 189.333 366.213 156.933 371.146 116.933L372.079 109.2L357.679 123.733C341.146 140.267 323.946 152.267 302.479 162.533C282.346 172 280.213 172 293.813 162.667C335.679 133.867 364.746 98.4 375.279 63.3333C378.346 52.8 378.879 48.9333 379.013 32C379.146 12 377.946 -7.91252e-06 375.679 -7.91252e-06C375.013 -7.91252e-06 374.479 0.799992 374.479 1.73333Z";

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  userName = 'Esteban',
  userLevel = 'B1 Level',
  activeItem = 'workspace',
  onSelectNav,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { id: 'workspace', icon: <DashboardGridIcon />, label: 'Workspace' },
    { id: 'memory', icon: <MemoryBrainIcon />, label: 'Memory', hasDot: true },
    { id: 'interview', icon: <MicIcon />, label: 'Interview' },
    { id: 'reading', icon: <BookReadingIcon />, label: 'Reading' },
    { id: 'writing', icon: <DocumentPracticeIcon />, label: 'Writing' },
    { id: 'lab', icon: <LabFlaskIcon />, label: 'Design Lab' },
    { id: 'settings', icon: <SettingsIcon />, label: 'Settings' },
  ];

  return (
    <div className="relative shrink-0 my-auto ml-12 sm:ml-16 lg:ml-20 z-50 w-16 h-[75vh] flex items-center">
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`absolute left-0 top-1/2 -translate-y-1/2 flex flex-col justify-between bg-[#05060c]/95 border border-[#111220] rounded-[32px] py-4 px-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl shrink-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none group max-h-[75vh] ${
          isHovered ? 'w-60 px-4' : 'w-16'
        }`}
      >
        {/* Top Brand / Active Pill Header */}
        <div className="flex flex-col items-center w-full space-y-4">
          {/* Top Active Dashboard Button with Official CELAEST Logo SVG */}
          <div className="w-full flex items-center justify-center">
            <div className="w-11 h-11 rounded-2xl bg-[#080912] border border-[#231956] text-white shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#111220] transition-all p-2.5">
              <svg
                viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-white"
              >
                <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
              </svg>
            </div>
            {isHovered && (
              <span className="ml-3.5 text-base font-bold text-[#f8f8f8] tracking-[0.15em] whitespace-nowrap opacity-100 transition-opacity duration-300 delay-75 uppercase">
                CELAEST
              </span>
            )}
          </div>

          {/* Separator Line */}
          <div className="w-8 h-[1px] bg-[#111220] my-0.5" />

          {/* Navigation Item Stack */}
          <nav className="flex flex-col w-full space-y-2">
            {navItems.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectNav && onSelectNav(item.id)}
                  className={`relative flex items-center w-full py-2.5 rounded-2xl transition-all duration-200 group/btn cursor-pointer ${
                    isHovered ? 'px-3.5 justify-start' : 'justify-center'
                  } ${
                    isActive
                      ? 'bg-[#111220] text-[#f8f8f8] border border-[#231956]'
                      : 'text-[#f8f8f8]/75 hover:bg-[#111220]/60 hover:text-[#f8f8f8]'
                  }`}
                >
                  {/* Active Indicator Glow Bar */}
                  {isActive && (
                    <div className="absolute left-0 w-1 h-5 rounded-r-full bg-[#f8f8f8]" />
                  )}

                  {/* Icon (White) */}
                  <div className="flex items-center justify-center w-6 h-6 shrink-0 text-[#f8f8f8]">
                    {React.cloneElement(item.icon as React.ReactElement, {
                      className: 'w-5 h-5 text-[#f8f8f8] group-hover/btn:scale-110 transition-transform',
                    })}
                  </div>

                  {/* Label Revealed on Hover */}
                  {isHovered && (
                    <span
                      className={`ml-3.5 text-sm font-normal tracking-wide whitespace-nowrap transition-opacity duration-300 delay-75 ${
                        isActive ? 'text-[#f8f8f8] font-medium' : 'text-[#f8f8f8]/80 group-hover/btn:text-[#f8f8f8]'
                      }`}
                    >
                      {item.label}
                    </span>
                  )}

                  {/* Notification Dot (Memory) */}
                  {'hasDot' in item && (item as { hasDot?: boolean }).hasDot && (
                    <div className={`w-2 h-2 rounded-full bg-[#A27FF3] shadow-[0_0_6px_rgba(162,127,243,0.6)] ${
                      isHovered ? 'ml-2' : 'absolute top-1.5 right-1.5'
                    }`} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Profile & Logout */}
        <div className="flex flex-col items-center w-full space-y-2 mt-4">
          {/* Separator Line */}
          <div className="w-8 h-[1px] bg-[#111220] my-0.5" />

          {/* User Profile Capsule Item */}
          <button
            onClick={() => onSelectNav && onSelectNav('onboarding')}
            className={`flex items-center w-full py-2 rounded-2xl hover:bg-[#111220] transition-all cursor-pointer group/user ${
              isHovered ? 'px-2 justify-start' : 'justify-center'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-[#111220] border border-[#231956] flex items-center justify-center text-[#f8f8f8] font-medium text-sm shadow-[0_2px_10px_rgba(0,0,0,0.4)] shrink-0">
              {userName.charAt(0)}
            </div>
            {isHovered && (
              <div className="flex flex-col items-start ml-3 overflow-hidden text-left">
                <span className="text-sm font-medium text-[#f8f8f8] truncate">{userName}</span>
                <span className="text-[10px] text-[#f8f8f8]/60 font-light tracking-wider uppercase truncate">{userLevel}</span>
              </div>
            )}
          </button>

          {/* Logout Button matching bottom item in reference image with white icon */}
          <button
            onClick={() => onSelectNav && onSelectNav('onboarding')}
            className={`flex items-center w-full py-2.5 rounded-2xl text-[#f8f8f8] hover:bg-[#111220] transition-all cursor-pointer group/logout ${
              isHovered ? 'px-3.5 justify-start' : 'justify-center'
            }`}
          >
            <div className="flex items-center justify-center w-6 h-6 shrink-0 text-[#f8f8f8]">
              <LogoutIcon className="w-5 h-5 text-[#f8f8f8] group-hover/logout:scale-110 transition-transform" />
            </div>
            {isHovered && (
              <span className="ml-3.5 text-sm font-normal tracking-wide whitespace-nowrap text-[#f8f8f8]">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
};

// SVG Icons matching reference image
const DashboardGridIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="7" height="7" rx="2" />
    <rect x="14" y="3" width="7" height="7" rx="2" />
    <rect x="14" y="14" width="7" height="7" rx="2" />
    <rect x="3" y="14" width="7" height="7" rx="2" />
  </svg>
);

const MicIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const BookReadingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const DocumentPracticeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const MemoryBrainIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-4 4 4 4 0 0 0 3 3.87V17a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4v-2.13A4 4 0 0 0 20 11a4 4 0 0 0-4-4V6a4 4 0 0 0-4-4z" />
    <path d="M12 2v20" />
    <path d="M8 8h0" />
    <path d="M16 8h0" />
    <path d="M8 16h0" />
    <path d="M16 16h0" />
  </svg>
);

const LabFlaskIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 2v7.31M14 2v7.31M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0" />
  </svg>
);

