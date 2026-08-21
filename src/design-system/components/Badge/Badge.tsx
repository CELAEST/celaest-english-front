import React from 'react';
import { cn } from '@shared/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'mint' | 'lavender' | 'amber' | 'coral' | 'ghost';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'lavender',
  size = 'md',
  icon,
  children,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide';

  const variants = {
    mint: 'bg-status-success/15 text-status-success border border-status-success/30',
    lavender: 'bg-accent-violet-500/15 text-accent-violet-light border border-accent-violet-500/30',
    amber: 'bg-status-warning/15 text-status-warning border border-status-warning/30',
    coral: 'bg-status-danger/15 text-status-danger border border-status-danger/30',
    ghost: 'bg-white/5 text-text-secondary border border-white/10',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {icon}
      <span>{children}</span>
    </span>
  );
};
