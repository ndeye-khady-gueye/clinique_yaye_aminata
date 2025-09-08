import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ResponsiveLoadingProps {
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

const ResponsiveLoading: React.FC<ResponsiveLoadingProps> = ({
  title = "Chargement...",
  description,
  size = 'md',
  fullScreen = false,
  className = ""
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4 sm:h-6 sm:w-6';
      case 'md':
        return 'h-6 w-6 sm:h-8 sm:w-8';
      case 'lg':
        return 'h-8 w-8 sm:h-12 sm:w-12';
      default:
        return 'h-6 w-6 sm:h-8 sm:w-8';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs sm:text-sm';
      case 'md':
        return 'text-sm sm:text-base';
      case 'lg':
        return 'text-base sm:text-lg';
      default:
        return 'text-sm sm:text-base';
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className={cn('animate-spin rounded-full border-b-2 border-primary mx-auto', getSpinnerSize())} />
          <p className={cn('mt-4 font-medium text-gray-900 dark:text-white', getTextSize())}>
            {title}
          </p>
          {description && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('card-responsive', className)}>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-responsive">{title}</CardTitle>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className={cn('animate-spin rounded-full border-b-2 border-primary mx-auto', getSpinnerSize())} />
            <p className={cn('mt-4 font-medium text-gray-900 dark:text-white', getTextSize())}>
              {title}
            </p>
            {description && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsiveLoading;
