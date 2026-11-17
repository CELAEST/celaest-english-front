import React, { useEffect, useState, useRef } from "react";
import { OptimizedVideo } from "../../../design-system/components/Media/OptimizedVideo";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../infrastructure/adapters/auth/supabaseClient";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { apiSettingsRepository } from "../../../infrastructure/repositories/ApiSettingsRepository";
import { ApiEntitlementRepository } from "../../../infrastructure/repositories/ApiEntitlementRepository";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { logger } from "../../../shared/utils/logger";
import { AuthUser } from "../../../application/ports/IAuthService";
import { ROUTES } from "../../../routes/routes.config";
import { AuthStatusDock } from "./AuthStatusDock";
import { AuthErrorCard } from "./AuthErrorCard";
import { AuthStageIndex } from "./AuthProgressStage";

function parseHashParams(hash: string): Record<string, string> {
  const clean = hash.replace(/^#/, "");
  const params: Record<string, string> = {};
  if (!clean) return params;
  new URLSearchParams(clean).forEach((val, key) => {
    params[key] = val;
  });
  return params;
}

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isClaimsExpired(claims: Record<string, any> | null, skewSeconds = 30): boolean {
  if (!claims || typeof claims.exp !== "number") return false;
  return Math.floor(Date.now() / 1000) >= claims.exp - skewSeconds;
}

export function isSupabaseCloudToken(claims: Record<string, any> | null): boolean {
  const iss = typeof claims?.iss === "string" ? claims.iss.toLowerCase() : "";
  return iss.includes(".supabase.co") && !iss.includes("your-project.supabase.co");
}

function formatOAuthErrorMessage(rawError: string): { title: string; description: string } {
  const lower = rawError.toLowerCase();
  if (lower.includes("access_denied") || lower.includes("cancelled") || lower.includes("canceled")) {
    return {
      title: "Google Sign-In Cancelled",
      description:
        "You closed the Google authentication window or declined permission. You can try again or use your email address.",
    };
  }
  if (lower.includes("invalid_grant") || lower.includes("expired")) {
    return {
      title: "Authorization Expired",
      description: "The authentication session timed out. Please sign in again to continue.",
    };
  }
  return {
    title: "Authentication Failed",
    description: rawError || "Unable to complete sign-in. Please verify your connection and try again.",
  };
}

const AuthCallbackViewInner: React.FC = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<AuthStageIndex>(1);
  const [errorDetails, setErrorDetails] = useState<{ title: string; description: string } | null>(null);
  const [statusMessage, setStatusMessage] = useState("Connecting your AI Mentor...");
  const [isRetryingGoogle, setIsRetryingGoogle] = useState(false);
  const isHandledRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    // Capture incoming URL handoff params synchronously BEFORE Supabase detectSessionInUrl or cached sessions mutate state
    const initialHashParams = parseHashParams(window.location.hash);
    const initialHashAccessToken = initialHashParams["access_token"] || "";
    const initialHashRefreshToken =
      initialHashParams["refresh_token"] || initialHashAccessToken;
    const initialSearchParams = new URLSearchParams(window.location.search);
    const initialCode = initialSearchParams.get("code");
    const hasExplicitUrlAuth = Boolean(initialHashAccessToken || initialCode);

    const completeAuth = async (
      accessToken: string,
      refreshToken: string,
      userPayload?: Partial<AuthUser> | null,
      options?: { fromSupabaseSession?: boolean },
    ) => {
      if (isHandledRef.current || !isMounted) return;
      isHandledRef.current = true;

      if (window.location.hash.includes("access_token")) {
        window.history.replaceState(
          {},
          "",
          window.location.pathname + window.location.search,
        );
      }

      setStage(3);
      setStatusMessage("Calibrating your learning profile...");
      const authAdapter = SupabaseAuthAdapter.getInstance();

      let activeAccessToken = accessToken;
      let activeRefreshToken = refreshToken;
      let activeUserPayload = userPayload;
      let jwtClaims = decodeJwtPayload(activeAccessToken);

      if (isSupabaseCloudToken(jwtClaims)) {
        // Hydrate & transparently refresh Supabase session if access_token expired in transit
        if (
          !options?.fromSupabaseSession &&
          activeRefreshToken &&
          activeRefreshToken !== activeAccessToken
        ) {
          try {
            const { data: sessionData, error: sessionErr } = await supabase.auth.setSession({
              access_token: activeAccessToken,
              refresh_token: activeRefreshToken,
            });
            if (sessionData?.session?.access_token) {
              activeAccessToken = sessionData.session.access_token;
              activeRefreshToken = sessionData.session.refresh_token || activeRefreshToken;
              if (sessionData.session.user) {
                activeUserPayload = {
                  id: sessionData.session.user.id,
                  email: sessionData.session.user.email || "",
                  name:
                    sessionData.session.user.user_metadata?.full_name ||
                    sessionData.session.user.user_metadata?.display_name ||
                    sessionData.session.user.email?.split("@")[0] ||
                    "Learner",
                };
              }
              jwtClaims = decodeJwtPayload(activeAccessToken);
            } else if (sessionErr) {
              logger.warn("[AuthCallback] supabase.auth.setSession notice:", sessionErr.message);
            }
          } catch (e) {
            logger.warn("[AuthCallback] supabase.auth.setSession exception:", e);
          }
        }
      } else {
        logger.info("[AuthCallback] Non-Supabase cross-service JWT detected; skipping Supabase setSession");
      }

      if (isClaimsExpired(jwtClaims)) {
        if (isMounted) {
          setErrorDetails(formatOAuthErrorMessage("expired"));
        }
        return;
      }

      const sub =
        activeUserPayload?.id || jwtClaims?.sub || jwtClaims?.user_id || `google-${Date.now()}`;
      const email = activeUserPayload?.email || jwtClaims?.email || "";
      const userMeta = jwtClaims?.user_metadata || {};
      const name =
        activeUserPayload?.name ||
        userMeta.full_name ||
        userMeta.display_name ||
        userMeta.name ||
        (email ? email.split("@")[0] : "Learner");

      const authUser: AuthUser = {
        id: sub,
        email,
        name,
        role: jwtClaims?.role || "member",
        onboardingCompleted: false,
      };

      authAdapter.persistSession(activeAccessToken, activeRefreshToken, authUser);

      try {
        const [profile, entitlement] = await Promise.all([
          apiSettingsRepository.getProfile().catch(() => null),
          ApiEntitlementRepository.getEntitlement("lingua").catch(() => null),
        ]);
        if (entitlement?.hasAccess && entitlement.aiCloudIncluded) {
          await providerKeyVault.setCentralCoreEnabled(true);
        }
        const profileHasProgress = Boolean(
          profile &&
            (profile.onboardingCompleted === true ||
              (profile.cefrLevel && profile.cefrLevel.toUpperCase() !== "B1") ||
              (profile.profession &&
                profile.profession.trim() !== "" &&
                profile.profession !== "Professional")),
        );
        const localCompleted =
          Boolean(authUser.id && localStorage.getItem(`lingua_onboarding_completed_${authUser.id}`) === "true") ||
          Boolean(authUser.email && localStorage.getItem(`lingua_onboarding_completed_${authUser.email}`) === "true");
        const isCompleted = profileHasProgress || localCompleted;

        if (isCompleted) {
          authAdapter.persistSession(activeAccessToken, activeRefreshToken, {
            ...authUser,
            onboardingCompleted: true,
          });
          localStorage.setItem("lingua_onboarding_completed", "true");
          if (authUser.id) localStorage.setItem(`lingua_onboarding_completed_${authUser.id}`, "true");
          if (authUser.email) localStorage.setItem(`lingua_onboarding_completed_${authUser.email}`, "true");
          if (isMounted) navigate(ROUTES.HOME, { replace: true });
        } else {
          authAdapter.persistSession(activeAccessToken, activeRefreshToken, {
            ...authUser,
            onboardingCompleted: false,
          });
          if (profile !== null) {
            localStorage.removeItem("lingua_onboarding_completed");
            if (authUser.id) localStorage.removeItem(`lingua_onboarding_completed_${authUser.id}`);
            if (authUser.email) localStorage.removeItem(`lingua_onboarding_completed_${authUser.email}`);
          }
          if (isMounted) navigate(ROUTES.ONBOARDING, { replace: true });
        }
      } catch (err) {
        logger.warn("[AuthCallback] Error checking onboarding completion", err);
        authAdapter.persistSession(activeAccessToken, activeRefreshToken, authUser);
        if (isMounted) navigate(ROUTES.ONBOARDING, { replace: true });
      }
    };

    // 1. Listen for Supabase auto-auth events (fired by detectSessionInUrl / OAuth)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted || isHandledRef.current) return;
      if (event === "INITIAL_SESSION" && hasExplicitUrlAuth) return;
      if (initialHashAccessToken && session?.access_token !== initialHashAccessToken) return;
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED")) {
        logger.info("[AuthCallback] onAuthStateChange event detected:", event);
        completeAuth(
          session.access_token,
          session.refresh_token,
          session.user
            ? {
                id: session.user.id,
                email: session.user.email || "",
                name:
                  session.user.user_metadata?.full_name ||
                  session.user.user_metadata?.display_name ||
                  session.user.email?.split("@")[0] ||
                  "Learner",
              }
            : null,
          { fromSupabaseSession: true },
        );
      }
    });

    // 2. Global Safety Watchdog (5 seconds maximum) — Prevents infinite hangs in any environment
    const watchdogTimer = setTimeout(async () => {
      if (!isHandledRef.current && isMounted) {
        logger.warn("[AuthCallback] Watchdog checking existing session before timeout");
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session) {
            await completeAuth(
              data.session.access_token,
              data.session.refresh_token,
              data.session.user
                ? {
                    id: data.session.user.id,
                    email: data.session.user.email || "",
                    name:
                      data.session.user.user_metadata?.full_name ||
                      data.session.user.user_metadata?.display_name ||
                      data.session.user.email?.split("@")[0] ||
                      "Learner",
                  }
                : null,
              { fromSupabaseSession: true },
            );
            return;
          }
        } catch {}

        if (isMounted && !isHandledRef.current) {
          logger.warn("[AuthCallback] Timeout reached without valid session, displaying action card");
          setErrorDetails({
            title: "Authentication Timeout",
            description: "Google took too long to respond. Please try signing in again or continue with your email.",
          });
        }
      }
    }, 5000);

    // 3. Process explicit URL tokens FIRST (Dashboard SSO #access_token or OAuth ?code), then fallback to cached session
    const processTokens = async () => {
      // Priority A: Explicit Hash Fragment Tokens (#access_token=... from Dashboard SSO or implicit OAuth)
      if (initialHashAccessToken && isMounted) {
        setStage(2);
        setStatusMessage("Securing cryptographic token handshake...");
        await completeAuth(initialHashAccessToken, initialHashRefreshToken, undefined, {
          fromSupabaseSession: false,
        });
        return;
      }

      // Priority B: URL Search Params (OAuth PKCE code or error)
      const errorParam =
        initialSearchParams.get("error_description") || initialSearchParams.get("error");

      if (errorParam && isMounted) {
        setErrorDetails(formatOAuthErrorMessage(decodeURIComponent(errorParam)));
        return;
      }

      if (initialCode && isMounted) {
        setStage(2);
        setStatusMessage("Exchanging security tokens with Google...");
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(initialCode);
          if (data?.session && isMounted) {
            await completeAuth(
              data.session.access_token,
              data.session.refresh_token,
              data.session.user
                ? {
                    id: data.session.user.id,
                    email: data.session.user.email || "",
                    name:
                      data.session.user.user_metadata?.full_name ||
                      data.session.user.user_metadata?.display_name ||
                      data.session.user.email?.split("@")[0] ||
                      "Learner",
                  }
                : null,
              { fromSupabaseSession: true },
            );
            return;
          }

          if (error) {
            logger.warn("[AuthCallback] Code exchange reported error, checking session fallback:", error.message);
            // Fallback: If code was already redeemed by Supabase detectSessionInUrl, check getSession
            const { data: fallbackData } = await supabase.auth.getSession();
            if (fallbackData?.session && isMounted) {
              await completeAuth(
                fallbackData.session.access_token,
                fallbackData.session.refresh_token,
                fallbackData.session.user
                  ? {
                      id: fallbackData.session.user.id,
                      email: fallbackData.session.user.email || "",
                      name:
                        fallbackData.session.user.user_metadata?.full_name ||
                        fallbackData.session.user.user_metadata?.display_name ||
                        fallbackData.session.user.email?.split("@")[0] ||
                        "Learner",
                    }
                  : null,
                { fromSupabaseSession: true },
              );
              return;
            }

            if (isMounted) {
              setErrorDetails(formatOAuthErrorMessage(error.message));
            }
            return;
          }
        } catch (err: any) {
          logger.error("[AuthCallback] Code exchange exception", err);
          const { data: fallbackData } = await supabase.auth.getSession().catch(() => ({ data: null }));
          if (fallbackData?.session && isMounted) {
            await completeAuth(fallbackData.session.access_token, fallbackData.session.refresh_token, undefined, {
              fromSupabaseSession: true,
            });
            return;
          }
          if (isMounted) {
            setErrorDetails(formatOAuthErrorMessage(err?.message || "Failed to exchange authorization code."));
          }
          return;
        }
      }

      // Priority C: Fallback to Existing active session (only when URL carries no explicit token/code)
      try {
        const { data: existingData } = await supabase.auth.getSession();
        if (existingData?.session && isMounted) {
          logger.info("[AuthCallback] Existing Supabase session resolved");
          await completeAuth(
            existingData.session.access_token,
            existingData.session.refresh_token,
            existingData.session.user
              ? {
                  id: existingData.session.user.id,
                  email: existingData.session.user.email || "",
                  name:
                    existingData.session.user.user_metadata?.full_name ||
                    existingData.session.user.user_metadata?.display_name ||
                    existingData.session.user.email?.split("@")[0] ||
                    "Learner",
                }
              : null,
            { fromSupabaseSession: true },
          );
        }
      } catch (err) {
        logger.warn("[AuthCallback] Initial getSession lookup notice", err);
      }
    };

    processTokens();

    return () => {
      isMounted = false;
      clearTimeout(watchdogTimer);
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleRetryGoogle = async () => {
    setIsRetryingGoogle(true);
    setErrorDetails(null);
    try {
      const { error } = await SupabaseAuthAdapter.getInstance().loginWithGoogle();
      if (error) {
        setErrorDetails(formatOAuthErrorMessage(error));
        setIsRetryingGoogle(false);
      }
    } catch {
      setErrorDetails(formatOAuthErrorMessage("Unable to initialize Google Sign In."));
      setIsRetryingGoogle(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#000003] text-slate-100 flex flex-col items-center justify-center select-none overflow-hidden font-sans">
      {/* Ambient Cosmic Hero Video Background — begin1 — fluido sin salto */}
      <OptimizedVideo
        src="/assets/begin1"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0 opacity-95 mix-blend-screen"
      />

      {/* Atmospheric Vignette & Micro Bottom Edge Softener */}
      <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#000003] to-transparent pointer-events-none z-10" />

      {/* 100% Calibrated Floating Content Overlay positioned directly below the sphere */}
      <div className="absolute top-[51%] sm:top-[50%] lg:top-[49%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-center w-full max-w-md px-4">
        {errorDetails ? (
          <AuthErrorCard
            errorDetails={errorDetails}
            isRetryingGoogle={isRetryingGoogle}
            onRetryGoogle={handleRetryGoogle}
            onContinueEmail={() => navigate(ROUTES.ONBOARDING, { replace: true })}
          />
        ) : (
          <AuthStatusDock
            statusTitle="Authenticating with Google"
            statusMessage={statusMessage}
            stage={stage}
          />
        )}
      </div>
    </div>
  );
};

export const AuthCallbackView = React.memo(AuthCallbackViewInner);

