import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { ButtonProps } from '@/types';

// ===========================================
// Button Component
// ===========================================

const buttonVariants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
  secondary:
    'bg-white text-primary-500 border-2 border-primary-500 hover:bg-primary-50 active:bg-primary-100',
  outline:
    'bg-transparent text-neutral-700 border-2 border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
  danger: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base',
  lg: 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      fullWidth = false,
      children,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'font-medium rounded-xl',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-[0.98]',
          // Variants
          buttonVariants[variant],
          // Sizes
          buttonSizes[size],
          // Full width
          fullWidth && 'w-full',
          // Custom classes
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
