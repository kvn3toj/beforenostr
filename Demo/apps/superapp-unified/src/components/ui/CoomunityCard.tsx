import React from 'react';
import { Card, CardProps } from '@mui/material';
import { motion } from 'framer-motion';
import { cn } from '../../utils/styles';

export interface CoomunityCardProps extends Omit<CardProps, 'variant'> {
  variant?: 'elevated' | 'outlined' | 'ghost' | 'coomunity';
  padding?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  children: React.ReactNode;
  className?: string;
}

const cardVariants = {
  elevated: {
    base: 'bg-white dark:bg-gray-800 shadow-lg border-0',
    hover: 'hover:shadow-xl hover:-translate-y-1',
  },
  outlined: {
    base: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm',
    hover: 'hover:border-coomunity-primary-300 hover:shadow-md',
  },
  ghost: {
    base: 'bg-gray-50 dark:bg-gray-900/50 border-0 shadow-none',
    hover: 'hover:bg-gray-100 dark:hover:bg-gray-800/50',
  },
  coomunity: {
    base: 'bg-gradient-to-br from-coomunity-primary-50 to-coomunity-primary-100 dark:from-coomunity-primary-900/20 dark:to-coomunity-primary-800/20 border border-coomunity-primary-200 dark:border-coomunity-primary-700',
    hover: 'hover:from-coomunity-primary-100 hover:to-coomunity-primary-200 dark:hover:from-coomunity-primary-800/30 dark:hover:to-coomunity-primary-700/30',
  },
};

const paddingVariants = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const CoomunityCard: React.FC<CoomunityCardProps> = ({
  variant = 'elevated',
  padding = 'md',
  interactive = false,
  children,
  className,
  ...props
}) => {
  const baseClasses = cn(
    'rounded-xl transition-all duration-300 ease-in-out',
    cardVariants[variant].base,
    interactive && cardVariants[variant].hover,
    paddingVariants[padding],
    className
  );

  const CardComponent = interactive ? motion.div : 'div';
  const motionProps = interactive
    ? {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Card
      component={CardComponent}
      className={baseClasses}
      elevation={0}
      {...(interactive ? motionProps : {})}
      {...props}
    >
      {children}
    </Card>
  );
};

export default CoomunityCard; 