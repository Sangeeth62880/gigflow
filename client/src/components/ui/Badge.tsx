import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-surface-card text-ink',
    success: 'bg-emerald-200 text-ink',
    warning: 'bg-orange-200 text-ink',
    danger: 'bg-pink-200 text-ink',
    info: 'bg-violet-200 text-ink',
  };

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-pill text-[13px] font-medium ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
