import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ResponsiveButtonProps extends ButtonProps {
  fullWidthOnMobile?: boolean;
  icon?: React.ReactNode;
  hideTextOnMobile?: boolean;
}

const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  children,
  fullWidthOnMobile = false,
  icon,
  hideTextOnMobile = false,
  className,
  ...props
}) => {
  return (
    <Button
      className={cn(
        'btn-responsive',
        fullWidthOnMobile && 'w-full sm:w-auto',
        hideTextOnMobile && 'sm:px-6',
        className
      )}
      {...props}
    >
      {icon && (
        <span className={cn(
          'flex-shrink-0',
          hideTextOnMobile ? 'sm:mr-2' : 'mr-2'
        )}>
          {icon}
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
