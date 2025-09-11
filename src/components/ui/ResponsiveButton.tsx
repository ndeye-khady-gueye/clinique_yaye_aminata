import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ResponsiveButtonProps extends ButtonProps {
  fullWidthOnMobile?: boolean;
  icon?: React.ReactNode;
  hideTextOnMobile?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsiveSize?: {
    mobile?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    tablet?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    desktop?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  };
  mobileIcon?: React.ReactNode;
}

const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  children,
  fullWidthOnMobile = false,
  icon,
  mobileIcon,
  hideTextOnMobile = false,
  size = 'md',
  responsiveSize,
  className,
  ...props
}) => {
  const getSizeClasses = () => {
    if (responsiveSize) {
      const { mobile = 'sm', tablet = 'md', desktop = 'lg' } = responsiveSize;
      return `text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2 md:text-base md:px-4 md:py-2 lg:text-base lg:px-6 lg:py-3`;
    }

    const sizeClasses = {
      xs: 'text-xs px-2 py-1 sm:px-3 sm:py-1.5',
      sm: 'text-sm px-3 py-1.5 sm:px-4 sm:py-2',
      md: 'text-sm px-4 py-2 sm:px-6 sm:py-2.5',
      lg: 'text-base px-6 py-2.5 sm:px-8 sm:py-3',
      xl: 'text-lg px-8 py-3 sm:px-10 sm:py-4'
    };

    return sizeClasses[size];
  };

  return (
    <Button
      className={cn(
        'btn-responsive',
        getSizeClasses(),
        fullWidthOnMobile && 'w-full sm:w-auto',
        hideTextOnMobile && 'sm:px-6',
        className
      )}
      {...props}
    >
      {(mobileIcon || icon) && (
        <span className={cn(
          'flex-shrink-0',
          hideTextOnMobile ? 'sm:mr-2' : 'mr-2'
        )}>
          {mobileIcon || icon}
        </span>
      )}
      {!hideTextOnMobile && (
        <span className="truncate">{children}</span>
      )}
      {hideTextOnMobile && (
        <span className="hidden sm:inline truncate">{children}</span>
      )}
    </Button>
  );
};

export default ResponsiveButton;
