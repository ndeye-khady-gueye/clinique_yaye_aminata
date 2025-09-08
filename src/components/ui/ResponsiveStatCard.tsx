import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ResponsiveStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  status?: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ResponsiveStatCard: React.FC<ResponsiveStatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  color = 'primary',
  status = 'average',
  size = 'md',
  className = ""
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-primary';
      case 'secondary':
        return 'text-secondary';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'danger':
        return 'text-red-600 dark:text-red-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          title: 'text-xs sm:text-sm',
          value: 'text-lg sm:text-xl',
          description: 'text-xs',
          icon: 'h-4 w-4 sm:h-5 sm:w-5',
          padding: 'p-3 sm:p-4'
        };
      case 'md':
        return {
          title: 'text-xs sm:text-sm',
          value: 'text-xl sm:text-2xl',
          description: 'text-xs sm:text-sm',
          icon: 'h-5 w-5 sm:h-6 sm:w-6',
          padding: 'p-4 sm:p-6'
        };
      case 'lg':
        return {
          title: 'text-sm sm:text-base',
          value: 'text-2xl sm:text-3xl',
          description: 'text-sm sm:text-base',
          icon: 'h-6 w-6 sm:h-8 sm:w-8',
          padding: 'p-6 sm:p-8'
        };
      default:
        return {
          title: 'text-xs sm:text-sm',
          value: 'text-xl sm:text-2xl',
          description: 'text-xs sm:text-sm',
          icon: 'h-5 w-5 sm:h-6 sm:w-6',
          padding: 'p-4 sm:p-6'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <Card className={cn('card-responsive hover:shadow-lg transition-shadow', className)}>
      <CardHeader className={cn('flex flex-row items-center justify-between space-y-0 pb-2', sizeClasses.padding)}>
        <CardTitle className={cn('font-medium text-gray-600 dark:text-gray-400 truncate', sizeClasses.title)}>
          {title}
        </CardTitle>
        {icon && (
          <div className={cn('flex-shrink-0', getColorClasses(), sizeClasses.icon)}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className={cn('pt-0', sizeClasses.padding)}>
        <div className="space-y-2">
          <div className={cn('font-bold text-gray-900 dark:text-white', sizeClasses.value)}>
            {value}
          </div>
          {description && (
            <p className={cn('text-gray-500 dark:text-gray-400 break-words', sizeClasses.description)}>
              {description}
            </p>
          )}
          {trend && (
            <div className="flex items-center space-x-2">
              <Badge
                variant={trend.positive ? 'default' : 'destructive'}
                className="text-xs"
              >
                {trend.positive ? '+' : ''}{trend.value}%
              </Badge>
              <span className={cn('text-gray-500 dark:text-gray-400', sizeClasses.description)}>
                {trend.label}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsiveStatCard;
