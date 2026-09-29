import React, { lazy, Suspense, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
  useSearchParams,
} from "react-router-dom";
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
  import("../features/auth/components/AuthCallbackView").then((m) => ({
    default: m.AuthCallbackView,
  })),
);

function RouteFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#000003]"
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
  const { user, settings } = useCurrentUser();
  const isReset = searchParams.get("reset") === "true";

  useEffect(() => {
    if (isReset) {
      localStorage.removeItem("lingua_onboarding_completed");
      if (user?.id) localStorage.removeItem(`lingua_onboarding_completed_${user.id}`);
      if (user?.email) localStorage.removeItem(`lingua_onboarding_completed_${user.email}`);
    }
  }, [isReset, user?.id, user?.email]);

  const hasToken = authAdapter.isAuthenticated();
  const storedUser = authAdapter.getStoredUser();
  const uid = user?.id || storedUser?.id;
  const uemail = user?.email || storedUser?.email;

  const isUserCompleted = Boolean(
    (uid && localStorage.getItem(`lingua_onboarding_completed_${uid}`) === "true") ||
    (uemail && localStorage.getItem(`lingua_onboarding_completed_${uemail}`) === "true") ||
    settings.onboardingCompleted === true ||
    storedUser?.onboardingCompleted === true
  );

  // If user is authenticated AND has completed onboarding, navigate immediately to Workspace
  useEffect(() => {
    if (!isReset && hasToken && isUserCompleted) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isReset, hasToken, isUserCompleted, navigate]);

  if (!isReset && hasToken && isUserCompleted) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return (
    <OnboardingView
      onFinish={() => {
        if (uid) localStorage.setItem(`lingua_onboarding_completed_${uid}`, "true");
        if (uemail) localStorage.setItem(`lingua_onboarding_completed_${uemail}`, "true");
        localStorage.setItem("lingua_onboarding_completed", "true");
        navigate(ROUTES.HOME, { replace: true });
      }}
    />
  );
}

/**
 * WorkspaceWrapper (Protected Application Shell):
 * Demarcates private routes with Default Deny. If unauthenticated or onboarding not finished,
 * redirects cleanly to onboarding.
 */
function WorkspaceWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, settings } = useCurrentUser();
  const authAdapter = SupabaseAuthAdapter.getInstance();
  const hasToken = authAdapter.isAuthenticated();
  const storedUser = authAdapter.getStoredUser();
  const uid = user?.id || storedUser?.id;
  const uemail = user?.email || storedUser?.email;

  const isUserCompleted = Boolean(
    (uid && localStorage.getItem(`lingua_onboarding_completed_${uid}`) === "true") ||
    (uemail && localStorage.getItem(`lingua_onboarding_completed_${uemail}`) === "true") ||
    settings.onboardingCompleted === true ||
    storedUser?.onboardingCompleted === true
  );

  // Global Unauthorized Event Listener (from HttpClient 401s)
  useEffect(() => {
    const handleUnauthorized = () => {
      authAdapter.logout();
      navigate(ROUTES.ONBOARDING, { replace: true });
    };

    window.addEventListener("celaest:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("celaest:unauthorized", handleUnauthorized);
    };
  }, [authAdapter, navigate]);

  // Auth & Onboarding Guard: Unauthenticated or incomplete users redirected to onboarding
  useEffect(() => {
    if (!hasToken || !isUserCompleted) {
      navigate(ROUTES.ONBOARDING, { replace: true });
    }
  }, [hasToken, isUserCompleted, navigate]);

  if (!hasToken || !isUserCompleted) {
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
  const displayLevel = settings.cefrLevel || "B1";

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
  const navigate = useNavigate();
  const authAdapter = SupabaseAuthAdapter.getInstance();

  useEffect(() => {
    const handleUnauthorized = () => {
      authAdapter.clearDeadToken();
      navigate(ROUTES.ONBOARDING, { replace: true });
    };

    window.addEventListener("celaest:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("celaest:unauthorized", handleUnauthorized);
    };
  }, [authAdapter, navigate]);

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
