'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-dark-surface rounded-xl p-6 shadow-card border border-dark-border',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
