// ===== COOMUNITY SUPERAPP - BUTTON COMPONENT =====

import React, { forwardRef } from 'react';
import { getButtonClasses } from '../../../utils/styles';
import { cn } from '../../../utils/styles';

// ===== TYPES =====

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'error' | 'gold';

  /**
   * Size of the button
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Whether the button is in a loading state
   */
  loading?: boolean;

  /**
   * Icon to display before the text
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to display after the text
   */
  rightIcon?: React.ReactNode;

  /**
   * Whether the button should take full width
   */
  fullWidth?: boolean;

  /**
   * Whether the button should have rounded corners
   */
  rounded?: boolean;

  /**
   * CoomÜnity-specific animation
   */
  animation?: 'none' | 'hover-lift' | 'hover-glow' | 'bounce' | 'wiggle';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Children content
   */
  children?: React.ReactNode;
}

// ===== COMPONENT =====

/**
 * CoomÜnity Button Component
 *
 * A comprehensive button component following the CoomÜnity design system.
 * Supports multiple variants, sizes, states, and accessibility features.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * <Button variant="outline" leftIcon={<PlusIcon />} loading>
 *   Add Item
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      rounded = false,
      animation = 'hover-lift',
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // ===== COMPUTED CLASSES =====

    const buttonClasses = cn(
      // Base classes from design system
      getButtonClasses(variant, size),

      // Full width
      fullWidth && 'w-full',

      // Rounded corners
      rounded && 'rounded-full',

      // Animation classes
      animation === 'hover-lift' && 'coomunity-hover-lift',
      animation === 'hover-glow' && 'hover:shadow-coomunity-glow transition-shadow duration-200',
      animation === 'bounce' && 'hover:animate-bounce-soft',
      animation === 'wiggle' && 'hover:animate-wiggle',

      // Loading state
      loading && 'cursor-wait',

      // Disabled state
      (disabled || loading) && 'opacity-50 cursor-not-allowed',

      // Custom classes
      className
    );

    // ===== LOADING SPINNER =====

    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    // ===== RENDER =====

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {/* Left Icon or Loading Spinner */}
        {loading ? (
          <LoadingSpinner />
        ) : leftIcon ? (
          <span className="mr-2 flex-shrink-0">{leftIcon}</span>
        ) : null}

        {/* Button Content */}
        {children && (
          <span className={cn(
            'flex-1',
            (leftIcon || loading || rightIcon) && 'mx-1'
          )}>
            {children}
          </span>
        )}

        {/* Right Icon */}
        {rightIcon && !loading && (
          <span className="ml-2 flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ===== SPECIALIZED BUTTON VARIANTS =====

/**
 * Primary CoomÜnity Button - Main brand color
 */
export const PrimaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="primary" {...props} />
);

PrimaryButton.displayName = 'PrimaryButton';

/**
 * Gold Button - For special actions and achievements
 */
export const GoldButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button ref={ref} variant="gold" animation="hover-glow" {...props} />
);

GoldButton.displayName = 'GoldButton';

/**
 * Reciprocidad Button - For reciprocity actions
 */
export const ReciprocidadButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant' | 'animation'>>(
  (props, ref) => (
    <Button
      ref={ref}
      variant="primary"
      animation="bounce"
      className="bg-gradient-to-r from-coomunity-500 to-coomunity-600 hover:from-coomunity-600 hover:to-coomunity-700"
      {...props}
    />
  )
);

ReciprocidadButton.displayName = 'ReciprocidadButton';

/**
 * Mëritos Button - For merit-based actions
 */
export const MeritosButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => (
    <Button
      ref={ref}
      variant="gold"
      animation="hover-glow"
      className="animate-meritos-count"
      {...props}
    />
  )
);

MeritosButton.displayName = 'MeritosButton';

/**
 * Öndas Button - For energy/vibrational actions
 */
export const OndasButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => (
    <Button
      ref={ref}
      variant="outline"
      animation="hover-glow"
      className="border-info-500 text-info-600 hover:bg-info-50 animate-ondas-ripple"
      {...props}
    />
  )
);

OndasButton.displayName = 'OndasButton';

// ===== EXPORTS =====

export default Button;
