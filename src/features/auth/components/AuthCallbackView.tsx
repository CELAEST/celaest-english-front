import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../infrastructure/adapters/auth/supabaseClient";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { apiSettingsRepository } from "../../../infrastructure/repositories/ApiSettingsRepository";
import { logger } from "../../../shared/utils/logger";
import { AuthUser } from "../../../application/ports/IAuthService";
import { ROUTES } from "../../../routes/routes.config";
import { GoogleAuthGlyph } from "../../onboarding/components/OnboardingAuthIcons";

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
  const [errorDetails, setErrorDetails] = useState<{ title: string; description: string } | null>(null);
  const [statusMessage, setStatusMessage] = useState("Connecting your AI Mentor...");
  const [isRetryingGoogle, setIsRetryingGoogle] = useState(false);

  useEffect(() => {
    let isHandled = false;

    const completeAuth = async (
      accessToken: string,
      refreshToken: string,
      userPayload?: Partial<AuthUser> | null,
    ) => {
      if (isHandled) return;
      isHandled = true;

      setStatusMessage("Calibrating your learning profile...");
      const authAdapter = SupabaseAuthAdapter.getInstance();

      // Extract user details from decoded JWT or metadata
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

      // Persist session to local storage and HTTP headers
      authAdapter.persistSession(accessToken, refreshToken, authUser);

      // Inform Supabase client of the active session (non-blocking)
      supabase.auth
        .setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        .catch((e) => logger.warn("[AuthCallback] supabase.auth.setSession background notice", e));

      // Check PostgreSQL profile to see if user has already onboarded
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

      // If user has not completed onboarding diagnostic -> clear completed flag & go to onboarding
      localStorage.removeItem("lingua_onboarding_completed");
      navigate(ROUTES.ONBOARDING, { replace: true });
    };

    // 0. Listen for active Supabase Auth State changes (Google OAuth callback)
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
      // 1. Check direct Hash Parameters (#access_token=...&refresh_token=...)
      const hashParams = parseHashParams(window.location.hash);
      const hashAccessToken = hashParams["access_token"];
      const hashRefreshToken = hashParams["refresh_token"] || hashAccessToken;

      if (hashAccessToken) {
        logger.info("[AuthCallback] Tokens successfully detected in URL hash");
        await completeAuth(hashAccessToken, hashRefreshToken);
        return;
      }

      // 2. Check Query Parameters (?code=... / ?error=...)
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error_description") || searchParams.get("error");

      if (errorParam) {
        setErrorDetails(formatOAuthErrorMessage(decodeURIComponent(errorParam)));
        return;
      }

      if (code) {
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

      // 3. Check existing Supabase session
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

      // 4. Safe timeout fallback
      setTimeout(() => {
        if (!isHandled) {
          logger.warn("[AuthCallback] Timeout reached without tokens, redirecting to onboarding");
          navigate(ROUTES.ONBOARDING, { replace: true });
        }
      }, 3500);
    };

    processTokens();

    return () => {
      isHandled = true;
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

  // 🌟 Hyper-Premium Error Screen
  if (errorDetails) {
    return (
      <div className="relative min-h-[100dvh] w-full bg-[#03030E] text-slate-100 flex items-center justify-center p-4 select-none overflow-hidden font-sans">
        {/* Ambient Cosmic Hero Orb Background */}
        <div
          className="absolute inset-0 w-full h-full bg-center bg-contain bg-no-repeat pointer-events-none z-0 opacity-90 blend-graphic-edges"
          style={{ backgroundImage: "url('/assets/pure_hero_orb_bg.png')" }}
        />
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#03030E] to-transparent pointer-events-none z-10" />

        {/* Hyper-Premium Glassmorphism Card */}
        <div className="relative z-20 w-full max-w-sm rounded-3xl bg-[#0c0c1e]/85 border border-white/10 p-7 sm:p-8 backdrop-blur-2xl text-center space-y-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-[fadeSlideUp_0.4s_ease-out_both]">
          {/* Category Branding & Pulsing Status Dot */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-[#7750a7] uppercase">
              L I N G U A
            </span>
            <div className="py-1 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-pulse" />
            </div>
          </div>

          {/* Error Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(244,63,94,0.2)]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Title & Description */}
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-light tracking-tight text-white">{errorDetails.title}</h2>
            <p className="text-xs text-[#9999b8] font-light leading-relaxed max-w-xs mx-auto">
              {errorDetails.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              disabled={isRetryingGoogle}
              onClick={handleRetryGoogle}
              className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] text-white text-xs font-medium shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {isRetryingGoogle ? (
                <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <GoogleAuthGlyph className="w-3.5 h-3.5" />
              )}
              <span>{isRetryingGoogle ? "Connecting..." : "Try Again with Google"}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(ROUTES.ONBOARDING, { replace: true })}
              className="w-full py-2 px-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#C4B5FD] hover:text-white text-xs font-light transition-all cursor-pointer"
            >
              Sign In with Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🌟 Hyper-Premium Cosmic Loader Screen
  return (
    <div className="relative min-h-[100dvh] w-full bg-[#03030E] text-slate-100 flex flex-col items-center justify-center p-4 select-none overflow-hidden font-sans">
      {/* Ambient Cosmic Hero Orb Background */}
      <div
        className="absolute inset-0 w-full h-full bg-center bg-contain bg-no-repeat pointer-events-none z-0 opacity-90 blend-graphic-edges"
        style={{ backgroundImage: "url('/assets/pure_hero_orb_bg.png')" }}
      />
      <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#03030E] to-transparent pointer-events-none z-10" />

      {/* Floating Center Loader Core */}
      <div className="relative z-20 flex flex-col items-center space-y-4 text-center max-w-sm animate-[fadeSlideUp_0.4s_ease-out_both]">
        {/* Category Branding & Pulsing Status Dot */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-[#7750a7] uppercase">
            L I N G U A
          </span>
          <div className="py-1.5 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shadow-[0_0_12px_#8B5CF6] animate-pulse" />
          </div>
        </div>

        {/* Multi-Ring Energy Orbital Loader */}
        <div className="relative w-16 h-16 flex items-center justify-center my-2">
          <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 border-t-[#8B5CF6] border-r-[#6366F1] animate-spin" />
          <div className="absolute inset-2 rounded-full border border-indigo-500/30 border-b-[#A27FF3] animate-[spin_1.5s_linear_infinite_reverse]" />
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#A27FF3] shadow-[0_0_15px_#8B5CF6] animate-pulse" />
        </div>

        {/* Dynamic Status Label */}
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-light text-white tracking-tight">Authenticating with Google</h2>
          <p className="text-xs text-[#9999b8] font-light tracking-wide animate-pulse">{statusMessage}</p>
        </div>
      </div>
    </div>
  );
};

