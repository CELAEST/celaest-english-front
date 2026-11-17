/**
 * Adapter: SupabaseAuthAdapter
 *
 * Concrete implementation of IAuthService that communicates with the
 * CELAEST Centralized Auth Service (celaest-back -> Supabase).
 */

import { IAuthService, AuthResult, AuthUser } from "../../../application/ports/IAuthService";
import { HttpClient } from "../../http/HttpClient";
import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";
import { supabase } from "./supabaseClient";
import { StorageLifecycleService } from "../../../shared/services/storageLifecycleService";

const ACCESS_TOKEN_KEY = "lingua_access_token";
const REFRESH_TOKEN_KEY = "lingua_refresh_token";
const USER_KEY = "lingua_auth_user";

export function formatAuthErrorMessage(rawMsg: string): string {
  if (!rawMsg) return "Authentication error. Please verify your credentials.";
  const lower = rawMsg.toLowerCase();
  if (lower.includes("user_already_exists") || lower.includes("already registered") || lower.includes("already exists")) {
    return "This email is already registered. Please sign in instead.";
  }
  if (lower.includes("invalid_credentials") || lower.includes("invalid login credentials") || lower.includes("invalid email or password")) {
    return "Incorrect email or password. Please verify your credentials.";
  }
  if (lower.includes("weak_password") || lower.includes("at least 6 characters")) {
    return "Password must be at least 6 characters long.";
  }
  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Too many attempts. Please wait a moment before trying again.";
  }
  try {
    const jsonMatch = rawMsg.match(/\{.*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.msg) return formatAuthErrorMessage(parsed.msg);
      if (parsed.message) return formatAuthErrorMessage(parsed.message);
    }
  } catch {
    // ignore json parse error
  }
  return rawMsg;
}

export function isJwtExpired(token: string | null): boolean {
  if (!token || typeof token !== "string") return true;
  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      // Non-JWT token (e.g. mock test tokens without payload)
      return false;
    }
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;

    let jsonStr: string;
    if (typeof atob === "function") {
      jsonStr = decodeURIComponent(
        Array.prototype.map
          .call(atob(padded), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    } else if (typeof Buffer !== "undefined") {
      jsonStr = Buffer.from(padded, "base64").toString("utf-8");
    } else {
      return false;
    }

    const payload = JSON.parse(jsonStr);
    if (!payload.exp || typeof payload.exp !== "number") {
      return false;
    }

    // Expired if current time (in ms) >= (exp * 1000 - 5000)
    return Date.now() >= payload.exp * 1000 - 5000;
  } catch {
    return false;
  }
}

