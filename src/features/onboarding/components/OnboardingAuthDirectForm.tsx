import React, { useState, useEffect } from "react";
import { MailEnvelopeIcon, LockKeyIcon, UserPersonIcon, EyeOpenIcon, EyeClosedIcon } from "./OnboardingAuthIcons";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { AuthUser } from "../../../application/ports/IAuthService";

export interface OnboardingAuthDirectFormProps {
  mode: "login" | "register";
  onSuccess: (user: AuthUser, mode: "login" | "register") => void;
  loading?: boolean;
}

export const OnboardingAuthDirectForm: React.FC<OnboardingAuthDirectFormProps> = ({
  mode,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Client rate-limiting cooldown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Clear errors and confirm password when toggling between login and register
  useEffect(() => {
    setErrorMessage(null);
    setConfirmPassword("");
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownSeconds > 0) return;

    // Security sanitization: trim and lower-case email to eliminate mobile autocorrect spaces
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !password || (mode === "register" && !cleanName)) return;

    if (mode === "register") {
      if (cleanName.length < 2) {
        setErrorMessage("Please enter your full name.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }

      // Client-side minimum password length validation
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
    }

    setIsLoading(true);
    setErrorMessage(null);

    const authAdapter = SupabaseAuthAdapter.getInstance();
    const result =
      mode === "register"
        ? await authAdapter.register(cleanEmail, password, cleanName)
        : await authAdapter.login(cleanEmail, password);

    setIsLoading(false);

    if (result.success && result.user) {
      setFailedAttempts(0);
      onSuccess(result.user, mode);
    } else {
      const nextFailures = failedAttempts + 1;
      setFailedAttempts(nextFailures);

      // Throttling: activate 5-second cooldown after 4 consecutive failures
      if (nextFailures >= 4) {
        setCooldownSeconds(5);
        setErrorMessage("Too many failed attempts. Please wait 5 seconds before trying again.");
      } else {
        setErrorMessage(result.error || "Authentication failed. Please check your credentials.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-2 max-w-[280px] sm:max-w-[320px] mx-auto">
      {errorMessage && (
        <p
          id="auth-error-msg"
          role="alert"
          aria-live="assertive"
          className="text-[10px] sm:text-[11px] text-red-400 font-light text-center py-0.5 animate-fadeIn"
        >
          {errorMessage}
        </p>
      )}

      {mode === "register" && (
        <div className="group relative flex items-center border-b border-white/15 focus-within:border-[#8B5CF6] transition-all duration-200 py-1">
          <UserPersonIcon className="text-[#71719A] group-focus-within:text-[#A27FF3] w-3.5 h-3.5 mr-2.5 shrink-0 transition-colors" />
          <input
            id="auth-name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Full Name"
            aria-label="Full Name"
            aria-required="true"
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? "auth-error-msg" : undefined}
            required
            autoComplete="name"
            className="w-full bg-transparent text-xs text-white placeholder-[#71719A] outline-none focus-visible:ring-1 focus-visible:ring-[#8B5CF6]/50 rounded-sm"
          />
        </div>
      )}

      <div className="group relative flex items-center border-b border-white/15 focus-within:border-[#8B5CF6] transition-all duration-200 py-1">
        <MailEnvelopeIcon className="text-[#71719A] group-focus-within:text-[#A27FF3] w-3.5 h-3.5 mr-2.5 shrink-0 transition-colors" />
        <input
          id="auth-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          placeholder="name@celaest.com"
          aria-label="Email address"
          aria-required="true"
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? "auth-error-msg" : undefined}
          required
          autoComplete="email"
          className="w-full bg-transparent text-xs text-white placeholder-[#71719A] outline-none focus-visible:ring-1 focus-visible:ring-[#8B5CF6]/50 rounded-sm"
        />
      </div>

      <div className="group relative flex items-center border-b border-white/15 focus-within:border-[#8B5CF6] transition-all duration-200 py-1">
        <LockKeyIcon className="text-[#71719A] group-focus-within:text-[#A27FF3] w-3.5 h-3.5 mr-2.5 shrink-0 transition-colors" />
        <input
          id="auth-password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          placeholder="Password"
          aria-label="Password"
          aria-required="true"
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? "auth-error-msg" : undefined}
          required
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="w-full bg-transparent text-xs text-white placeholder-[#71719A] outline-none pr-7 focus-visible:ring-1 focus-visible:ring-[#8B5CF6]/50 rounded-sm"
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-0 text-[#71719A] hover:text-[#C4B5FD] transition-colors cursor-pointer p-0.5 focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded"
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          aria-controls="auth-password"
        >
          {showPassword ? <EyeClosedIcon className="w-3.5 h-3.5" /> : <EyeOpenIcon className="w-3.5 h-3.5" />}
        </button>
      </div>

      {mode === "register" && (
        <div className="group relative flex items-center border-b border-white/15 focus-within:border-[#8B5CF6] transition-all duration-200 py-1">
          <LockKeyIcon className="text-[#71719A] group-focus-within:text-[#A27FF3] w-3.5 h-3.5 mr-2.5 shrink-0 transition-colors" />
          <input
            id="auth-confirm-password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Confirm Password"
            aria-label="Confirm Password"
            aria-required="true"
            aria-invalid={Boolean(errorMessage && errorMessage.toLowerCase().includes("match"))}
            aria-describedby={errorMessage ? "auth-error-msg" : undefined}
            required
            autoComplete="new-password"
            className="w-full bg-transparent text-xs text-white placeholder-[#71719A] outline-none pr-7 focus-visible:ring-1 focus-visible:ring-[#8B5CF6]/50 rounded-sm"
          />
        </div>
      )}

      <div className="pt-2 flex flex-col items-center space-y-1.5">
        <button
          type="submit"
          disabled={isLoading || cooldownSeconds > 0}
          aria-busy={isLoading}
          aria-disabled={isLoading || cooldownSeconds > 0}
          className="group relative inline-flex items-center justify-center px-10 sm:px-14 py-2 sm:py-2.5 text-xs font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_28px_rgba(124,58,237,0.75)] hover:scale-[1.03] active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000003] outline-none"
        >
          <span>
            {isLoading
              ? "Authenticating..."
              : cooldownSeconds > 0
                ? `Wait (${cooldownSeconds}s)`
                : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
          </span>
          {cooldownSeconds <= 0 && (
            <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
          )}
        </button>

        {mode === "register" && (
          <p className="text-[9px] text-[#71719A] text-center font-light leading-tight pt-0.5 select-none">
            By signing up, you agree to our Terms and Privacy Policy.
          </p>
        )}
      </div>
    </form>
  );
};
