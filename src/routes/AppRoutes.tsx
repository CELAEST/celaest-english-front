import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "./routes.config";
import { useCurrentUser } from "../shared/hooks/useCurrentUser";
import { SupabaseAuthAdapter } from "../infrastructure/adapters/auth/SupabaseAuthAdapter";

/**
 * Feature views are code-split so each route only ships the JS it needs.
 */
const OnboardingView = lazy(() =>
  import("../features/onboarding").then((m) => ({ default: m.OnboardingView })),
);
const WorkspaceDashboardView = lazy(() =>
  import("../features/workspace").then((m) => ({ default: m.WorkspaceDashboardView })),
);
const AuthCallbackView = lazy(() =>
  import("../features/auth/components/AuthCallbackView").then((m) => ({ default: m.AuthCallbackView })),
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

/**
 * OnboardingGuard (PublicOnly / Fresh User Guard):
 * If the user has already finished onboarding and holds a session,
 * block access to /onboarding and immediately redirect to Workspace.
 */
function OnboardingRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authAdapter = SupabaseAuthAdapter.getInstance();
  const { settings } = useCurrentUser();
  const isReset = searchParams.get("reset") === "true";

  useEffect(() => {
    if (isReset) {
      localStorage.removeItem("lingua_onboarding_completed");
    }
  }, [isReset]);

  const isCompletedLocal =
    !isReset &&
    typeof window !== "undefined" &&
    localStorage.getItem("lingua_onboarding_completed") === "true";
  const hasToken = authAdapter.isAuthenticated();

  // If user is authenticated and backend confirms onboarding completion, navigate to Workspace
  useEffect(() => {
    if (!isReset && hasToken && settings?.onboardingCompleted) {
      localStorage.setItem("lingua_onboarding_completed", "true");
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isReset, hasToken, settings?.onboardingCompleted, navigate]);

  if (!isReset && hasToken && (isCompletedLocal || settings?.onboardingCompleted)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return (
    <OnboardingView
      onFinish={() => {
        localStorage.setItem("lingua_onboarding_completed", "true");
        navigate(ROUTES.HOME, { replace: true });
      }}
    />
  );
}

/**
 * WorkspaceWrapper (Protected Application Shell):
 * Demarcates private routes with Default Deny. If unauthenticated,
 * redirects cleanly to onboarding.
 */
function WorkspaceWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, settings, loading } = useCurrentUser();
  const authAdapter = SupabaseAuthAdapter.getInstance();
  const hasToken = authAdapter.isAuthenticated();

  // Global Unauthorized Event Listener (from HttpClient 401s)
  useEffect(() => {
    const handleUnauthorized = () => {
      authAdapter.logout();
      localStorage.removeItem("lingua_onboarding_completed");
      navigate(ROUTES.ONBOARDING, { replace: true });
    };

    window.addEventListener("celaest:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("celaest:unauthorized", handleUnauthorized);
    };
  }, [authAdapter, navigate]);

  // Auth & Onboarding Guard
  useEffect(() => {
    if (!hasToken) {
      navigate(ROUTES.ONBOARDING, { replace: true });
      return;
    }
    // If backend reports onboarding is genuinely not completed, redirect to diagnostic flow
    if (!loading && settings && settings.onboardingCompleted === false) {
      const isCompletedLocal = typeof window !== "undefined" && localStorage.getItem("lingua_onboarding_completed") === "true";
      if (!isCompletedLocal) {
        navigate(ROUTES.ONBOARDING, { replace: true });
      }
    }
  }, [hasToken, loading, settings, navigate]);

  const isCompletedLocal = typeof window !== "undefined" && localStorage.getItem("lingua_onboarding_completed") === "true";
  const isCompleted = isCompletedLocal || settings?.onboardingCompleted === true;

  // If unauthenticated or never completed onboarding placement diagnostic, protect workspace
  if (!hasToken || (!loading && !isCompleted && settings?.onboardingCompleted === false)) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  const getTabFromPath = (pathname: string) => {
    const clean = pathname.replace(/^\//, "");
    if (!clean) return "workspace";
    return clean;
  };

  const activeTab = getTabFromPath(location.pathname);

  const handleNavigate = (route: string) => {
    if (route === "onboarding") {
      // Intentional navigation to onboarding only permitted if logging out
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
        <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallbackView />} />
        <Route path={ROUTES.ONBOARDING} element={<OnboardingRoute />} />
        <Route path="/*" element={<WorkspaceWrapper />} />
      </Routes>
    </Suspense>
  );
};
