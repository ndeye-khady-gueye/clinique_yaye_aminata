import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatItem {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
}

interface ResponsiveStatsProps {
  title?: string;
  description?: string;
  stats: StatItem[];
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
}

const ResponsiveStats: React.FC<ResponsiveStatsProps> = ({
  title,
  description,
  stats,
  columns = { default: 1, sm: 2, lg: 4 },
  className = ""
}) => {
  const getGridCols = () => {
    const baseCols = columns.default || 1;
    const smCols = columns.sm || baseCols;
    const mdCols = columns.md || smCols;
    const lgCols = columns.lg || mdCols;
    const xlCols = columns.xl || lgCols;

    return `grid-cols-${baseCols} sm:grid-cols-${smCols} md:grid-cols-${mdCols} lg:grid-cols-${lgCols} xl:grid-cols-${xlCols}`;
  };

  return (
    <div className={cn('space-y-4 sm:space-y-6', className)}>
      {(title || description) && (
        <div className="text-center sm:text-left">
          {title && (
            <h2 className="text-responsive-lg font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-responsive text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      <div className={cn('grid gap-4 sm:gap-6', getGridCols())}>
        {stats.map((stat, index) => (
          <Card key={index} className="card-responsive hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                {stat.title}
              </CardTitle>
              {stat.icon && (
                <div className={cn('flex-shrink-0', stat.color)}>
                  {stat.icon}
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              {stat.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-words">
                  {stat.description}
                </p>
              )}
              {stat.trend && (
                <div className="flex items-center mt-2">
                  <span
                    className={cn(
                      'text-xs font-medium',
                      stat.trend.positive
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {stat.trend.positive ? '+' : ''}{stat.trend.value}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    {stat.trend.label}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResponsiveStats;