export function getJwtExpiresInMs(token: string | null): number | null {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;

    let jsonStr: string;
    if (typeof atob === "function") {
      jsonStr = decodeURIComponent(
        Array.prototype.map
          .call(atob(padded), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    } else if (typeof Buffer !== "undefined") {
      jsonStr = Buffer.from(padded, "base64").toString("utf-8");
    } else {
      return null;
    }

    const payload = JSON.parse(jsonStr);
    if (!payload.exp || typeof payload.exp !== "number") {
      return null;
    }

    const remainingMs = payload.exp * 1000 - Date.now();
    return remainingMs > 0 ? remainingMs : 0;
  } catch {
    return null;
  }
}

export class SupabaseAuthAdapter implements IAuthService {
  private static instance: SupabaseAuthAdapter | null = null;
  private refreshTimerId: ReturnType<typeof setTimeout> | null = null;
  private refreshPromise: Promise<AuthResult> | null = null;

  public static getInstance(): SupabaseAuthAdapter {
    if (!SupabaseAuthAdapter.instance) {
      SupabaseAuthAdapter.instance = new SupabaseAuthAdapter();
    }
    return SupabaseAuthAdapter.instance;
  }

  constructor() {
    const existingToken = this.getStoredToken();
    if (existingToken) {
      HttpClient.setAuthToken(existingToken);
      this.scheduleSilentRefresh(existingToken);
    }

    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const handleResumeRefresh = () => {
        if (document.visibilityState && document.visibilityState !== "visible") {
          return;
        }
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        const remainingMs = getJwtExpiresInMs(token);
        const needsProactiveRefresh =
          remainingMs !== null && remainingMs <= 5 * 60 * 1000;
        if (needsProactiveRefresh && this.hasRecoverableRefreshSource()) {
          void this.refresh();
        }
      };
      document.addEventListener("visibilitychange", handleResumeRefresh);
      window.addEventListener("focus", handleResumeRefresh);
    }
  }

  private hasSupabaseBrowserSession(): boolean {
    if (typeof window === "undefined") return false;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw) as {
              access_token?: string;
              refresh_token?: string;
            };
            if (parsed?.refresh_token || parsed?.access_token) {
              return true;
            }
          }
        }
      }
    } catch {
      // ignore
    }
    return false;
  }

  public hasRecoverableRefreshSource(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refreshToken && refreshToken !== accessToken) {
        return true;
      }
      return this.hasSupabaseBrowserSession();
    } catch {
      return false;
    }
  }

  public scheduleSilentRefresh(token: string): void {
    if (this.refreshTimerId) {
      clearTimeout(this.refreshTimerId);
      this.refreshTimerId = null;
    }
    if (typeof window === "undefined") return;
    if (import.meta.env.DEV && localStorage.getItem(USER_KEY)?.includes("dev-user-local")) {
      return;
    }

    const remainingMs = getJwtExpiresInMs(token);
    // Refresh 5 minutes before expiration; if less than 5m left, wait 10s. Default to 45m if no exp field.
    let delayMs = 45 * 60 * 1000;
    if (remainingMs !== null) {
      delayMs = Math.max(10 * 1000, remainingMs - 5 * 60 * 1000);
    }

    this.refreshTimerId = setTimeout(async () => {
      try {
        if (!this.hasRecoverableRefreshSource()) return;
        logger.info("[AuthAdapter] Proactively refreshing JWT session...");
        const result = await this.refresh();
        if (!result.success) {
          logger.warn("[AuthAdapter] Silent JWT refresh failed:", result.error);
        }
      } catch (err) {
        logger.warn("[AuthAdapter] Silent refresh encountered error:", err);
      }
    }, delayMs);
  }

  public getStoredToken(): string | null {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!token) return null;
      if (import.meta.env.DEV && localStorage.getItem(USER_KEY)?.includes("dev-user-local")) {
        return token;
      }
      if (isJwtExpired(token)) {
        if (this.hasRecoverableRefreshSource()) {
          // Preserve refresh token & user profile so single-flight refresh() can recover seamlessly.
          logger.warn("[AuthAdapter] Stored JWT token expired; preserving refresh token for recovery.");
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          HttpClient.setAuthToken("");
        } else {
          logger.warn("[AuthAdapter] Stored JWT token has expired. Clearing dead session.");
          this.clearDeadToken();
        }
        return null;
      }
      return token;
    } catch {
      return null;
    }
  }

  public clearDeadToken(): void {
    if (this.refreshTimerId) {
      clearTimeout(this.refreshTimerId);
      this.refreshTimerId = null;
    }
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      StorageLifecycleService.purgeOnLogout();
    } catch {
      // ignore
    }
    HttpClient.setAuthToken("");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("celaest:auth-changed"));
    }
  }

  public getStoredUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  public isAuthenticated(): boolean {
    const token = this.getStoredToken();
    return Boolean(token && !isJwtExpired(token));
  }

  public async login(email: string, password: string): Promise<AuthResult> {
    try {
      const response = await fetch(`${ENV.celaestBackUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        const errorMsg = json?.error?.message || "Invalid credentials. Please verify your email and password.";
        return { success: false, error: formatAuthErrorMessage(errorMsg) };
      }

      const data = json.data;
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const user: AuthUser = {
        id: data.user?.id || `user-${Date.now()}`,
        email: data.user?.email || email,
        name: data.user?.user_metadata?.display_name || data.user?.email?.split("@")[0] || "Learner",
        role: data.user?.role || "member",
        onboardingCompleted: true,
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("lingua_onboarding_completed", "true");
          if (user.id) localStorage.setItem(`lingua_onboarding_completed_${user.id}`, "true");
          if (user.email) localStorage.setItem(`lingua_onboarding_completed_${user.email}`, "true");
        } catch {
          // ignore
        }
      }

      this.persistSession(accessToken, refreshToken, user);
      return { success: true, accessToken, refreshToken, user };
    } catch (err) {
      logger.warn("[AuthAdapter] Backend unavailable during login", err);
      return {
        success: false,
        error: "Unable to connect to authentication server. Please check your network and try again.",
      };
    }
  }

  public async register(email: string, password: string, name: string): Promise<AuthResult> {
    try {
      const response = await fetch(`${ENV.celaestBackUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        const errorMsg = json?.error?.message || "Registration failed. Please check your details.";
        return { success: false, error: formatAuthErrorMessage(errorMsg) };
      }

      const data = json.data;
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const user: AuthUser = {
        id: data.user?.id || `user-${Date.now()}`,
        email: data.user?.email || email,
        name: name || data.user?.user_metadata?.display_name || email.split("@")[0],
        role: data.user?.role || "member",
        onboardingCompleted: false,
      };

      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("lingua_onboarding_completed");
          if (user.id) localStorage.removeItem(`lingua_onboarding_completed_${user.id}`);
          if (user.email) localStorage.removeItem(`lingua_onboarding_completed_${user.email}`);
          localStorage.removeItem("celaest:active_profession");
          localStorage.removeItem("celaest:cefrLevel");
        } catch {
          // ignore
        }
      }

      this.persistSession(accessToken, refreshToken, user);
      return { success: true, accessToken, refreshToken, user };
    } catch (err) {
      logger.warn("[AuthAdapter] Backend unavailable during registration", err);
      return {
        success: false,
        error: "Unable to connect to authentication server. Please check your network and try again.",
      };
    }
  }

  public async loginWithGoogle(): Promise<{ error?: string }> {
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        logger.error("[AuthAdapter] Google OAuth error", error);
        return { error: error.message };
      }

      return {};
    } catch (err) {
      logger.error("[AuthAdapter] Unexpected Google OAuth exception", err);
      return { error: "Failed to initiate Google authentication." };
    }
  }

  public async refresh(failedToken?: string): Promise<AuthResult> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    const promise = this.performRefresh(failedToken).finally(() => {
      if (this.refreshPromise === promise) {
        this.refreshPromise = null;
      }
    });
    this.refreshPromise = promise;
    return promise;
  }

  private async performRefresh(failedToken?: string): Promise<AuthResult> {
    if (typeof window === "undefined") {
      return { success: false, error: "No refresh token" };
    }

    const storedAccess = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRemainingMs = getJwtExpiresInMs(storedAccess);
    const storedHasFreshLifetime =
      Boolean(storedAccess) &&
      !isJwtExpired(storedAccess) &&
      (storedRemainingMs === null || storedRemainingMs > 5 * 60 * 1000);
    if (
      storedAccess &&
      !isJwtExpired(storedAccess) &&
      ((failedToken && storedAccess !== failedToken) ||
        (!failedToken && storedHasFreshLifetime))
    ) {
      HttpClient.setAuthToken(storedAccess);
      return { success: true, accessToken: storedAccess };
    }

    if (this.hasSupabaseBrowserSession()) {
      try {
        const {
          data: { session: currentSb },
        } = await supabase.auth.getSession();

        const sbRemainingMs = getJwtExpiresInMs(currentSb?.access_token ?? null);
        const sbHasFreshLifetime =
          Boolean(currentSb?.access_token) &&
          !isJwtExpired(currentSb?.access_token ?? null) &&
          (sbRemainingMs === null || sbRemainingMs > 5 * 60 * 1000);

        if (
          currentSb?.access_token &&
          !isJwtExpired(currentSb.access_token) &&
          ((failedToken && currentSb.access_token !== failedToken) ||
            (!failedToken && sbHasFreshLifetime))
        ) {
          this.persistSession(
            currentSb.access_token,
            currentSb.refresh_token,
            this.getStoredUser() ?? undefined,
          );
          return { success: true, accessToken: currentSb.access_token };
        }

        if (currentSb?.refresh_token) {
          const { data, error } = await supabase.auth.refreshSession();
          if (data?.session?.access_token) {
            const existingUser = this.getStoredUser();
            const resolvedUser: AuthUser | undefined =
              existingUser ??
              (data.session.user
                ? {
                    id: data.session.user.id,
                    email: data.session.user.email || "",
                    name:
                      (data.session.user.user_metadata?.name as string | undefined) ||
                      data.session.user.email?.split("@")[0] ||
                      "Learner",
                    role:
                      (data.session.user.user_metadata?.role as string | undefined) ||
                      "member",
                  }
                : undefined);
            this.persistSession(
              data.session.access_token,
              data.session.refresh_token,
              resolvedUser,
            );
            return { success: true, accessToken: data.session.access_token };
          }
          if (error) {
            const status = (error as { status?: number }).status;
            const msg = error.message?.toLowerCase() || "";
            if (
              !status ||
              status >= 500 ||
              msg.includes("fetch") ||
              msg.includes("network")
            ) {
              return { success: false, error: "Network error" };
            }
          }
        }
      } catch {
        return { success: false, error: "Network error" };
      }
    }

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (
      !refreshToken ||
      refreshToken === storedAccess ||
      refreshToken === failedToken
    ) {
      return { success: false, error: "No refresh token" };
    }

    try {
      const response = await fetch(`${ENV.celaestBackUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (response.status >= 500) {
        return { success: false, error: "Server error" };
      }
      const json = await response.json();
      if (response.ok && json.success && json.data?.access_token) {
        const data = json.data;
        this.persistSession(
          data.access_token,
          data.refresh_token || refreshToken,
          this.getStoredUser() ?? undefined,
        );
        return { success: true, accessToken: data.access_token };
      }
      return { success: false, error: "Refresh expired" };
    } catch {
      return { success: false, error: "Network error" };
    }
  }

  public async logout(): Promise<void> {
    try {
      const token = this.getStoredToken();
      if (token) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        try {
          await fetch(`${ENV.celaestBackUrl}/auth/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeoutId);
        }
      }
      await supabase.auth.signOut().catch(() => {});
    } catch (e) {
      logger.warn("[AuthAdapter] Logout request error", e);
    } finally {
      if (this.refreshTimerId) {
        clearTimeout(this.refreshTimerId);
        this.refreshTimerId = null;
      }
      StorageLifecycleService.purgeOnLogout();
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      HttpClient.setAuthToken("");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("celaest:auth-changed"));
      }
    }
  }

  public persistSession(accessToken?: string, refreshToken?: string, user?: AuthUser): void {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      HttpClient.setAuthToken(accessToken);
      this.scheduleSilentRefresh(accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("celaest:auth-changed"));
    }
  }
}
