// ===== COOMUNITY SUPERAPP - CARD COMPONENT =====

import React, { forwardRef } from 'react';
import { getCardClasses } from '../../../utils/styles';
import { cn } from '../../../utils/styles';

// ===== TYPES =====

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant of the card
   */
  variant?: 'elevated' | 'outlined' | 'ghost' | 'coomunity' | 'gold';

  /**
   * Padding size of the card
   */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Whether the card is interactive (clickable)
   */
  interactive?: boolean;

  /**
   * Whether the card is in a loading state
   */
  loading?: boolean;

  /**
   * Whether the card is disabled
   */
  disabled?: boolean;

  /**
   * CoomÜnity-specific animation
   */
  animation?: 'none' | 'hover-lift' | 'hover-glow' | 'fade-in' | 'scale-in';

  /**
   * Element type (for philosophy alignment)
   */
  element?: 'tierra' | 'agua' | 'fuego' | 'aire';

  /**
   * Header content
   */
  header?: React.ReactNode;

  /**
   * Footer content
   */
  footer?: React.ReactNode;

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
 * CoomÜnity Card Component
 *
 * A comprehensive card component following the CoomÜnity design system.
 * Supports multiple variants, interactive states, and accessibility features.
 *
 * @example
 * ```tsx
 * <Card variant="elevated" padding="md" interactive>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here...</p>
 * </Card>
 *
 * <Card variant="coomunity" element="agua" animation="hover-glow">
 *   <p>Philosophy-aligned card</p>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      padding = 'md',
      interactive = false,
      loading = false,
      disabled = false,
      animation = 'hover-lift',
      element,
      header,
      footer,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    // ===== COMPUTED CLASSES =====

    const cardClasses = cn(
      // Base classes from design system
      getCardClasses(variant, padding, interactive),

      // Element-based styling
      element === 'tierra' && 'border-l-4 border-l-earth-500 bg-gradient-to-r from-earth-50 to-white',
      element === 'agua' && 'border-l-4 border-l-water-500 bg-gradient-to-r from-water-50 to-white',
      element === 'fuego' && 'border-l-4 border-l-fire-500 bg-gradient-to-r from-fire-50 to-white',
      element === 'aire' && 'border-l-4 border-l-air-500 bg-gradient-to-r from-air-50 to-white',

      // Animation classes
      animation === 'hover-lift' && interactive && 'coomunity-hover-lift',
      animation === 'hover-glow' && interactive && 'hover:shadow-coomunity-glow transition-shadow duration-200',
      animation === 'fade-in' && 'animate-fade-in',
      animation === 'scale-in' && 'animate-scale-in',

      // Loading state
      loading && 'animate-pulse cursor-wait',

      // Disabled state
      disabled && 'opacity-50 cursor-not-allowed',

      // Interactive state
      interactive && !disabled && 'cursor-pointer',

      // Custom classes
      className
    );

    // ===== LOADING SKELETON =====

    const LoadingSkeleton = () => (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );

    // ===== HANDLERS =====

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || loading) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (interactive && !disabled && !loading && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        handleClick(event as any);
      }
    };

    // ===== RENDER =====

    return (
      <div
        ref={ref}
        className={cardClasses}
        onClick={interactive ? handleClick : onClick}
        onKeyDown={interactive ? handleKeyDown : undefined}
        tabIndex={interactive && !disabled && !loading ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {/* Header */}
        {header && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            {header}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {loading ? <LoadingSkeleton /> : children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ===== SPECIALIZED CARD VARIANTS =====

/**
 * Module Card - For main navigation modules
 */
export const ModuleCard = forwardRef<HTMLDivElement, Omit<CardProps, 'variant' | 'interactive'>>(
  (props, ref) => (
    <Card
      ref={ref}
      variant="elevated"
      interactive
      animation="hover-lift"
      className="min-h-[120px] flex flex-col justify-center items-center text-center"
      {...props}
    />
  )
);

ModuleCard.displayName = 'ModuleCard';

/**
 * Reciprocidad Card - For reciprocity-related content
 */
export const ReciprocidadCard = forwardRef<HTMLDivElement, Omit<CardProps, 'variant' | 'element'>>(
  (props, ref) => (
    <Card
      ref={ref}
      variant="coomunity"
      element="aire"
      animation="hover-glow"
      className="border-coomunity-300 bg-gradient-to-br from-coomunity-50 to-coomunity-100"
      {...props}
    />
  )
);

ReciprocidadCard.displayName = 'ReciprocidadCard';

/**
 * Mëritos Card - For achievement and merit content
 */
export const MeritosCard = forwardRef<HTMLDivElement, Omit<CardProps, 'variant'>>(
  (props, ref) => (
    <Card
      ref={ref}
      variant="gold"
      animation="hover-glow"
      className="border-gold-300 bg-gradient-to-br from-gold-50 to-gold-100"
      {...props}
    />
  )
);

MeritosCard.displayName = 'MeritosCard';

/**
 * Öndas Card - For energy and vibrational content
 */
export const OndasCard = forwardRef<HTMLDivElement, Omit<CardProps, 'variant' | 'element'>>(
  (props, ref) => (
    <Card
      ref={ref}
      variant="outlined"
      element="agua"
      animation="hover-glow"
      className="border-info-300 bg-gradient-to-br from-info-50 to-info-100 animate-ondas-ripple"
      {...props}
    />
  )
);

OndasCard.displayName = 'OndasCard';

/**
 * Marketplace Card - For product/service listings
 */
export const MarketplaceCard = forwardRef<HTMLDivElement, Omit<CardProps, 'variant' | 'interactive'>>(
  (props, ref) => (
    <Card
      ref={ref}
      variant="elevated"
      interactive
      animation="hover-lift"
      className="overflow-hidden"
      {...props}
    />
  )
);

MarketplaceCard.displayName = 'MarketplaceCard';

/**
 * Social Card - For social interactions and community content
 */
export const SocialCard = forwardRef<HTMLDivElement, Omit<CardProps, 'variant'>>(
  (props, ref) => (
    <Card
      ref={ref}
      variant="outlined"
      animation="fade-in"
      className="border-gray-200 hover:border-coomunity-300 transition-colors duration-200"
      {...props}
    />
  )
);

SocialCard.displayName = 'SocialCard';

/**
 * Stats Card - For metrics and statistics
 */
export const StatsCard = forwardRef<HTMLDivElement, Omit<CardProps, 'variant' | 'padding'>>(
  (props, ref) => (
    <Card
      ref={ref}
      variant="ghost"
      padding="lg"
      animation="scale-in"
      className="text-center bg-gradient-to-br from-gray-50 to-white border border-gray-100"
      {...props}
    />
  )
);

StatsCard.displayName = 'StatsCard';

// ===== CARD HEADER COMPONENT =====

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, icon, action, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between', className)}
      {...props}
    >
      <div className="flex items-center space-x-3">
        {icon && (
          <div className="flex-shrink-0 text-coomunity-600">
            {icon}
          </div>
        )}
        <div>
          {title && (
            <h3 className="coomunity-h5 text-gray-900 font-semibold">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="coomunity-body-sm text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

// ===== CARD FOOTER COMPONENT =====

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

// ===== EXPORTS =====

export default Card;

export type { CardProps, CardHeaderProps, CardFooterProps };
