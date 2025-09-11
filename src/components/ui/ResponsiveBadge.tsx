import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ResponsiveBadge: React.FC<ResponsiveBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ""
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'default':
        return 'bg-primary text-primary-foreground hover:bg-primary/80';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
      case 'destructive':
        return 'bg-destructive text-destructive-foreground hover:bg-destructive/80';
      case 'outline':
        return 'border border-input bg-background hover:bg-accent hover:text-accent-foreground';
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/80';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-2.5 py-1.5 text-xs sm:text-sm';
      case 'lg':
        return 'px-3 py-2 text-sm sm:text-base';
      default:
        return 'px-2.5 py-1.5 text-xs sm:text-sm';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
    >
      {children}
    </span>
  );
};

export default ResponsiveBadge;
