import React, { useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === "register" && !name)) return;

    setIsLoading(true);
    setErrorMessage(null);

    const authAdapter = SupabaseAuthAdapter.getInstance();
    const result =
      mode === "register"
        ? await authAdapter.register(email, password, name)
        : await authAdapter.login(email, password);

    setIsLoading(false);

    if (result.success && result.user) {
      onSuccess(result.user, mode);
    } else {
      setErrorMessage(result.error || "Authentication failed. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-2 max-w-[280px] sm:max-w-[320px] mx-auto">
      {errorMessage && (
        <div className="text-[10px] sm:text-[11px] text-red-400 font-light text-center px-2 py-0.5 animate-fadeIn">
          {errorMessage}
        </div>
      )}

      {mode === "register" && (
        <div className="group relative flex items-center border-b border-white/15 focus-within:border-[#8B5CF6] transition-all duration-200 py-1">
          <UserPersonIcon className="text-[#71719A] group-focus-within:text-[#A27FF3] w-3.5 h-3.5 mr-2.5 shrink-0 transition-colors" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            autoComplete="name"
            className="w-full bg-transparent text-xs text-white placeholder-[#71719A] outline-none"
          />
        </div>
      )}

      <div className="group relative flex items-center border-b border-white/15 focus-within:border-[#8B5CF6] transition-all duration-200 py-1">
        <MailEnvelopeIcon className="text-[#71719A] group-focus-within:text-[#A27FF3] w-3.5 h-3.5 mr-2.5 shrink-0 transition-colors" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@celaest.com"
          required
          autoComplete="email"
          className="w-full bg-transparent text-xs text-white placeholder-[#71719A] outline-none"
        />
      </div>

      <div className="group relative flex items-center border-b border-white/15 focus-within:border-[#8B5CF6] transition-all duration-200 py-1">
        <LockKeyIcon className="text-[#71719A] group-focus-within:text-[#A27FF3] w-3.5 h-3.5 mr-2.5 shrink-0 transition-colors" />
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="w-full bg-transparent text-xs text-white placeholder-[#71719A] outline-none pr-7"
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-0 text-[#71719A] hover:text-[#C4B5FD] transition-colors cursor-pointer p-0.5"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeClosedIcon className="w-3.5 h-3.5" /> : <EyeOpenIcon className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="pt-2 flex justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="group relative inline-flex items-center justify-center px-10 sm:px-14 py-2 sm:py-2.5 text-xs font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_28px_rgba(124,58,237,0.75)] hover:scale-[1.03] active:scale-[0.97] cursor-pointer disabled:opacity-50"
        >
          <span>{isLoading ? "Authenticating..." : mode === "login" ? "Sign In" : "Create Account"}</span>
          <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </form>
  );
};
