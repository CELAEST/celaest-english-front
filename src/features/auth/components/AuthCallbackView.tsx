import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../infrastructure/adapters/auth/supabaseClient";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { apiSettingsRepository } from "../../../infrastructure/repositories/ApiSettingsRepository";
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

export const AuthCallbackView: React.FC = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<AuthStageIndex>(1);
  const [errorDetails, setErrorDetails] = useState<{ title: string; description: string } | null>(null);
  const [statusMessage, setStatusMessage] = useState("Connecting your AI Mentor...");
  const [isRetryingGoogle, setIsRetryingGoogle] = useState(false);
  const isHandledRef = useRef(false);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const completeAuth = async (
      accessToken: string,
      refreshToken: string,
      userPayload?: Partial<AuthUser> | null,
    ) => {
      if (isHandledRef.current) return;
      isHandledRef.current = true;
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }

      setStage(3);
      setStatusMessage("Calibrating your learning profile...");
      const authAdapter = SupabaseAuthAdapter.getInstance();

      const jwtClaims = decodeJwtPayload(accessToken);
      const sub = userPayload?.id || jwtClaims?.sub || jwtClaims?.user_id || `google-${Date.now()}`;
      const email = userPayload?.email || jwtClaims?.email || "";
      const userMeta = jwtClaims?.user_metadata || {};
      const name =
        userPayload?.name ||
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

      authAdapter.persistSession(accessToken, refreshToken, authUser);

      supabase.auth
        .setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        .catch((e) => logger.warn("[AuthCallback] supabase.auth.setSession background notice", e));

      try {
        const profile = await Promise.race([
          apiSettingsRepository.getProfile(),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
        ]);

        if (profile && profile.onboardingCompleted) {
          localStorage.setItem("lingua_onboarding_completed", "true");
          navigate(ROUTES.HOME, { replace: true });
          return;
        }
      } catch (err) {
        logger.warn("[AuthCallback] Profile fetch check bypassed for new user", err);
      }

      localStorage.removeItem("lingua_onboarding_completed");
      navigate(ROUTES.ONBOARDING, { replace: true });
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
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
        );
      }
    });

    const processTokens = async () => {
      const hashParams = parseHashParams(window.location.hash);
      const hashAccessToken = hashParams["access_token"];
      const hashRefreshToken = hashParams["refresh_token"] || hashAccessToken;

      if (hashAccessToken) {
        setStage(2);
        setStatusMessage("Securing cryptographic token handshake...");
        await completeAuth(hashAccessToken, hashRefreshToken);
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error_description") || searchParams.get("error");

      if (errorParam) {
        setErrorDetails(formatOAuthErrorMessage(decodeURIComponent(errorParam)));
        return;
      }

      if (code) {
        setStage(2);
        setStatusMessage("Exchanging security tokens with Google...");
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setErrorDetails(formatOAuthErrorMessage(error.message));
            return;
          }
          if (data.session) {
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
            );
            return;
          }
        } catch (err: any) {
          logger.error("[AuthCallback] Code exchange exception", err);
          setErrorDetails(formatOAuthErrorMessage(err?.message || "Failed to exchange authorization code."));
          return;
        }
      }

      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
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
          );
          return;
        }
      } catch (err) {
        logger.warn("[AuthCallback] Session lookup fallback", err);
      }

      timeoutIdRef.current = setTimeout(() => {
        if (!isHandledRef.current) {
          logger.warn("[AuthCallback] Timeout reached without tokens, redirecting to onboarding");
          navigate(ROUTES.ONBOARDING, { replace: true });
        }
      }, 3500);
    };

    processTokens();

    return () => {
      isHandledRef.current = true;
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
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
    <div className="relative min-h-[100dvh] w-full bg-[#03030E] text-slate-100 flex flex-col items-center justify-center select-none overflow-hidden font-sans">
      {/* Ambient Cosmic Hero Video Background — begin1 — fluido sin salto */}
      <video
        src="/assets/begin1.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0 opacity-95 mix-blend-screen"
        style={{ willChange: "transform", backfaceVisibility: "hidden", transform: "translateZ(0)" }}
      />

      {/* Atmospheric Vignette & Micro Bottom Edge Softener */}
      <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#03030E] to-transparent pointer-events-none z-10" />

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
