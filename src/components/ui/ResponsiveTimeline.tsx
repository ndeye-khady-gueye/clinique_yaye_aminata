import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TimelineItem {
  id: string | number;
  title: string;
  description?: string;
  date: string;
  status?: 'completed' | 'current' | 'upcoming';
  icon?: React.ReactNode;
  color?: string;
}

interface ResponsiveTimelineProps {
  title?: string;
  description?: string;
  items: TimelineItem[];
  className?: string;
}

const ResponsiveTimeline: React.FC<ResponsiveTimelineProps> = ({
  title,
  description,
  items,
  className = ""
}) => {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'current':
        return 'bg-primary text-white';
      case 'upcoming':
        return 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400';
      default:
        return 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500';
      case 'current':
        return 'border-primary';
      case 'upcoming':
        return 'border-gray-300 dark:border-gray-600';
      default:
        return 'border-gray-300 dark:border-gray-600';
    }
  };

  return (
    <Card className={cn('card-responsive', className)}>
      {(title || description) && (
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-responsive">{title}</CardTitle>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </CardHeader>
      )}
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          {items.map((item, index) => (
            <div key={item.id} className="relative">
              {/* Ligne verticale */}
              {index < items.length - 1 && (
                <div className="absolute left-4 sm:left-6 top-8 sm:top-10 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
              )}
              
              <div className="flex items-start space-x-3 sm:space-x-4">
                {/* Icône/Point */}
                <div className={cn(
                  'flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium',
                  getStatusClasses(item.status || 'upcoming')
                )}>
                  {item.icon || (index + 1)}
                </div>
                
                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {item.date}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsiveTimeline;
