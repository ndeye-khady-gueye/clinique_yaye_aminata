import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Smile, Frown, Meh, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponsiveCustomerSatisfactionMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'excellent' | 'good' | 'average' | 'poor' | 'critical';
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ResponsiveCustomerSatisfactionMetricCard: React.FC<ResponsiveCustomerSatisfactionMetricCardProps> = ({
  title,
  value,
  unit,
  description,
  icon,
  status = 'average',
  trend,
  size = 'md',
  className = ""
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 dark:text-green-400';
      case 'good':
        return 'text-blue-600 dark:text-blue-400';
      case 'average':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'poor':
        return 'text-orange-600 dark:text-orange-400';
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'excellent':
        return { variant: 'default' as const, label: 'Excellent', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
      case 'good':
        return { variant: 'default' as const, label: 'Bon', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
      case 'average':
        return { variant: 'secondary' as const, label: 'Moyen', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
      case 'poor':
        return { variant: 'destructive' as const, label: 'Faible', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' };
      case 'critical':
        return { variant: 'destructive' as const, label: 'Critique', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
      default:
        return { variant: 'secondary' as const, label: 'Inconnu', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };
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
  const statusBadge = getStatusBadge();

  return (
    <Card className={cn('card-responsive hover:shadow-lg transition-shadow', className)}>
      <CardHeader className={cn('flex flex-row items-center justify-between space-y-0 pb-2', sizeClasses.padding)}>
        <CardTitle className={cn('font-medium text-gray-600 dark:text-gray-400 truncate', sizeClasses.title)}>
          {title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          {icon && (
            <div className={cn('flex-shrink-0', getStatusColor(), sizeClasses.icon)}>
              {icon}
            </div>
          )}
          <Badge
            variant={statusBadge.variant}
            className={cn('text-xs', statusBadge.color)}
          >
            {statusBadge.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={cn('pt-0', sizeClasses.padding)}>
        <div className="space-y-2">
          <div className="flex items-baseline space-x-1">
            <span className={cn('font-bold text-gray-900 dark:text-white', sizeClasses.value)}>
              {value}
            </span>
            {unit && (
              <span className={cn('text-gray-500 dark:text-gray-400', sizeClasses.description)}>
                {unit}
              </span>
            )}
          </div>
          {description && (
            <p className={cn('text-gray-500 dark:text-gray-400 break-words', sizeClasses.description)}>
              {description}
            </p>
          )}
          {trend && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <span className={cn(
                  'font-medium',
                  trend.positive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400',
                  sizeClasses.description
                )}>
                  {trend.positive ? '+' : ''}{trend.value}%
                </span>
              </div>
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

export default ResponsiveCustomerSatisfactionMetricCard;