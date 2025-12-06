import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import type { InputProps } from '@/types';

// ===========================================
// Input Component
// ===========================================

export const Input = forwardRef<
  HTMLInputElement,
  InputProps & React.InputHTMLAttributes<HTMLInputElement>
>(({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
          {props.required && <span className="text-accent-500 ml-1">*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">{leftIcon}</div>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'input',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-accent-500 focus:border-accent-500 focus:ring-accent-500/20',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />

        {/* Right icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-sm text-accent-500" role="alert">
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-neutral-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
