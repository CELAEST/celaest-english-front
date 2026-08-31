/**
 * Port: IAuthService
 *
 * Abstract contract for user authentication, token management, and session state.
 * Screaming Architecture: Decoupled port in @application/ports.
 */

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  onboardingCompleted?: boolean;
}

export interface AuthResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: AuthUser;
  error?: string;
}

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResult>;
  register(email: string, password: string, name: string): Promise<AuthResult>;
  loginWithGoogle(): Promise<{ error?: string }>;
  refresh(): Promise<AuthResult>;
  logout(): Promise<void>;
  getStoredToken(): string | null;
  getStoredUser(): AuthUser | null;
  isAuthenticated(): boolean;
}
