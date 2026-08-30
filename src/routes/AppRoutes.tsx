import React, { lazy, Suspense } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "./routes.config";
import { useCurrentUser } from "../shared/hooks/useCurrentUser";

/**
 * Feature views are code-split so each route only ships the JS it needs.
 */
const OnboardingView = lazy(() =>
  import("../features/onboarding").then((m) => ({ default: m.OnboardingView })),
);
const WorkspaceDashboardView = lazy(() =>
  import("../features/workspace").then((m) => ({ default: m.WorkspaceDashboardView })),
);

function RouteFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#000006]"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <span
        className="h-10 w-10 animate-pulse rounded-full bg-accent-violet-500/70"
        aria-hidden="true"
      />
    </div>
  );
}

function OnboardingRoute() {
  const navigate = useNavigate();
  return <OnboardingView onFinish={() => navigate(ROUTES.HOME, { replace: true })} />;
}

function WorkspaceWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, settings } = useCurrentUser();

  const getTabFromPath = (pathname: string) => {
    const clean = pathname.replace(/^\//, "");
    if (!clean) return "workspace";
    return clean;
  };

  const activeTab = getTabFromPath(location.pathname);

  const handleNavigate = (route: string) => {
    if (route === "onboarding") {
      navigate(ROUTES.ONBOARDING);
    } else if (route === "workspace") {
      navigate(ROUTES.HOME);
    } else {
      navigate(`/${route}`);
    }
  };

  const displayName = settings.name || user?.name || "Learner";
  const displayLevel = settings.cefrLevel || "B1 Level";

  return (
    <WorkspaceDashboardView
      userName={displayName}
      userLevel={displayLevel}
      defaultTab={activeTab}
      onNavigate={handleNavigate}
    />
  );
}

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path={ROUTES.ONBOARDING} element={<OnboardingRoute />} />
        <Route path="/*" element={<WorkspaceWrapper />} />
      </Routes>
    </Suspense>
  );
};
