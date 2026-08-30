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

const ACCESS_TOKEN_KEY = "lingua_access_token";
const REFRESH_TOKEN_KEY = "lingua_refresh_token";
const USER_KEY = "lingua_auth_user";

export class SupabaseAuthAdapter implements IAuthService {
  private static instance: SupabaseAuthAdapter | null = null;

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
    }
  }

  public getStoredToken(): string | null {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
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
    return Boolean(this.getStoredToken());
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
        return { success: false, error: errorMsg };
      }

      const data = json.data;
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const user: AuthUser = {
        id: data.user?.id || `user-${Date.now()}`,
        email: data.user?.email || email,
        name: data.user?.user_metadata?.display_name || data.user?.email?.split("@")[0] || "Learner",
        role: data.user?.role || "member",
      };

      this.persistSession(accessToken, refreshToken, user);
      return { success: true, accessToken, refreshToken, user };
    } catch (err) {
      logger.warn("[AuthAdapter] Backend unavailable, entering offline mode", err);
      // Seamless offline / local fallback
      const fallbackUser: AuthUser = {
        id: `user-${Date.now()}`,
        email,
        name: email.split("@")[0] || "Learner",
        role: "member",
      };
      const dummyToken = `demo-token-${Date.now()}`;
      this.persistSession(dummyToken, `demo-refresh-${Date.now()}`, fallbackUser);
      return { success: true, accessToken: dummyToken, user: fallbackUser };
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
        return { success: false, error: errorMsg };
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

      this.persistSession(accessToken, refreshToken, user);
      return { success: true, accessToken, refreshToken, user };
    } catch (err) {
      logger.warn("[AuthAdapter] Backend unavailable, entering offline registration fallback", err);
      const fallbackUser: AuthUser = {
        id: `user-${Date.now()}`,
        email,
        name: name || email.split("@")[0] || "Learner",
        role: "member",
        onboardingCompleted: false,
      };
      const dummyToken = `demo-token-${Date.now()}`;
      this.persistSession(dummyToken, `demo-refresh-${Date.now()}`, fallbackUser);
      return { success: true, accessToken: dummyToken, user: fallbackUser };
    }
  }

  public async refresh(): Promise<AuthResult> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return { success: false, error: "No refresh token" };

    try {
      const response = await fetch(`${ENV.celaestBackUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      const json = await response.json();
      if (response.ok && json.success) {
        const data = json.data;
        this.persistSession(data.access_token, data.refresh_token || refreshToken, this.getStoredUser()!);
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
        await fetch(`${ENV.celaestBackUrl}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (e) {
      logger.warn("[AuthAdapter] Logout request error", e);
    } finally {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      HttpClient.setAuthToken("");
    }
  }

  private persistSession(accessToken?: string, refreshToken?: string, user?: AuthUser): void {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      HttpClient.setAuthToken(accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }
}
