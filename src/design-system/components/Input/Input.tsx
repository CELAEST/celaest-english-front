import React from "react";
import { cn } from "@shared/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.memo(
  React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, leftIcon, rightIcon, className, type = "text", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-xs font-medium text-text-secondary">{label}</label>}
        <div className="relative flex items-center w-full">
          {leftIcon && <div className="absolute left-3.5 text-text-tertiary">{leftIcon}</div>}
          <input
            ref={ref}
            type={type}
            className={cn(
              "w-full bg-surface-0 border border-glass-border rounded-xl text-sm text-text-primary placeholder:text-text-tertiary py-3 px-4 transition-all duration-200 focus:outline-none focus:border-accent-violet-400 focus:ring-2 focus:ring-accent-violet-400/20 disabled:opacity-50",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error &&
                "border-status-danger focus:border-status-danger focus:ring-status-danger/20",
              className,
            )}
            {...props}
          />
          {rightIcon && <div className="absolute right-3.5 text-text-tertiary">{rightIcon}</div>}
        </div>
        {error && <span className="text-xs text-status-danger mt-0.5">{error}</span>}
      </div>
    );
  },
));

Input.displayName = "Input";
