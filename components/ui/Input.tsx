'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, size = 'md', ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          className={cn(
            'w-full bg-dark-surface border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200',
            {
              'border-dark-border': !error,
              'border-red-500 focus:ring-red-500': error,
            },
            {
              'px-3 py-2 text-sm': size === 'sm',
              'px-4 py-3 text-base': size === 'md',
              'px-5 py-4 text-lg': size === 'lg',
            },
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
