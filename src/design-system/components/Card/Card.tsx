import React from 'react';
import { cn } from '@shared/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'inset' | 'active';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'glass',
  hoverable = true,
  children,
  className,
  ...props
}) => {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-300 relative overflow-hidden';

  const variants = {
    glass: 'glass-panel',
    inset: 'bg-surface-0 border border-white/5 shadow-inner',
    active: 'glass-panel glass-panel-active',
  };

  const hoverStyles = hoverable ? 'hover:-translate-y-0.5 cursor-pointer' : '';

  return (
    <div className={cn(baseStyles, variants[variant], hoverStyles, className)} {...props}>
      {children}
    </div>
  );
};
